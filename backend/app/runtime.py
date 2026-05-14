"""
Runtime utilities: in-memory LRU cache, sliding-window rate limiter,
request-id middleware, and a small Prometheus-style metrics sink.

Everything in this module is process-local so it's safe for a
single-instance local deployment behind a Cloudflare Tunnel. If we
ever scale horizontally, swap each of these for a Redis-backed
equivalent (caches.py, rate_limit.py, etc.).
"""

from __future__ import annotations

import hashlib
import logging
import secrets
import threading
import time
from collections import OrderedDict, defaultdict, deque
from typing import Any, Callable

logger = logging.getLogger(__name__)

# ── Prediction cache ──────────────────────────────────────────────────


class PredictionCache:
    """
    Thread-safe LRU cache keyed on (sha256(text), locale, model_version).

    Stale-after window is configurable; entries are recomputed on read
    if older than the window. The cache is correctness-preserving — same
    input + same model produces the same output.
    """

    def __init__(self, maxsize: int = 512, ttl_seconds: float = 24 * 3600) -> None:
        self.maxsize = maxsize
        self.ttl_seconds = ttl_seconds
        self._lock = threading.RLock()
        self._store: OrderedDict[str, tuple[float, dict[str, Any]]] = OrderedDict()

    @staticmethod
    def make_key(text: str, locale: str, model_version: str) -> str:
        h = hashlib.sha256(text.encode("utf-8")).hexdigest()[:32]
        return f"{model_version}::{locale}::{h}"

    def get(self, key: str) -> dict[str, Any] | None:
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            ts, payload = entry
            if (time.time() - ts) > self.ttl_seconds:
                self._store.pop(key, None)
                return None
            # Touch for LRU semantics.
            self._store.move_to_end(key)
            return payload

    def put(self, key: str, payload: dict[str, Any]) -> None:
        with self._lock:
            self._store[key] = (time.time(), payload)
            self._store.move_to_end(key)
            while len(self._store) > self.maxsize:
                self._store.popitem(last=False)

    def clear(self) -> None:
        with self._lock:
            self._store.clear()

    def size(self) -> int:
        with self._lock:
            return len(self._store)


# ── Rate limiter ─────────────────────────────────────────────────────


class SlidingWindowLimiter:
    """
    Two-tier sliding-window rate limiter, per-IP, in-memory.

    Defaults match the Phase 10.1.5 brief:
      - 30 requests per minute  (short-burst protection)
      - 1000 requests per day   (daily hard cap)

    Returns (allowed, retry_after_seconds, headers_dict) on each check.
    The headers dict can be merged into the FastAPI response so
    well-behaved clients can self-throttle.
    """

    def __init__(
        self,
        per_minute: int = 30,
        per_day: int = 1000,
    ) -> None:
        self.per_minute = per_minute
        self.per_day = per_day
        self._lock = threading.RLock()
        self._minute: dict[str, deque[float]] = defaultdict(deque)
        self._day: dict[str, deque[float]] = defaultdict(deque)

    def check(self, ip: str) -> tuple[bool, float, dict[str, str]]:
        now = time.time()
        with self._lock:
            mq = self._minute[ip]
            dq = self._day[ip]
            # Evict expired entries.
            while mq and (now - mq[0]) >= 60:
                mq.popleft()
            while dq and (now - dq[0]) >= 86400:
                dq.popleft()

            minute_remaining = self.per_minute - len(mq)
            day_remaining = self.per_day - len(dq)

            if minute_remaining <= 0:
                retry_after = 60 - (now - mq[0])
                return False, max(1.0, retry_after), self._headers(
                    minute_remaining, day_remaining, now, mq, dq
                )
            if day_remaining <= 0:
                retry_after = 86400 - (now - dq[0])
                return False, max(1.0, retry_after), self._headers(
                    minute_remaining, day_remaining, now, mq, dq
                )

            mq.append(now)
            dq.append(now)
            return True, 0.0, self._headers(
                minute_remaining - 1, day_remaining - 1, now, mq, dq
            )

    def _headers(
        self,
        minute_remaining: int,
        day_remaining: int,
        now: float,
        mq: deque[float],
        dq: deque[float],
    ) -> dict[str, str]:
        # X-RateLimit-* headers communicate the tighter of the two limits.
        if minute_remaining <= day_remaining:
            reset_at = (mq[0] if mq else now) + 60
            return {
                "X-RateLimit-Limit": str(self.per_minute),
                "X-RateLimit-Remaining": str(max(0, minute_remaining)),
                "X-RateLimit-Reset": str(int(reset_at)),
                "X-RateLimit-Window": "60s",
            }
        reset_at = (dq[0] if dq else now) + 86400
        return {
            "X-RateLimit-Limit": str(self.per_day),
            "X-RateLimit-Remaining": str(max(0, day_remaining)),
            "X-RateLimit-Reset": str(int(reset_at)),
            "X-RateLimit-Window": "24h",
        }


