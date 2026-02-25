from __future__ import annotations

import pytest


def test_healthz(client):
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readyz_success(client):
    response = client.get("/readyz")
    assert response.status_code == 200
    assert response.json() == {"status": "ready"}


def test_readyz_unavailable(client, monkeypatch):
    async def fake_check_db_ready(_pool):
        return False

    monkeypatch.setattr("app.api.routes.health.check_db_ready", fake_check_db_ready)
    response = client.get("/readyz")
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "service_unavailable"

