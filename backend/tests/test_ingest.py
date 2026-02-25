from __future__ import annotations

from types import SimpleNamespace

from app.schemas.requests import WebhookRequestDTO


def test_ingest_webhook_success(app, client, monkeypatch):
    published: list[tuple[str, str, dict[str, object]]] = []

    class SpyHub:
        async def publish(self, endpoint_id: str, event: str, data: dict[str, object]) -> None:
            published.append((endpoint_id, event, data))

    app.state.stream_hub = SpyHub()

    async def fake_capture_request(_pool, _queries, payload):
        return WebhookRequestDTO(
            id="req_1",
            endpoint_id=payload.endpoint_id,
            method=payload.method,
            path=payload.path,
            received_at="2026-02-25T00:00:00Z",
            status_code=202,
            ip=payload.ip or "unknown",
            headers=payload.headers,
            content_type=payload.headers.get("content-type", "application/json"),
            body_size_bytes=payload.body_size_bytes,
            raw_body=payload.raw_body,
            parsed_json={"hello": "world"},
        )

    monkeypatch.setattr("app.api.routes.ingest.request_service.capture_request", fake_capture_request)

    response = client.post("/hook/abc123def4", json={"hello": "world"})
    assert response.status_code == 202
    assert response.json() == {"accepted": True, "requestId": "req_1"}

    assert len(published) == 1
    endpoint_id, event_name, event_data = published[0]
    assert endpoint_id == "abc123def4"
    assert event_name == "request.created"
    assert event_data["request"]["id"] == "req_1"


def test_ingest_webhook_payload_too_large(app, client, monkeypatch):
    app.state.settings.max_body_bytes = 10

    async def fail_if_called(*_args, **_kwargs):
        raise AssertionError("capture_request should not be called for oversized payloads")

    monkeypatch.setattr("app.api.routes.ingest.request_service.capture_request", fail_if_called)

    response = client.post(
        "/hook/abc123def4",
        data=b"01234567890",
        headers={"Content-Type": "application/octet-stream"},
    )
    assert response.status_code == 413
    assert response.json()["error"]["code"] == "payload_too_large"

