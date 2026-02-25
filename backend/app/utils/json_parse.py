from __future__ import annotations

from typing import Any

import orjson


def parse_json_if_applicable(content_type: str, raw_body: str) -> Any | None:
    if "json" not in content_type.lower():
        return None
    try:
        return orjson.loads(raw_body)
    except orjson.JSONDecodeError:
        return None

