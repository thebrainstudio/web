"""
Bulk-precompute TRIBE predictions on Colab Pro and dump them as the JSONs
the frontend already knows how to consume from `shared/predictions/`.

This is the recommended bridge until Phase 11 wires real-time inference.
Run this as a Colab Pro notebook with a GPU runtime (Llama-3.2-3B in
fp16 needs ~6 GB; the TRIBE checkpoint adds another ~700 MB).

Usage outline (you'll adapt the imports once Meta's `tribe` package is
public; until then this is a scaffold with the right shape):

    !pip install torch transformers nilearn nibabel pyyaml
    !pip install -e git+https://github.com/facebookresearch/tribe@main
    !huggingface-cli download facebook/tribev2 --local-dir ./tribev2

    from precompute_colab import precompute_text_stimuli, STIMULI

    precompute_text_stimuli(
        ckpt_dir="./tribev2",
        output_dir="./predictions",
        stimuli=STIMULI,
    )

The output directory mirrors `shared/predictions/`. Drop the JSONs into
the repo and the frontend picks them up via /api/predictions/{id}.
"""

from __future__ import annotations

import json
import time
from pathlib import Path

# These are the stimulus pairs the site already cares about. Add new
# entries to seed the cache before a session lands.
STIMULI: list[tuple[str, str]] = [
    (
        "mirror_borges_thought",
        "Time is a river that carries me, but I am the river. It is a tiger that devours me, but I am the tiger.",
    ),
    (
        "mirror_grief_list",
        "There is a list of things she has not done since you left: boiled water, walked past the bakery, opened the back drawer.",
    ),
    (
        "mirror_lullaby_line",
        "Sleep now, little one, while the moon is round and the rain has forgotten its way home.",
    ),
    (
        "cc_loneliness_english",
        "She came home to the empty kitchen and felt a particular loneliness — the kind that sits in your chest like a stone you can't quite warm.",
    ),
    (
        "cc_loneliness_thai",
        "เธอกลับมาที่ห้องครัวว่างเปล่า และรู้สึก เหงา — เหงาแบบที่นั่งอยู่ในอกเหมือนหินก้อนหนึ่งที่ไม่ยอมอุ่นขึ้น",
    ),
    (
        "cc_mother_english",
        "She remembered her mother's hands, and the way they smelled of jasmine after she had been in the garden all afternoon.",
    ),
    (
        "cc_mother_thai",
        "เธอจำมือของแม่ได้ และวิธีที่มือเหล่านั้นมีกลิ่นของดอกมะลิหลังจากที่ท่านอยู่ในสวนตลอดบ่าย",
    ),
]


def precompute_text_stimuli(
    ckpt_dir: str,
    output_dir: str,
    stimuli: list[tuple[str, str]],
) -> None:
    """
    For each (stimulus_id, text), run TRIBE forward and write a JSON to
    `output_dir/{stimulus_id}.json` in the schema the frontend expects.

    This function is a scaffold: the body uses Meta's `tribe` package
    APIs that are not yet public. The skeleton — loading, looping,
    writing the JSON in the right schema — is correct.
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # --- TODO_CONTENT: real model load --------------------------------
    # from tribe.models import FmriEncoder
    # from tribe.features.text import HuggingFaceText
    #
    # model = FmriEncoder.load_from_checkpoint(f"{ckpt_dir}/best.ckpt")
    # model.eval().cuda()
    # text_feature = HuggingFaceText(
    #     model_name="meta-llama/Llama-3.2-3B",
    #     layers=[0.5, 0.75, 1.0],
    #     device="cuda",
    # )
    # ------------------------------------------------------------------

    for stim_id, text in stimuli:
        # --- TODO_CONTENT: real forward -------------------------------
        # features = text_feature.extract(text)         # [T, D]
        # per_vertex = model.predict(features).numpy()  # [V,]
        # regions = project_to_20_regions(per_vertex)
        # --------------------------------------------------------------
        regions: dict[str, float] = {}  # filled by the real call above

        payload = {
            "stimulus_id": stim_id,
            "modality": "text",
            "input_preview": text[:200],
            "regions": regions,
            "metadata": {
                "model_version": "tribev2",
                "checkpoint_sha": "f894e783",
                "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "hemodynamic_lag_s": 5,
            },
        }
        out = Path(output_dir) / f"{stim_id}.json"
        with out.open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        print(f"wrote {out}")


if __name__ == "__main__":
    # Smoke test path — writes empty predictions so you can verify the
    # frontend wiring without GPUs.
    precompute_text_stimuli(
        ckpt_dir=str(Path.home() / ".cache/huggingface/hub/models--facebook--tribev2"),
        output_dir=str(Path(__file__).resolve().parent.parent / "shared" / "predictions"),
        stimuli=STIMULI,
    )
