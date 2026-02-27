export interface ParsedCurlCommand {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
}

const LONG_DATA_FLAGS = new Set([
  '--data',
  '--data-raw',
  '--data-binary',
  '--data-urlencode',
  '--json'
]);

function isUrlToken(token: string) {
  return token.startsWith('http://') || token.startsWith('https://');
}

function preprocessCommand(command: string) {
  return command.replace(/\\\r?\n/g, ' ').trim();
}

function readValue(
  tokens: string[],
  currentIndex: number,
  flag: string
): { value: string; nextIndex: number } {
  const value = tokens[currentIndex + 1];

  if (!value) {
    throw new Error(`Missing value for ${flag}.`);
  }

  return {
    value,
    nextIndex: currentIndex + 1
  };
}

function addHeader(rawHeader: string, headers: Record<string, string>) {
  const separatorIndex = rawHeader.indexOf(':');
  if (separatorIndex === -1) {
    return;
  }

  const key = rawHeader.slice(0, separatorIndex).trim();
  const value = rawHeader.slice(separatorIndex + 1).trim();

  if (!key) {
    return;
  }

  headers[key] = value;
}

export function tokenizeCurlCommand(command: string) {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let escaping = false;

  for (const character of command) {
    if (escaping) {
      current += character;
      escaping = false;
      continue;
    }

    if (character === '\\' && quote !== "'") {
      escaping = true;
      continue;
    }

    if (quote) {
      if (character === quote) {
        quote = null;
      } else {
        current += character;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (/\s/.test(character)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += character;
  }

  if (quote) {
    throw new Error('Unclosed quote in cURL command.');
  }

  if (escaping) {
    current += '\\';
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

export function parseCurlCommand(rawCommand: string): ParsedCurlCommand {
  const cleanedCommand = preprocessCommand(rawCommand);
  if (!cleanedCommand) {
    throw new Error('Enter a cURL command to convert.');
  }

  const tokens = tokenizeCurlCommand(cleanedCommand);
  if (tokens.length === 0) {
    throw new Error('Unable to parse an empty command.');
  }

  const startIndex = tokens[0].toLowerCase() === 'curl' ? 1 : 0;
  let method = 'GET';
  let methodExplicitlySet = false;
  let url = '';
  const headers: Record<string, string> = {};
  const bodySegments: string[] = [];

  for (let index = startIndex; index < tokens.length; index += 1) {
    const token = tokens[index];
    const normalized = token.toLowerCase();

    if (isUrlToken(token)) {
      url = token;
      continue;
    }

    if (token === '-X' || normalized === '--request') {
      const { value, nextIndex } = readValue(tokens, index, token);
      method = value.toUpperCase();
      methodExplicitlySet = true;
      index = nextIndex;
      continue;
    }

    if (token.startsWith('-X') && token.length > 2) {
      method = token.slice(2).toUpperCase();
      methodExplicitlySet = true;
      continue;
    }

    if (normalized.startsWith('--request=')) {
      method = token.slice(token.indexOf('=') + 1).toUpperCase();
      methodExplicitlySet = true;
      continue;
    }

    if (token === '--url') {
      const { value, nextIndex } = readValue(tokens, index, token);
      url = value;
      index = nextIndex;
      continue;
    }

    if (normalized.startsWith('--url=')) {
      url = token.slice(token.indexOf('=') + 1);
      continue;
    }

    if (token === '-H' || normalized === '--header') {
      const { value, nextIndex } = readValue(tokens, index, token);
      addHeader(value, headers);
      index = nextIndex;
      continue;
    }

    if (token.startsWith('-H') && token !== '-H') {
      addHeader(token.slice(2), headers);
      continue;
    }

    if (normalized.startsWith('--header=')) {
      addHeader(token.slice(token.indexOf('=') + 1), headers);
      continue;
    }

    if (token === '-d' || LONG_DATA_FLAGS.has(normalized)) {
      const { value, nextIndex } = readValue(tokens, index, token);
      bodySegments.push(value);
      if (normalized === '--json' && !Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')) {
        headers['Content-Type'] = 'application/json';
      }
      index = nextIndex;
      continue;
    }

    if (token.startsWith('-d') && token !== '-d') {
      bodySegments.push(token.slice(2));
      continue;
    }

    if (
      normalized.startsWith('--data=') ||
      normalized.startsWith('--data-raw=') ||
      normalized.startsWith('--data-binary=') ||
      normalized.startsWith('--data-urlencode=') ||
      normalized.startsWith('--json=')
    ) {
      bodySegments.push(token.slice(token.indexOf('=') + 1));
      if (
        normalized.startsWith('--json=') &&
        !Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')
      ) {
        headers['Content-Type'] = 'application/json';
      }
      continue;
    }
  }

  if (!url) {
    throw new Error(
      'No URL was found. Include a URL like https://api.example.com/resource.'
    );
  }

  if (!methodExplicitlySet && bodySegments.length > 0) {
    method = 'POST';
  }

  return {
    method,
    url,
    headers,
    body: bodySegments.length > 0 ? bodySegments.join('&') : null
  };
}

function toFetchCode(parsed: ParsedCurlCommand) {
  const headerEntries = Object.entries(parsed.headers);
  const options: string[] = [];

  if (
    parsed.method !== 'GET' ||
    headerEntries.length > 0 ||
    parsed.body !== null
  ) {
    options.push(`method: ${JSON.stringify(parsed.method)}`);
  }

  if (headerEntries.length > 0) {
    const headerLines = headerEntries.map(
      ([key, value]) => `    ${JSON.stringify(key)}: ${JSON.stringify(value)},`
    );
    options.push(`headers: {\n${headerLines.join('\n')}\n  }`);
  }

  if (parsed.body !== null) {
    options.push(`body: ${JSON.stringify(parsed.body)}`);
  }

  if (options.length === 0) {
    return [
      `const response = await fetch(${JSON.stringify(parsed.url)});`,
      '',
      'const data = await response.json();',
      'console.log(data);'
    ].join('\n');
  }

  return [
    `const response = await fetch(${JSON.stringify(parsed.url)}, {`,
    ...options.map((line, index) =>
      index === options.length - 1 ? `  ${line}` : `  ${line},`
    ),
    '});',
    '',
    'if (!response.ok) {',
    '  throw new Error(`Request failed: ${response.status}`);',
    '}',
    '',
    'const data = await response.json();',
    'console.log(data);'
  ].join('\n');
}

export function convertCurlToFetch(rawCommand: string) {
  const parsed = parseCurlCommand(rawCommand);
  return {
    parsed,
    code: toFetchCode(parsed)
  };
}
