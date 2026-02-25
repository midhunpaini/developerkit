from __future__ import annotations

from pathlib import Path
from typing import Any

import asyncpg

from app.core.config import Settings

BASE_DIR = Path(__file__).resolve().parent
SCHEMA_PATH = BASE_DIR / "schema.sql"
QUERIES_DIR = BASE_DIR / "queries"


def _parse_named_queries(sql_text: str) -> dict[str, str]:
    queries: dict[str, str] = {}
    current_name: str | None = None
    current_lines: list[str] = []

    for line in sql_text.splitlines():
        if line.strip().startswith("-- name:"):
            if current_name and current_lines:
                queries[current_name] = "\n".join(current_lines).strip()
            current_name = line.split(":", 1)[1].strip()
            current_lines = []
            continue

        if current_name:
            current_lines.append(line)

    if current_name and current_lines:
        queries[current_name] = "\n".join(current_lines).strip()

    return queries


def load_queries() -> dict[str, str]:
    query_map: dict[str, str] = {}
    for path in sorted(QUERIES_DIR.glob("*.sql")):
        query_map.update(_parse_named_queries(path.read_text(encoding="utf-8")))
    return query_map


async def create_pool(settings: Settings) -> asyncpg.Pool:
    return await asyncpg.create_pool(
        dsn=settings.database_url,
        min_size=settings.db_pool_min_size,
        max_size=settings.db_pool_max_size,
        command_timeout=10,
    )


async def close_pool(pool: asyncpg.Pool | None) -> None:
    if pool is not None:
        await pool.close()


async def bootstrap_schema(pool: asyncpg.Pool) -> None:
    sql = SCHEMA_PATH.read_text(encoding="utf-8")
    async with pool.acquire() as conn:
        await conn.execute(sql)


async def check_db_ready(pool: asyncpg.Pool) -> bool:
    try:
        value: Any = await pool.fetchval("SELECT 1;")
    except Exception:
        return False
    return value == 1

