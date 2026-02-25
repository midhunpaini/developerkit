from __future__ import annotations

from collections.abc import Mapping


def normalize_headers(headers: Mapping[str, str]) -> dict[str, str]:
    return {str(key).lower(): str(value) for key, value in headers.items()}


def get_client_ip(headers: Mapping[str, str], fallback_ip: str | None) -> str:
    forwarded_for = headers.get("x-forwarded-for", "")
    if forwarded_for:
        first = forwarded_for.split(",")[0].strip()
        if first:
            return first
    return fallback_ip or ""
