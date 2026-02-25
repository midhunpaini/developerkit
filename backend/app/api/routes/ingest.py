from __future__ import annotations

from fastapi import APIRouter, Depends, Path, Request, status

from app.api.deps import get_db_pool, get_queries, get_settings, get_stream_hub
from app.core.constants import ALLOWED_WEBHOOK_METHODS, ENDPOINT_ID_PATTERN
from app.schemas.requests import IngestAckResponse
from app.services import request_service
from app.utils.body_reader import read_request_body_limited
from app.utils.headers import get_client_ip, normalize_headers

router = APIRouter(tags=["webhooks"])


@router.api_route(
    "/hook/{endpoint_id}",
    methods=list(ALLOWED_WEBHOOK_METHODS),
    response_model=IngestAckResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def ingest_webhook(
    request: Request,
    endpoint_id: str = Path(..., pattern=ENDPOINT_ID_PATTERN.pattern),
    pool=Depends(get_db_pool),
    queries: dict[str, str] = Depends(get_queries),
    settings=Depends(get_settings),
    stream_hub=Depends(get_stream_hub),
) -> IngestAckResponse:
    body_bytes = await read_request_body_limited(request.stream(), settings.max_body_bytes)
    raw_body = body_bytes.decode("utf-8", errors="replace")
    headers = normalize_headers(request.headers)
    client_ip = get_client_ip(headers, request.client.host if request.client else None)

    captured = await request_service.capture_request(
        pool,
        queries,
        request_service.CaptureRequestInput(
            endpoint_id=endpoint_id,
            method=request.method,
            path=request.url.path,
            query_string=request.url.query or None,
            ip=client_ip,
            headers=headers,
            raw_body=raw_body,
            body_size_bytes=len(body_bytes),
        ),
    )

    await stream_hub.publish(
        endpoint_id,
        "request.created",
        {"request": captured.model_dump(by_alias=True)},
    )

    return IngestAckResponse(accepted=True, request_id=captured.id)

