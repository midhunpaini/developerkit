from __future__ import annotations

import re

API_PREFIX = "/api"
ENDPOINT_ID_LENGTH = 10
ENDPOINT_ID_PATTERN = re.compile(r"^[a-z0-9]{8,32}$")
HOOK_PATH_PREFIX = "/hook/"
ACCEPTED_INGEST_STATUS = 202

ALLOWED_WEBHOOK_METHODS = (
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
)

