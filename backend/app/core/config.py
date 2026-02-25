from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    database_url: str = "postgresql://postgres:postgres@localhost:5432/webhooktester"
    app_env: Literal["development", "production"] = "development"
    port: int = 8000
    public_base_url: str = "http://localhost:8000"
    cors_allow_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])

    endpoint_ttl_seconds: int = 86_400
    request_ttl_seconds: int = 86_400
    max_body_bytes: int = 1_048_576
    cleanup_interval_seconds: int = 60
    sse_heartbeat_seconds: int = 15
    stream_queue_maxsize: int = 256

    db_pool_min_size: int = 1
    db_pool_max_size: int = 10

    @field_validator("cors_allow_origins", mode="before")
    @classmethod
    def parse_cors_allow_origins(cls, value: object) -> object:
        if isinstance(value, str):
            if not value.strip():
                return []
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @field_validator(
        "endpoint_ttl_seconds",
        "request_ttl_seconds",
        "max_body_bytes",
        "cleanup_interval_seconds",
        "sse_heartbeat_seconds",
        "stream_queue_maxsize",
        "db_pool_min_size",
        "db_pool_max_size",
    )
    @classmethod
    def ensure_positive(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("must be greater than 0")
        return value


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


def clear_settings_cache() -> None:
    get_settings.cache_clear()

