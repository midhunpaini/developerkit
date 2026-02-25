from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import get_settings
from app.core.logging import configure_logging
from app.db.pool import bootstrap_schema, close_pool, create_pool, load_queries
from app.services.cleanup_service import run_cleanup_loop
from app.services.stream_hub import StreamHub

logger = logging.getLogger(__name__)


@asynccontextmanager
async def app_lifespan(app: FastAPI):
    settings = get_settings()
    configure_logging(settings)

    pool = None
    cleanup_task: asyncio.Task[None] | None = None
    queries = load_queries()
    stream_hub = StreamHub(max_queue_size=settings.stream_queue_maxsize)

    try:
        pool = await create_pool(settings)
        await bootstrap_schema(pool)

        cleanup_task = asyncio.create_task(
            run_cleanup_loop(
                pool,
                queries,
                request_ttl_seconds=settings.request_ttl_seconds,
                interval_seconds=settings.cleanup_interval_seconds,
            ),
            name="ttl-cleanup-loop",
        )

        app.state.settings = settings
        app.state.db_pool = pool
        app.state.queries = queries
        app.state.stream_hub = stream_hub
        app.state.cleanup_task = cleanup_task
        logger.info("Application startup complete")

        yield
    finally:
        if cleanup_task is not None:
            cleanup_task.cancel()
            try:
                await cleanup_task
            except asyncio.CancelledError:
                pass

        await stream_hub.close()
        await close_pool(pool)
        logger.info("Application shutdown complete")

