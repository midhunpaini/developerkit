from __future__ import annotations

from app.schemas.endpoints import EndpointRecord
from app.schemas.requests import ListRequestsResponse, WebhookRequestDTO


async def _fake_active_endpoint(*_args, **_kwargs):
    return EndpointRecord(
        endpoint_id="abc123def4",
        created_at="2026-02-25T00:00:00Z",
        expires_at="2026-02-26T00:00:00Z",
    )


def test_list_requests(client, monkeypatch):
    async def fake_list_requests(_pool, _queries, endpoint_id, *, limit, before):
        assert endpoint_id == "abc123def4"
        assert limit == 50
        assert before is None
        return ListRequestsResponse(
            items=[
                WebhookRequestDTO(
                    id="req_1",
                    endpoint_id=endpoint_id,
                    method="POST",
                    path=f"/hook/{endpoint_id}",
                    received_at="2026-02-25T00:00:00Z",
                    status_code=202,
                    ip="127.0.0.1",
                    headers={"content-type": "application/json"},
                    content_type="application/json",
                    body_size_bytes=17,
                    raw_body='{"hello":"world"}',
                    parsed_json={"hello": "world"},
                )
            ],
            next_cursor="next-cursor",
        )

    monkeypatch.setattr("app.api.routes.requests.endpoint_service.ensure_active_endpoint", _fake_active_endpoint)
    monkeypatch.setattr("app.api.routes.requests.request_service.list_requests", fake_list_requests)

    response = client.get("/api/endpoints/abc123def4/requests")
    assert response.status_code == 200
    payload = response.json()
    assert payload["items"][0]["id"] == "req_1"
    assert payload["nextCursor"] == "next-cursor"


def test_list_requests_invalid_cursor(client, monkeypatch):
    async def fake_list_requests(*_args, **_kwargs):
        raise ValueError("Invalid cursor")

    monkeypatch.setattr("app.api.routes.requests.endpoint_service.ensure_active_endpoint", _fake_active_endpoint)
    monkeypatch.setattr("app.api.routes.requests.request_service.list_requests", fake_list_requests)

    response = client.get("/api/endpoints/abc123def4/requests?before=bad")
    assert response.status_code == 422


def test_get_request(client, monkeypatch):
    async def fake_get_request(_pool, _queries, endpoint_id, request_id):
        return WebhookRequestDTO(
            id=request_id,
            endpoint_id=endpoint_id,
            method="POST",
            path=f"/hook/{endpoint_id}",
            received_at="2026-02-25T00:00:00Z",
            status_code=202,
            ip="127.0.0.1",
            headers={"content-type": "application/json"},
            content_type="application/json",
            body_size_bytes=2,
            raw_body="{}",
            parsed_json={},
        )

    monkeypatch.setattr("app.api.routes.requests.endpoint_service.ensure_active_endpoint", _fake_active_endpoint)
    monkeypatch.setattr("app.api.routes.requests.request_service.get_request", fake_get_request)

    response = client.get("/api/endpoints/abc123def4/requests/11111111-1111-1111-1111-111111111111")
    assert response.status_code == 200
    assert response.json()["id"] == "11111111-1111-1111-1111-111111111111"

