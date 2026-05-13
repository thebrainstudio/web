"""
Download a curated set of real neuron reconstructions from NeuroMorpho.org
for the Brain Studio's Cellular View.

NeuroMorpho.org REST API:
    https://neuromorpho.org/api/neuron/id/{id}         metadata
    https://neuromorpho.org/dableFiles/{archive}/CNG%20version/{name}.CNG.swc

For each curated neuron we fetch metadata, derive the SWC URL, download the
file, and write a sibling .meta.json with the fields the frontend needs.
Also writes a top-level manifest.json + MANIFEST.md.

Licensing: NeuroMorpho.org reconstructions are individually licensed by the
contributing lab. Most are CC BY; the manifest carries the citation so the
site can credit them.

Usage:
    python backend/scripts/download_cellular_data.py
"""

from __future__ import annotations

import json
import time
import urllib.parse
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.request import Request, urlopen

OUT_DIR = (
    Path(__file__).resolve().parents[2] / "frontend" / "public" / "cellular"
)
SWC_DIR = OUT_DIR / "swc"
OUT_DIR.mkdir(parents=True, exist_ok=True)
SWC_DIR.mkdir(parents=True, exist_ok=True)

API = "https://neuromorpho.org/api/neuron/id/{id}"
SWC_URL = "https://neuromorpho.org/dableFiles/{archive}/CNG%20version/{name}.CNG.swc"

# UA — some servers reject bare curl requests
HEADERS = {
    "User-Agent": "BrainStudio/0.1 (research; +https://brain-studio-kappa.vercel.app)"
}


@dataclass
class Curated:
    nmo_id: int
    region_key: str  # one of our 20 region ids (or "supporting")
    role: str  # short description for the manifest
    surprising: str  # one-line gloss in the Jungian sensibility


# Curated picks. Mix of cell types + regions.
# These were verified working at the time of writing; if NeuroMorpho ever
# reshuffles its archive paths, re-fetch and re-validate.
CURATED: list[Curated] = [
    Curated(
        nmo_id=227,
        region_key="hipp_left",
        role="CA1 pyramidal cell, hippocampus (rat). Amaral lab. The canonical hippocampal neuron.",
        surprising="The cell that knits an afternoon into a memory you can return to.",
    ),
    Curated(
        nmo_id=5515,
        region_key="ifg_left",  # closest motor-cortex proxy in our region set
        role="Layer 5 pyramidal cell, motor cortex (rat).",
        surprising="A switchboard between intention and movement.",
    ),
    Curated(
        nmo_id=43,
        region_key="precuneus",
        role="Cerebellar Purkinje cell — the most visually spectacular reconstruction in the database.",
        surprising="One dendritic arbor receives ~150,000 distinct parallel-fibre synapses.",
    ),
    Curated(
        nmo_id=15,
        region_key="amyg_left",
        role="Cortical pyramidal cell (proxy for amygdaloid pyramidal; NMO has limited amygdala reconstructions).",
        surprising="The body's salience-detector, built from the same pyramidal template as everywhere else in cortex.",
    ),
    Curated(
        nmo_id=33,
        region_key="dmpfc",
        role="Cortical pyramidal cell — used as a prefrontal proxy.",
        surprising="The architecture that makes a thought about a thought possible.",
    ),
    Curated(
        nmo_id=149,
        region_key="agl_left",
        role="Cortical pyramidal cell — used as an angular-gyrus proxy.",
        surprising="A heteromodal hub where senses translate into ideas.",
    ),
]


def _get_json(url: str) -> dict[str, Any]:
    req = Request(url, headers=HEADERS)
    with urlopen(req, timeout=30) as r:  # noqa: S310 (trusted endpoint)
        return json.loads(r.read())


def _get_bytes(url: str) -> bytes:
    req = Request(url, headers=HEADERS)
    with urlopen(req, timeout=60) as r:  # noqa: S310
        return r.read()


def _slugify_archive(archive: str) -> str:
    """NeuroMorpho's archive folder names are case-sensitive on disk and
    don't always match the API's `archive` field. Heuristic: lowercase
    works for most labs; a few use original case. Try both."""
    return archive.replace(" ", "_").lower()


