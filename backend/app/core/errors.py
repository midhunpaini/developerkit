from __future__ import annotations

from dataclasses import dataclass

from fastapi import FastAPI, Request
from fastapi.responses import ORJSONResponse


@dataclass(slots=True)
class AppError(Exception):
    code: str
    message: str
    status_code: int


class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found", code: str = "not_found") -> None:
        super().__init__(code=code, message=message, status_code=404)


class PayloadTooLargeError(AppError):
    def __init__(self, message: str = "Payload too large") -> None:
        super().__init__(code="payload_too_large", message=message, status_code=413)


class ServiceUnavailableError(AppError):
    def __init__(self, message: str = "Service unavailable") -> None:
        super().__init__(code="service_unavailable", message=message, status_code=503)


def error_payload(code: str, message: str) -> dict[str, object]:
    return {"error": {"code": code, "message": message}}


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(_: Request, exc: AppError) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=exc.status_code,
            content=error_payload(exc.code, exc.message),
        )

