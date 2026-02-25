from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query

from app.api.deps import get_db_pool, get_queries
from app.core.constants import API_PREFIX, ENDPOINT_ID_PATTERN
from app.schemas.requests import ListRequestsResponse, WebhookRequestDTO
from app.services import endpoint_service, request_service

router = APIRouter(prefix=f"{API_PREFIX}/endpoints", tags=["requests"])


@router.get("/{endpoint_id}/requests", response_model=ListRequestsResponse)
async def list_endpoint_requests(
    endpoint_id: Annotated[str, Path(pattern=ENDPOINT_ID_PATTERN.pattern)],
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    before: str | None = Query(default=None),
    include_body: bool = Query(default=True, alias="includeBody"),  # accepted for forward compatibility
    pool=Depends(get_db_pool),
    queries: dict[str, str] = Depends(get_queries),
) -> ListRequestsResponse:
    _ = include_body
    await endpoint_service.ensure_active_endpoint(pool, queries, endpoint_id)
    try:
        return await request_service.list_requests(
            pool,
            queries,
            endpoint_id,
            limit=limit,
            before=before,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.get("/{endpoint_id}/requests/{request_id}", response_model=WebhookRequestDTO)
async def get_endpoint_request(
    endpoint_id: Annotated[str, Path(pattern=ENDPOINT_ID_PATTERN.pattern)],
    request_id: str,
    pool=Depends(get_db_pool),
    queries: dict[str, str] = Depends(get_queries),
) -> WebhookRequestDTO:
    await endpoint_service.ensure_active_endpoint(pool, queries, endpoint_id)
    return await request_service.get_request(pool, queries, endpoint_id, request_id)
