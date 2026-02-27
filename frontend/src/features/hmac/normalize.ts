import type { HmacEncoding } from '@/features/hmac/types';

const PREFIX_PATTERN = /^[a-z0-9_-]+$/i;

function stripSignaturePrefix(value: string) {
  const trimmed = value.trim();
  const separatorIndex = trimmed.indexOf('=');

  if (separatorIndex <= 0 || separatorIndex >= trimmed.length - 1) {
    return trimmed;
  }

  const prefix = trimmed.slice(0, separatorIndex).trim();
  const suffix = trimmed.slice(separatorIndex + 1).trim();

  if (!PREFIX_PATTERN.test(prefix) || !suffix) {
    return trimmed;
  }

  return suffix;
}

export function normalizeExpectedSignature(value: string, encoding: HmacEncoding) {
  const normalized = stripSignaturePrefix(value);
  if (encoding === 'hex') {
    return normalized.toLowerCase();
  }
  return normalized;
}

export function signaturesMatch(
  actual: string,
  expected: string,
  encoding: HmacEncoding
) {
  if (!actual || !expected) {
    return false;
  }

  return (
    normalizeExpectedSignature(actual, encoding) ===
    normalizeExpectedSignature(expected, encoding)
  );
}

