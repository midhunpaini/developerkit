from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.api.deps import get_db_pool, get_queries, get_settings
from app.core.constants import API_PREFIX
from app.schemas.endpoints import CreateEndpointResponse
from app.services import endpoint_service

router = APIRouter(prefix=f"{API_PREFIX}/endpoints", tags=["endpoints"])


@router.post("", response_model=CreateEndpointResponse, status_code=status.HTTP_201_CREATED)
async def create_endpoint(
    pool=Depends(get_db_pool),
    queries: dict[str, str] = Depends(get_queries),
    settings=Depends(get_settings),
) -> CreateEndpointResponse:
    return await endpoint_service.create_endpoint(
        pool,
        queries,
        settings.public_base_url,
        settings.endpoint_ttl_seconds,
    )

