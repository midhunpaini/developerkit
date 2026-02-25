from __future__ import annotations

from fastapi import APIRouter

from app.api.routes.endpoints import router as endpoints_router
from app.api.routes.health import router as health_router
from app.api.routes.ingest import router as ingest_router
from app.api.routes.requests import router as requests_router
from app.api.routes.stream import router as stream_router


def build_api_router() -> APIRouter:
    router = APIRouter()
    router.include_router(health_router)
    router.include_router(endpoints_router)
    router.include_router(requests_router)
    router.include_router(stream_router)
    router.include_router(ingest_router)
    return router