def _try_swc(meta: dict[str, Any]) -> tuple[str, bytes] | None:
    name = meta["neuron_name"]
    candidates = [
        meta["archive"],
        _slugify_archive(meta["archive"]),
        meta["archive"].lower(),
        meta["archive"].title(),
    ]
    # dedupe while preserving order
    seen: set[str] = set()
    candidates = [c for c in candidates if not (c in seen or seen.add(c))]
    for arch in candidates:
        url = SWC_URL.format(archive=urllib.parse.quote(arch), name=name)
        try:
            data = _get_bytes(url)
            if data and not data.lstrip().lower().startswith(b"<!doctype"):
                return url, data
        except Exception:  # noqa: BLE001
            continue
    return None


def _meta_for(meta: dict[str, Any], c: Curated, src_url: str) -> dict[str, Any]:
    return {
        "nmo_id": meta["neuron_id"],
        "name": meta["neuron_name"],
        "region_key": c.region_key,
        "role": c.role,
        "surprising": c.surprising,
        "neuromorpho_region": meta.get("brain_region"),
        "cell_type": meta.get("cell_type"),
        "species": meta.get("species"),
        "archive": meta.get("archive"),
        "reference_pmid": meta.get("reference_pmid"),
        "source_url": src_url,
        "neuromorpho_page": f"https://neuromorpho.org/neuron_info.jsp?neuron_name={meta['neuron_name']}",
    }


def main() -> None:
    manifest: list[dict[str, Any]] = []
    for c in CURATED:
        api_url = API.format(id=c.nmo_id)
        try:
            meta = _get_json(api_url)
        except Exception as e:  # noqa: BLE001
            print(f"[cellular] {c.nmo_id}: metadata fetch failed — {e}")
            continue

        name = meta["neuron_name"]
        print(f"[cellular] NMO_{c.nmo_id:05d} {name}  ({meta['species']}, {meta['archive']})")

        attempt = _try_swc(meta)
        if attempt is None:
            print(f"  -- SWC not reachable from any archive-path variant.")
            continue
        src_url, swc_bytes = attempt
        out_swc = SWC_DIR / f"NMO_{c.nmo_id:05d}.swc"
        out_swc.write_bytes(swc_bytes)
        out_meta = SWC_DIR / f"NMO_{c.nmo_id:05d}.meta.json"
        m = _meta_for(meta, c, src_url)
        m["filename"] = out_swc.name
        m["bytes"] = len(swc_bytes)
        out_meta.write_text(json.dumps(m, indent=2), encoding="utf-8")
        manifest.append(m)
        print(f"  ok {out_swc.name}  ({len(swc_bytes)/1024:.1f} KB)")
        time.sleep(0.4)  # polite

    (OUT_DIR / "manifest.json").write_text(
        json.dumps({"neurons": manifest}, indent=2), encoding="utf-8"
    )
    md_lines = [
        "# Cellular dataset manifest\n",
        "Real neuron reconstructions from [NeuroMorpho.org](https://neuromorpho.org) used in the Cellular View.\n",
        "\n| NMO ID | Name | Region key | Species | Archive | Cell type | File |\n",
        "|--------|------|------------|---------|---------|-----------|------|\n",
    ]
    for m in manifest:
        ct = m.get("cell_type") or []
        ct_s = ", ".join(ct) if isinstance(ct, list) else str(ct)
        md_lines.append(
            f"| NMO_{m['nmo_id']:05d} | {m['name']} | {m['region_key']} | "
            f"{m['species']} | {m['archive']} | {ct_s} | "
            f"[swc](swc/{m['filename']}) |\n"
        )
    md_lines.append(
        "\n## Licensing\n\n"
        "NeuroMorpho.org reconstructions are licensed per contributing archive (most CC BY). "
        "Each cell carries `reference_pmid` and `neuromorpho_page` so the citation is one click away.\n"
    )
    (OUT_DIR / "MANIFEST.md").write_text("".join(md_lines), encoding="utf-8")
    print(f"[cellular] wrote {len(manifest)} neurons + manifest")


if __name__ == "__main__":
    main()
