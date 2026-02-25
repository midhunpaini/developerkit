from __future__ import annotations

from app.schemas.endpoints import CreateEndpointResponse


def test_create_endpoint(client, monkeypatch):
    async def fake_create_endpoint(_pool, _queries, _public_base_url, _ttl_seconds):
        return CreateEndpointResponse(
            endpoint_id="abc123def4",
            hook_url="http://localhost:8000/hook/abc123def4",
            created_at="2026-02-25T00:00:00Z",
            expires_at="2026-02-26T00:00:00Z",
        )

    monkeypatch.setattr("app.api.routes.endpoints.endpoint_service.create_endpoint", fake_create_endpoint)

    response = client.post("/api/endpoints")
    assert response.status_code == 201
    payload = response.json()
    assert payload["endpointId"] == "abc123def4"
    assert payload["hookUrl"].endswith("/hook/abc123def4")

