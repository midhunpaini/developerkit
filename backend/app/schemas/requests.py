from __future__ import annotations

from typing import Any

from app.schemas.common import CamelModel


class WebhookRequestDTO(CamelModel):
    id: str
    endpoint_id: str
    method: str
    path: str
    received_at: str
    status_code: int
    ip: str
    headers: dict[str, str]
    content_type: str
    body_size_bytes: int
    raw_body: str
    parsed_json: Any | None = None


class ListRequestsResponse(CamelModel):
    items: list[WebhookRequestDTO]
    next_cursor: str | None = None


class IngestAckResponse(CamelModel):
    accepted: bool
    request_id: str

