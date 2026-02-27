import type { JwtDecodeResult } from '@/features/jwt/types';

function toBase64(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddedLength = Math.ceil(normalized.length / 4) * 4;
  return normalized.padEnd(paddedLength, '=');
}

function base64UrlDecode(value: string) {
  if (typeof globalThis.atob !== 'function') {
    throw new Error('JWT decoding is not supported in this browser.');
  }

  const binary = globalThis.atob(toBase64(value));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseJwtJson(segment: string, label: 'header' | 'payload') {
  const decoded = base64UrlDecode(segment);
  let parsed: unknown;

  try {
    parsed = JSON.parse(decoded);
  } catch {
    throw new Error(`Invalid JWT ${label}: expected JSON content.`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Invalid JWT ${label}: expected JSON object.`);
  }

  return parsed as Record<string, unknown>;
}

export function decodeJwt(token: string): JwtDecodeResult {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    throw new Error('JWT token is required.');
  }

  const segments = normalizedToken.split('.');
  if (segments.length !== 3) {
    throw new Error('JWT must contain three dot-separated segments.');
  }

  const [headerSegment, payloadSegment, signature] = segments;

  if (!headerSegment || !payloadSegment) {
    throw new Error('JWT header and payload segments are required.');
  }

  return {
    header: parseJwtJson(headerSegment, 'header'),
    payload: parseJwtJson(payloadSegment, 'payload'),
    signature,
    headerSegment,
    payloadSegment
  };
}

