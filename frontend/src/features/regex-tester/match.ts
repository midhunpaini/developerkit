export interface RegexMatchResult {
  index: number;
  match: string;
  captures: Array<string | null>;
  groups: Record<string, string> | null;
}

const VALID_REGEX_FLAGS = new Set(['g', 'i', 'm', 's', 'u', 'y']);

function mapMatchResult(match: RegExpMatchArray): RegexMatchResult {
  return {
    index: match.index ?? -1,
    match: match[0] ?? '',
    captures: match.slice(1).map((capture) => capture ?? null),
    groups: match.groups
      ? Object.fromEntries(
          Object.entries(match.groups).map(([key, value]) => [key, value ?? ''])
        )
      : null
  };
}

export function normalizeRegexFlags(rawFlags: string) {
  const normalizedFlags = rawFlags.replace(/\s+/g, '');
  const usedFlags = new Set<string>();
  const orderedFlags: string[] = [];

  for (const flag of normalizedFlags) {
    if (!VALID_REGEX_FLAGS.has(flag)) {
      throw new Error(`Unsupported flag "${flag}". Use only g, i, m, s, u, y.`);
    }

    if (usedFlags.has(flag)) {
      throw new Error(`Duplicate flag "${flag}" is not allowed.`);
    }

    usedFlags.add(flag);
    orderedFlags.push(flag);
  }

  return orderedFlags.join('');
}

export function compileRegex(pattern: string, rawFlags: string) {
  if (!pattern) {
    throw new Error('Regex pattern is required.');
  }

  const flags = normalizeRegexFlags(rawFlags);

  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Invalid regular expression.'
    );
  }
}

export function executeRegex(pattern: string, rawFlags: string, text: string) {
  const regex = compileRegex(pattern, rawFlags);
  const matches: RegexMatchResult[] = [];

  if (regex.global) {
    for (const match of text.matchAll(regex)) {
      matches.push(mapMatchResult(match));
    }
  } else {
    const match = regex.exec(text);
    if (match) {
      matches.push(mapMatchResult(match));
    }
  }

  return { regex, matches };
}

export function replaceWithRegex(
  pattern: string,
  rawFlags: string,
  text: string,
  replacement: string
) {
  const regex = compileRegex(pattern, rawFlags);
  return text.replace(regex, replacement);
}
