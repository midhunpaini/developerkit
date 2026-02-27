function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidIdentifier(value: string) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value);
}

function formatPropertyName(name: string) {
  return isValidIdentifier(name) ? name : JSON.stringify(name);
}

function indent(depth: number) {
  return '  '.repeat(depth);
}

function uniqueTypeSignatures(typeSignatures: string[]) {
  return Array.from(new Set(typeSignatures));
}

function wrapUnion(typeSignature: string) {
  return typeSignature.includes(' | ') ? `(${typeSignature})` : typeSignature;
}

function inferType(value: unknown, depth: number): string {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'unknown[]';
    }

    const itemTypes = uniqueTypeSignatures(
      value.map((item) => inferType(item, depth + 1))
    );
    const unionType = itemTypes.join(' | ');
    return `${wrapUnion(unionType)}[]`;
  }

  if (isPlainObject(value)) {
    return formatObjectType(value, depth);
  }

  if (typeof value === 'string') {
    return 'string';
  }

  if (typeof value === 'number') {
    return 'number';
  }

  if (typeof value === 'boolean') {
    return 'boolean';
  }

  return 'unknown';
}

function formatObjectType(value: Record<string, unknown>, depth: number): string {
  const entries = Object.entries(value);
  if (entries.length === 0) {
    return 'Record<string, never>';
  }

  const lines: string[] = ['{'];

  for (const [key, nestedValue] of entries) {
    const propertyType = inferType(nestedValue, depth + 1);
    lines.push(
      `${indent(depth + 1)}${formatPropertyName(key)}: ${propertyType};`
    );
  }

  lines.push(`${indent(depth)}}`);
  return lines.join('\n');
}

export function generateTypeScriptFromJson(input: string) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    throw new Error('JSON input is required.');
  }

  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(trimmedInput);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Invalid JSON input.');
  }

  if (isPlainObject(parsedValue)) {
    return `export interface Root ${formatObjectType(parsedValue, 0)}`;
  }

  return `export type Root = ${inferType(parsedValue, 0)};`;
}
