from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class StreamMessage:
    event: str
    data: dict[str, Any]


@dataclass(slots=True)
class StreamSubscriber:
    subscriber_id: int
    queue: asyncio.Queue[StreamMessage]


@dataclass(slots=True)
class StreamHub:
    max_queue_size: int
    _subscribers: dict[str, dict[int, StreamSubscriber]] = field(default_factory=dict)
    _lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    _next_id: int = 1

    async def subscribe(self, endpoint_id: str) -> StreamSubscriber:
        async with self._lock:
            subscriber_id = self._next_id
            self._next_id += 1
            subscriber = StreamSubscriber(
                subscriber_id=subscriber_id,
                queue=asyncio.Queue(maxsize=self.max_queue_size),
            )
            endpoint_subscribers = self._subscribers.setdefault(endpoint_id, {})
            endpoint_subscribers[subscriber_id] = subscriber
            return subscriber

    async def unsubscribe(self, endpoint_id: str, subscriber_id: int) -> None:
        async with self._lock:
            endpoint_subscribers = self._subscribers.get(endpoint_id)
            if not endpoint_subscribers:
                return
            endpoint_subscribers.pop(subscriber_id, None)
            if not endpoint_subscribers:
                self._subscribers.pop(endpoint_id, None)

    async def publish(self, endpoint_id: str, event: str, data: dict[str, Any]) -> None:
        async with self._lock:
            endpoint_subscribers = list(self._subscribers.get(endpoint_id, {}).values())

        if not endpoint_subscribers:
            return

        message = StreamMessage(event=event, data=data)
        for subscriber in endpoint_subscribers:
            queue = subscriber.queue
            if queue.full():
                try:
                    queue.get_nowait()
                except asyncio.QueueEmpty:
                    pass
            try:
                queue.put_nowait(message)
            except asyncio.QueueFull:
                # If a slow consumer immediately refills after dropping one item,
                # skip delivering this event to keep publisher non-blocking.
                continue

    async def close(self) -> None:
        async with self._lock:
            self._subscribers.clear()

