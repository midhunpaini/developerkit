# WebhookTester Backend

FastAPI backend for `WebhookTester.dev` that generates temporary webhook endpoints, stores captured HTTP requests in PostgreSQL, and streams new requests to clients over SSE.

## Features

- FastAPI + asyncpg (no ORM)
- PostgreSQL persistence with TTL cleanup loop
- `POST /api/endpoints` to generate temporary endpoints
- `ANY /hook/{endpointId}` to capture webhook requests
- `GET /api/endpoints/{endpointId}/requests` list API
- `GET /api/endpoints/{endpointId}/requests/{requestId}` detail API
- `GET /api/endpoints/{endpointId}/stream` SSE realtime stream
- Health and readiness probes

## Requirements

- Python 3.12+
- External PostgreSQL instance
- `uv` (recommended) or `pip`

## Setup

1. Create and edit environment config:

```powershell
Copy-Item .env.example .env
```

2. Install dependencies:

```powershell
uv sync --dev
```

3. Run the server:

```powershell
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The app creates tables on startup if they do not exist.

## Docker (Backend + Postgres)

### Files included

- `Dockerfile` (non-root runtime image, healthcheck)
- `.dockerignore`
- `docker-compose.yml` (API + Postgres + healthchecks)

### Run with Docker Compose

1. Create environment file:

```powershell
Copy-Item .env.example .env
```

2. Start services:

```powershell
docker compose up -d --build
```

3. Check health:

```powershell
docker compose ps
```

API will be available at `http://localhost:8000`.

Notes:
- The Compose stack uses a local `postgres` service and sets `DATABASE_URL` automatically for the API container.
- The backend container healthcheck uses `/readyz` so it validates DB connectivity, not just process liveness.
- Postgres data is persisted in the named volume `postgres_data`.
- Docker Compose reads `.env` automatically for variable interpolation, and both services also load `.env` via `env_file`.

## Environment Variables

See `.env.example` for all options. Key values:

- `DATABASE_URL`
- `PUBLIC_BASE_URL`
- `CORS_ALLOW_ORIGINS`
- `ENDPOINT_TTL_SECONDS`
- `REQUEST_TTL_SECONDS`
- `MAX_BODY_BYTES`

## API Summary

- `POST /api/endpoints`
- `GET /api/endpoints/{endpointId}/requests`
- `GET /api/endpoints/{endpointId}/requests/{requestId}`
- `GET /api/endpoints/{endpointId}/stream`
- `ANY /hook/{endpointId}`
- `GET /healthz`
- `GET /readyz`

## Notes

- Realtime fanout is single-instance only in this version (in-memory pub/sub).
- SSE updates are not shared across multiple app instances yet.
- Binary payloads are stored as UTF-8 decoded text with replacement fallback.
