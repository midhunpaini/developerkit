from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator

import orjson
from fastapi import APIRouter, Depends, Path, Request
from fastapi.responses import StreamingResponse

from app.api.deps import get_db_pool, get_queries, get_settings, get_stream_hub
from app.core.constants import API_PREFIX, ENDPOINT_ID_PATTERN
from app.schemas.stream import StreamReadyEvent
from app.services import endpoint_service
from app.utils.time import isoformat_z, utc_now

router = APIRouter(prefix=f"{API_PREFIX}/endpoints", tags=["stream"])


def _sse_event(event: str, data: dict[str, object]) -> bytes:
    payload = orjson.dumps(data).decode("utf-8")
    return f"event: {event}\ndata: {payload}\n\n".encode("utf-8")


def _sse_comment(text: str) -> bytes:
    return f": {text}\n\n".encode("utf-8")


@router.get("/{endpoint_id}/stream")
async def stream_endpoint_requests(
    request: Request,
    endpoint_id: str = Path(..., pattern=ENDPOINT_ID_PATTERN.pattern),
    pool=Depends(get_db_pool),
    queries: dict[str, str] = Depends(get_queries),
    settings=Depends(get_settings),
    stream_hub=Depends(get_stream_hub),
) -> StreamingResponse:
    await endpoint_service.ensure_active_endpoint(pool, queries, endpoint_id)

    async def event_source() -> AsyncIterator[bytes]:
        subscriber = await stream_hub.subscribe(endpoint_id)
        try:
            ready = StreamReadyEvent(
                endpoint_id=endpoint_id,
                connected_at=isoformat_z(utc_now()),
            )
            yield _sse_event("stream.ready", ready.model_dump(by_alias=True))

            while True:
                if await request.is_disconnected():
                    break

                try:
                    message = await asyncio.wait_for(
                        subscriber.queue.get(),
                        timeout=settings.sse_heartbeat_seconds,
                    )
                except asyncio.TimeoutError:
                    yield _sse_comment("keepalive")
                    continue

                yield _sse_event(message.event, message.data)
        finally:
            await stream_hub.unsubscribe(endpoint_id, subscriber.subscriber_id)

    headers = {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
    }
    return StreamingResponse(event_source(), media_type="text/event-stream", headers=headers)

