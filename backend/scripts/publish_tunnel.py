"""
Publish the current Cloudflare tunnel URL to the frontend's discovery
endpoint at https://brain-studio-kappa.vercel.app/api/tunnel.

Usage:
    python scripts/publish_tunnel.py <https-url>

Reads the shared secret from the TUNNEL_PUBLISH_SECRET environment
variable (must match what's set in the Vercel project's env vars).

Designed to be called by the launcher script (start_with_tunnel.ps1)
once it parses the trycloudflare.com URL out of cloudflared's stderr.
"""

from __future__ import annotations

import json
import os
import sys
from urllib import request as urllib_request
from urllib.error import HTTPError, URLError

DEFAULT_DISCOVERY_URL = (
    "https://brain-studio-kappa.vercel.app/api/tunnel"
)


def publish(tunnel_url: str, *, engine: str = "tribe-v2") -> int:
    secret = os.environ.get("TUNNEL_PUBLISH_SECRET")
    if not secret:
        print(
            "[publish_tunnel] TUNNEL_PUBLISH_SECRET is not set; refusing to "
            "publish. Set it both here and on the Vercel project (must match).",
            file=sys.stderr,
        )
        return 2

    discovery_url = os.environ.get(
        "TRIBE_DISCOVERY_URL", DEFAULT_DISCOVERY_URL
    )
    body = json.dumps({"url": tunnel_url, "engine": engine}).encode("utf-8")
    headers = {
        "content-type": "application/json",
        "x-tunnel-secret": secret,
    }
    req = urllib_request.Request(
        discovery_url, data=body, headers=headers, method="POST"
    )
    try:
        with urllib_request.urlopen(req, timeout=10) as resp:
            payload = json.loads(resp.read())
            print(
                f"[publish_tunnel] OK: published {tunnel_url} → {discovery_url}\n"
                f"  response: {payload}"
            )
            return 0
    except HTTPError as e:
        print(
            f"[publish_tunnel] FAIL {e.code}: {e.read().decode('utf-8', errors='replace')}",
            file=sys.stderr,
        )
        return 1
    except URLError as e:
        print(f"[publish_tunnel] FAIL: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(
            "Usage: python scripts/publish_tunnel.py <https-url>",
            file=sys.stderr,
        )
        sys.exit(2)
    sys.exit(publish(sys.argv[1]))
