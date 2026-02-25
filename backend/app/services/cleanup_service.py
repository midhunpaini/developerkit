from __future__ import annotations

import asyncio
import logging

import asyncpg

logger = logging.getLogger(__name__)


async def _delete_in_batches(
    pool: asyncpg.Pool,
    query: str,
    *params: object,
    batch_size_param_index: int = -1,
) -> int:
    total_deleted = 0
    batch_size = int(params[batch_size_param_index])

    while True:
        rows = await pool.fetch(query, *params)
        deleted = len(rows)
        total_deleted += deleted
        if deleted < batch_size:
            break

    return total_deleted


async def cleanup_once(
    pool: asyncpg.Pool,
    queries: dict[str, str],
    request_ttl_seconds: int,
    *,
    batch_size: int = 500,
) -> tuple[int, int]:
    deleted_requests = await _delete_in_batches(
        pool,
        queries["delete_expired_requests_batch"],
        request_ttl_seconds,
        batch_size,
    )
    deleted_endpoints = await _delete_in_batches(
        pool,
        queries["delete_expired_endpoints_batch"],
        batch_size,
    )
    return deleted_requests, deleted_endpoints


async def run_cleanup_loop(
    pool: asyncpg.Pool,
    queries: dict[str, str],
    *,
    request_ttl_seconds: int,
    interval_seconds: int,
    batch_size: int = 500,
) -> None:
    while True:
        try:
            deleted_requests, deleted_endpoints = await cleanup_once(
                pool,
                queries,
                request_ttl_seconds,
                batch_size=batch_size,
            )
            if deleted_requests or deleted_endpoints:
                logger.info(
                    "TTL cleanup removed requests=%s endpoints=%s",
                    deleted_requests,
                    deleted_endpoints,
                )
        except asyncio.CancelledError:
            raise
        except Exception:  # pragma: no cover - defensive logging path
            logger.exception("TTL cleanup loop failed")

        await asyncio.sleep(interval_seconds)

