from __future__ import annotations

import asyncpg
from fastapi import Request

from app.core.config import Settings
from app.services.stream_hub import StreamHub


def get_settings(request: Request) -> Settings:
    return request.app.state.settings


def get_db_pool(request: Request) -> asyncpg.Pool:
    return request.app.state.db_pool


def get_queries(request: Request) -> dict[str, str]:
    return request.app.state.queries


def get_stream_hub(request: Request) -> StreamHub:
    return request.app.state.stream_hub