# ── Request ID helper ────────────────────────────────────────────────


def new_request_id() -> str:
    """16-byte hex string — long enough to be unique, short enough to
    eyeball in logs."""
    return secrets.token_hex(16)


def hash_ip(ip: str) -> str:
    """Hash the IP for log privacy — we don't want raw IPs in logs."""
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()[:12]


# ── Prometheus-ish metrics ───────────────────────────────────────────


class Metrics:
    """Process-local counters + a coarse latency histogram."""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self.requests_total: dict[tuple[str, int], int] = defaultdict(int)
        # bucket boundaries in milliseconds for the latency histogram
        self._latency_buckets = (50, 100, 200, 500, 1000, 2000, 5000, 10000, 30000)
        self.latency_hist: dict[int, int] = defaultdict(int)
        self.latency_sum_ms: float = 0.0
        self.latency_count: int = 0
        self.cache_hits: int = 0
        self.cache_misses: int = 0
        self.start_ts = time.time()

    def record_request(self, path: str, status: int, latency_ms: float) -> None:
        with self._lock:
            self.requests_total[(path, status)] += 1
            for b in self._latency_buckets:
                if latency_ms <= b:
                    self.latency_hist[b] += 1
            self.latency_sum_ms += latency_ms
            self.latency_count += 1

    def record_cache(self, hit: bool) -> None:
        with self._lock:
            if hit:
                self.cache_hits += 1
            else:
                self.cache_misses += 1

    def uptime(self) -> float:
        return time.time() - self.start_ts

    def to_prometheus(self) -> str:
        with self._lock:
            lines = [
                "# HELP brain_studio_requests_total Total requests by path + status",
                "# TYPE brain_studio_requests_total counter",
            ]
            for (path, status), count in sorted(self.requests_total.items()):
                lines.append(
                    f'brain_studio_requests_total{{path="{path}",status="{status}"}} {count}'
                )
            lines += [
                "",
                "# HELP brain_studio_latency_ms_bucket Request latency in ms (cumulative)",
                "# TYPE brain_studio_latency_ms_bucket histogram",
            ]
            cumulative = 0
            for b in self._latency_buckets:
                cumulative = max(cumulative, self.latency_hist.get(b, 0))
                lines.append(f'brain_studio_latency_ms_bucket{{le="{b}"}} {cumulative}')
            lines.append(f'brain_studio_latency_ms_bucket{{le="+Inf"}} {self.latency_count}')
            lines.append(f"brain_studio_latency_ms_sum {self.latency_sum_ms:.2f}")
            lines.append(f"brain_studio_latency_ms_count {self.latency_count}")
            lines += [
                "",
                "# HELP brain_studio_cache Cache hit/miss counters",
                "# TYPE brain_studio_cache counter",
                f"brain_studio_cache_hits {self.cache_hits}",
                f"brain_studio_cache_misses {self.cache_misses}",
                "",
                "# HELP brain_studio_uptime_seconds Process uptime",
                "# TYPE brain_studio_uptime_seconds gauge",
                f"brain_studio_uptime_seconds {self.uptime():.2f}",
            ]
            return "\n".join(lines) + "\n"


# Singletons (FastAPI imports these)
prediction_cache = PredictionCache()
rate_limiter = SlidingWindowLimiter()
metrics = Metrics()


# ── Helpers ──────────────────────────────────────────────────────────


def confidence_from_activations(activations: dict[str, float]) -> float:
    """
    Peakedness measure: how much does the top region stand out from the
    rest? Returns a value in [0, 1] that the EncoderResult surfaces as
    `confidence`. Not a probability — a "the model picked specific
    regions" score.
    """
    if not activations:
        return 0.0
    values = list(activations.values())
    n = len(values)
    if n < 2:
        return 0.0
    top = max(values)
    mean = sum(values) / n
    std = (sum((v - mean) ** 2 for v in values) / n) ** 0.5 or 1.0
    z = (top - mean) / std
    # Sigmoid squash to [0, 1] with a sensible centre at z=1.5
    import math

    return round(1.0 / (1.0 + math.exp(-(z - 1.5))), 4)
