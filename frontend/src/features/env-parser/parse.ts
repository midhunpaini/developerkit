export interface EnvEntry {
  key: string;
  value: string;
  line: number;
}

export type EnvIssueSeverity = 'warning' | 'error';

export interface EnvIssue {
  line: number;
  severity: EnvIssueSeverity;
  message: string;
}

export interface EnvParseResult {
  entries: EnvEntry[];
  issues: EnvIssue[];
  values: Record<string, string>;
}

const ENV_KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

function removeExportPrefix(line: string) {
  const trimmed = line.trimStart();
  if (!trimmed.startsWith('export ')) {
    return line;
  }

  const startIndex = line.indexOf('export ');
  return `${line.slice(0, startIndex)}${line.slice(startIndex + 'export '.length)}`;
}

function stripInlineComment(value: string) {
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '#') {
      if (index === 0 || /\s/.test(value[index - 1])) {
        return value.slice(0, index).trimEnd();
      }
    }
  }

  return value.trimEnd();
}

function parseDoubleQuotedValue(rawValue: string): { value?: string; error?: string } {
  let parsedValue = '';
  let escaping = false;

  for (let index = 1; index < rawValue.length; index += 1) {
    const character = rawValue[index];

    if (escaping) {
      if (character === 'n') {
        parsedValue += '\n';
      } else if (character === 'r') {
        parsedValue += '\r';
      } else if (character === 't') {
        parsedValue += '\t';
      } else {
        parsedValue += character;
      }
      escaping = false;
      continue;
    }

    if (character === '\\') {
      escaping = true;
      continue;
    }

    if (character === '"') {
      const rest = rawValue.slice(index + 1).trim();
      if (rest && !rest.startsWith('#')) {
        return {
          error: 'Unexpected characters after quoted value.'
        };
      }

      return { value: parsedValue };
    }

    parsedValue += character;
  }

  return { error: 'Missing closing double quote.' };
}

function parseSingleQuotedValue(rawValue: string): { value?: string; error?: string } {
  const closingQuoteIndex = rawValue.indexOf("'", 1);

  if (closingQuoteIndex === -1) {
    return { error: 'Missing closing single quote.' };
  }

  const rest = rawValue.slice(closingQuoteIndex + 1).trim();
  if (rest && !rest.startsWith('#')) {
    return { error: 'Unexpected characters after quoted value.' };
  }

  return {
    value: rawValue.slice(1, closingQuoteIndex)
  };
}

function parseEnvValue(rawValue: string): { value?: string; error?: string } {
  const valueWithWhitespace = rawValue.trimStart();

  if (!valueWithWhitespace) {
    return { value: '' };
  }

  if (valueWithWhitespace.startsWith('"')) {
    return parseDoubleQuotedValue(valueWithWhitespace);
  }

  if (valueWithWhitespace.startsWith("'")) {
    return parseSingleQuotedValue(valueWithWhitespace);
  }

  return { value: stripInlineComment(valueWithWhitespace) };
}

function quoteIfRequired(value: string) {
  if (value === '') {
    return '""';
  }

  if (/^[A-Za-z0-9_./:@-]+$/.test(value)) {
    return value;
  }

  return JSON.stringify(value);
}

export function parseEnvContent(content: string): EnvParseResult {
  const entries: EnvEntry[] = [];
  const issues: EnvIssue[] = [];
  const values: Record<string, string> = {};
  const seenAtLine = new Map<string, number>();
  const lines = content.split(/\r?\n/);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const lineNumber = lineIndex + 1;
    const rawLine = lines[lineIndex];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const withoutExport = removeExportPrefix(rawLine).trimStart();
    const equalsIndex = withoutExport.indexOf('=');

    if (equalsIndex <= 0) {
      issues.push({
        line: lineNumber,
        severity: 'error',
        message: 'Expected KEY=VALUE format.'
      });
      continue;
    }

    const key = withoutExport.slice(0, equalsIndex).trim();
    const rawValue = withoutExport.slice(equalsIndex + 1);

    if (!ENV_KEY_PATTERN.test(key)) {
      issues.push({
        line: lineNumber,
        severity: 'error',
        message: `Invalid key "${key}".`
      });
      continue;
    }

    const parsedValue = parseEnvValue(rawValue);
    if (parsedValue.error) {
      issues.push({
        line: lineNumber,
        severity: 'error',
        message: parsedValue.error
      });
      continue;
    }

    const value = parsedValue.value ?? '';

    if (seenAtLine.has(key)) {
      issues.push({
        line: lineNumber,
        severity: 'warning',
        message: `Duplicate key "${key}" overrides line ${seenAtLine.get(key)}.`
      });
    }

    seenAtLine.set(key, lineNumber);
    values[key] = value;
    entries.push({
      key,
      value,
      line: lineNumber
    });
  }

  return { entries, issues, values };
}

export function formatEnvValuesAsJson(values: Record<string, string>) {
  return JSON.stringify(values, null, 2);
}

export function formatNormalizedEnv(entries: EnvEntry[]) {
  return entries.map((entry) => `${entry.key}=${quoteIfRequired(entry.value)}`).join('\n');
}
