from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

import pytest
from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.core.config import Settings
from app.main import create_app
from app.services.stream_hub import StreamHub


class FakePool:
    async def fetchval(self, _: str) -> int:
        return 1


@pytest.fixture
def app():
    settings = Settings(
        database_url="postgresql://postgres:postgres@localhost:5432/webhooktester",
        cors_allow_origins=[],
        public_base_url="http://localhost:8000",
    )
    application = create_app(use_lifespan=False, settings=settings)
    application.state.db_pool = FakePool()
    application.state.queries = {}
    application.state.stream_hub = StreamHub(max_queue_size=8)
    return application


@pytest.fixture
def client(app):
    with TestClient(app) as test_client:
        yield test_client
