import type { HmacAlgorithm, HmacEncoding } from '@/features/hmac/types';

interface GenerateHmacSignatureParams {
  secret: string;
  message: string;
  algorithm: HmacAlgorithm;
  encoding: HmacEncoding;
}

function getSubtleCrypto() {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API is not available in this browser.');
  }
  return subtle;
}

function bytesToHex(bytes: Uint8Array) {
  let output = '';
  for (const value of bytes) {
    output += value.toString(16).padStart(2, '0');
  }
  return output;
}

function bytesToBase64(bytes: Uint8Array) {
  if (typeof globalThis.btoa !== 'function') {
    throw new Error('Base64 encoding is not available in this browser.');
  }

  let binary = '';
  for (const value of bytes) {
    binary += String.fromCharCode(value);
  }
  return globalThis.btoa(binary);
}

function encodeSignature(bytes: Uint8Array, encoding: HmacEncoding) {
  if (encoding === 'base64') {
    return bytesToBase64(bytes);
  }
  return bytesToHex(bytes);
}

export async function generateHmacSignature({
  secret,
  message,
  algorithm,
  encoding
}: GenerateHmacSignatureParams) {
  const subtle = getSubtleCrypto();
  const encoder = new TextEncoder();

  const key = await subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: { name: algorithm }
    },
    false,
    ['sign']
  );

  const signatureBuffer = await subtle.sign('HMAC', key, encoder.encode(message));
  return encodeSignature(new Uint8Array(signatureBuffer), encoding);
}

