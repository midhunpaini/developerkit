from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_db_pool
from app.core.errors import ServiceUnavailableError
from app.db.pool import check_db_ready

router = APIRouter(tags=["health"])


@router.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/readyz")
async def readyz(pool=Depends(get_db_pool)) -> dict[str, str]:
    ready = await check_db_ready(pool)
    if not ready:
        raise ServiceUnavailableError("Database not ready")
    return {"status": "ready"}

