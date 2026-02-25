from __future__ import annotations

import secrets
import string

from app.core.constants import ENDPOINT_ID_LENGTH, ENDPOINT_ID_PATTERN

_ALPHABET = string.ascii_lowercase + string.digits


def generate_endpoint_id(length: int = ENDPOINT_ID_LENGTH) -> str:
    return "".join(secrets.choice(_ALPHABET) for _ in range(length))


def is_valid_endpoint_id(value: str) -> bool:
    return bool(ENDPOINT_ID_PATTERN.fullmatch(value))

