from __future__ import annotations

from collections.abc import AsyncIterator

from app.core.errors import PayloadTooLargeError


async def read_request_body_limited(
    chunks: AsyncIterator[bytes],
    max_bytes: int,
) -> bytes:
    size = 0
    parts: list[bytes] = []

    async for chunk in chunks:
        if not chunk:
            continue
        size += len(chunk)
        if size > max_bytes:
            raise PayloadTooLargeError()
        parts.append(chunk)

    return b"".join(parts)

