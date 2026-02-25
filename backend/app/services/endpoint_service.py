from __future__ import annotations

from typing import Any

import asyncpg

from app.core.errors import NotFoundError, ServiceUnavailableError
from app.schemas.endpoints import CreateEndpointResponse, EndpointRecord
from app.utils.ids import generate_endpoint_id
from app.utils.time import isoformat_z


async def create_endpoint(
    pool: asyncpg.Pool,
    queries: dict[str, str],
    public_base_url: str,
    endpoint_ttl_seconds: int,
    *,
    max_retries: int = 5,
) -> CreateEndpointResponse:
    query = queries["create_endpoint"]
    base_url = public_base_url.rstrip("/")

    for _ in range(max_retries):
        endpoint_id = generate_endpoint_id()
        try:
            row = await pool.fetchrow(query, endpoint_id, endpoint_ttl_seconds)
        except asyncpg.UniqueViolationError:
            continue
        except Exception as exc:  # pragma: no cover - exercised in integration
            raise ServiceUnavailableError("Database unavailable") from exc

        if row is None:
            continue

        return CreateEndpointResponse(
            endpoint_id=row["endpoint_id"],
            hook_url=f"{base_url}/hook/{row['endpoint_id']}",
            created_at=isoformat_z(row["created_at"]),
            expires_at=isoformat_z(row["expires_at"]),
        )

    raise ServiceUnavailableError("Failed to generate unique endpoint ID")


async def get_active_endpoint_or_none(
    pool: asyncpg.Pool,
    queries: dict[str, str],
    endpoint_id: str,
) -> EndpointRecord | None:
    query = queries["get_active_endpoint"]
    try:
        row = await pool.fetchrow(query, endpoint_id)
    except Exception as exc:  # pragma: no cover - exercised in integration
        raise ServiceUnavailableError("Database unavailable") from exc

    if row is None:
        return None

    return EndpointRecord(
        endpoint_id=row["endpoint_id"],
        created_at=isoformat_z(row["created_at"]),
        expires_at=isoformat_z(row["expires_at"]),
    )


async def ensure_active_endpoint(
    pool: asyncpg.Pool,
    queries: dict[str, str],
    endpoint_id: str,
) -> EndpointRecord:
    endpoint = await get_active_endpoint_or_none(pool, queries, endpoint_id)
    if endpoint is None:
        raise NotFoundError("Endpoint not found or expired", code="endpoint_not_found")
    return endpoint

