from __future__ import annotations

import asyncio

import pytest

from app.api.routes.stream import _sse_comment, _sse_event
from app.services.stream_hub import StreamHub


@pytest.mark.asyncio
async def test_stream_hub_publish_delivers_message():
    hub = StreamHub(max_queue_size=4)
    subscriber = await hub.subscribe("abc123def4")

    await hub.publish("abc123def4", "request.created", {"request": {"id": "req_1"}})

    message = await asyncio.wait_for(subscriber.queue.get(), timeout=0.1)
    assert message.event == "request.created"
    assert message.data["request"]["id"] == "req_1"

    await hub.unsubscribe("abc123def4", subscriber.subscriber_id)
    await hub.close()


@pytest.mark.asyncio
async def test_stream_hub_drops_oldest_when_queue_is_full():
    hub = StreamHub(max_queue_size=1)
    subscriber = await hub.subscribe("abc123def4")

    await hub.publish("abc123def4", "request.created", {"request": {"id": "old"}})
    await hub.publish("abc123def4", "request.created", {"request": {"id": "new"}})

    message = await asyncio.wait_for(subscriber.queue.get(), timeout=0.1)
    assert message.data["request"]["id"] == "new"


def test_sse_format_helpers():
    event_bytes = _sse_event("stream.ready", {"endpointId": "abc123def4"})
    comment_bytes = _sse_comment("keepalive")

    event_text = event_bytes.decode("utf-8")
    comment_text = comment_bytes.decode("utf-8")

    assert "event: stream.ready" in event_text
    assert 'data: {"endpointId":"abc123def4"}' in event_text
    assert comment_text == ": keepalive\n\n"

