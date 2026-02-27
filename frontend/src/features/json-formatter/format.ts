function parseJson(input: string) {
  const normalized = input.trim();
  if (!normalized) {
    throw new Error('JSON input is required.');
  }

  try {
    return JSON.parse(normalized);
  } catch {
    throw new Error('Invalid JSON input.');
  }
}

export function formatJson(input: string) {
  return JSON.stringify(parseJson(input), null, 2);
}

export function minifyJson(input: string) {
  return JSON.stringify(parseJson(input));
}

export function validateJson(input: string) {
  parseJson(input);
}

