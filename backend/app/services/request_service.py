from __future__ import annotations

import base64
from dataclasses import dataclass
from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

import asyncpg
import orjson

from app.core.constants import ACCEPTED_INGEST_STATUS
from app.core.errors import NotFoundError, ServiceUnavailableError
from app.schemas.requests import ListRequestsResponse, WebhookRequestDTO
from app.utils.json_parse import parse_json_if_applicable
from app.utils.time import isoformat_z


@dataclass(slots=True)
class CaptureRequestInput:
    endpoint_id: str
    method: str
    path: str
    query_string: str | None
    ip: str
    headers: dict[str, str]
    raw_body: str
    body_size_bytes: int


def _parse_json_text(value: str | None) -> Any | None:
    if value is None:
        return None
    return orjson.loads(value)


def _row_to_webhook_request(row: asyncpg.Record) -> WebhookRequestDTO:
    headers = _parse_json_text(row["headers_json_text"]) or {}
    parsed_json = _parse_json_text(row["parsed_json_text"])

    return WebhookRequestDTO(
        id=row["id"],
        endpoint_id=row["endpoint_id"],
        method=row["method"],
        path=row["path"],
        received_at=isoformat_z(row["received_at"]),
        status_code=row["status_code"],
        ip=row["ip"] or "unknown",
        headers=headers,
        content_type=row["content_type"],
        body_size_bytes=row["body_size_bytes"],
        raw_body=row["raw_body"],
        parsed_json=parsed_json,
    )


def encode_cursor(received_at: datetime, request_id: str) -> str:
    payload = {"receivedAt": isoformat_z(received_at), "id": request_id}
    encoded = base64.urlsafe_b64encode(orjson.dumps(payload)).decode("ascii")
    return encoded.rstrip("=")


def decode_cursor(cursor: str) -> tuple[datetime, UUID]:
    padding = "=" * (-len(cursor) % 4)
    try:
        decoded = base64.urlsafe_b64decode(cursor + padding)
        payload = orjson.loads(decoded)
        received_at = datetime.fromisoformat(str(payload["receivedAt"]).replace("Z", "+00:00"))
        request_id = UUID(str(payload["id"]))
        return received_at, request_id
    except Exception as exc:  # noqa: BLE001
        raise ValueError("Invalid cursor") from exc


async def capture_request(
    pool: asyncpg.Pool,
    queries: dict[str, str],
    payload: CaptureRequestInput,
) -> WebhookRequestDTO:
    content_type = payload.headers.get("content-type", "application/octet-stream")
    parsed_json = parse_json_if_applicable(content_type, payload.raw_body)

    headers_json_text = orjson.dumps(payload.headers).decode("utf-8")
    parsed_json_text = (
        orjson.dumps(parsed_json).decode("utf-8") if parsed_json is not None else None
    )

    try:
        row = await pool.fetchrow(
            queries["insert_request_if_active"],
            payload.endpoint_id,
            str(uuid4()),
            payload.method,
            payload.path,
            payload.query_string,
            ACCEPTED_INGEST_STATUS,
            payload.ip,
            headers_json_text,
            content_type,
            payload.body_size_bytes,
            payload.raw_body,
            parsed_json_text,
        )
    except Exception as exc:  # pragma: no cover - exercised in integration
        raise ServiceUnavailableError("Database unavailable") from exc

    if row is None:
        raise NotFoundError("Endpoint not found or expired", code="endpoint_not_found")

    return _row_to_webhook_request(row)


async def list_requests(
    pool: asyncpg.Pool,
    queries: dict[str, str],
    endpoint_id: str,
    *,
    limit: int,
    before: str | None,
) -> ListRequestsResponse:
    fetch_limit = limit + 1

    try:
        if before:
            before_received_at, before_request_id = decode_cursor(before)
            rows = await pool.fetch(
                queries["list_requests_page_before"],
                endpoint_id,
                before_received_at,
                before_request_id,
                fetch_limit,
            )
        else:
            rows = await pool.fetch(queries["list_requests_page"], endpoint_id, fetch_limit)
    except ValueError:
        raise
    except Exception as exc:  # pragma: no cover - exercised in integration
        raise ServiceUnavailableError("Database unavailable") from exc

    items = [_row_to_webhook_request(row) for row in rows[:limit]]
    next_cursor: str | None = None
    if len(rows) > limit and items:
        last_visible = rows[limit - 1]
        next_cursor = encode_cursor(last_visible["received_at"], last_visible["id"])

    return ListRequestsResponse(items=items, next_cursor=next_cursor)


async def get_request(
    pool: asyncpg.Pool,
    queries: dict[str, str],
    endpoint_id: str,
    request_id: str,
) -> WebhookRequestDTO:
    try:
        row = await pool.fetchrow(queries["get_request_for_endpoint"], endpoint_id, request_id)
    except Exception as exc:  # pragma: no cover - exercised in integration
        raise ServiceUnavailableError("Database unavailable") from exc

    if row is None:
        raise NotFoundError("Request not found", code="request_not_found")

    return _row_to_webhook_request(row)

