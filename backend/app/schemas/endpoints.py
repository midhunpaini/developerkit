from __future__ import annotations

from app.schemas.common import CamelModel


class CreateEndpointResponse(CamelModel):
    endpoint_id: str
    hook_url: str
    created_at: str
    expires_at: str


class EndpointRecord(CamelModel):
    endpoint_id: str
    created_at: str
    expires_at: str

