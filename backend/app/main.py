from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from app.api import build_api_router
from app.core.config import Settings, get_settings
from app.core.errors import register_error_handlers
from app.lifespan import app_lifespan


@asynccontextmanager
async def _noop_lifespan(_: FastAPI):
    yield


def create_app(*, use_lifespan: bool = True, settings: Settings | None = None) -> FastAPI:
    app_settings = settings or get_settings()

    app = FastAPI(
        title="WebhookTester Backend",
        default_response_class=ORJSONResponse,
        lifespan=app_lifespan if use_lifespan else _noop_lifespan,
    )

    if app_settings.cors_allow_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=app_settings.cors_allow_origins,
            allow_credentials=False,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    if not use_lifespan:
        app.state.settings = app_settings
        app.state.queries = {}

    register_error_handlers(app)
    app.include_router(build_api_router())
    return app


app = create_app()

