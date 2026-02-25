from __future__ import annotations

from app.schemas.common import CamelModel
from app.schemas.requests import WebhookRequestDTO


class StreamReadyEvent(CamelModel):
    endpoint_id: str
    connected_at: str


class StreamRequestCreatedEvent(CamelModel):
    request: WebhookRequestDTO

