export type JsonDiffKind = 'added' | 'removed' | 'changed' | 'type-changed';

export interface JsonDiffEntry {
  path: string;
  kind: JsonDiffKind;
  before?: unknown;
  after?: unknown;
}

export interface JsonDiffSummary {
  total: number;
  added: number;
  removed: number;
  changed: number;
  typeChanged: number;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getValueType(value: unknown) {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
}

function formatPathSegment(path: string, segment: string | number) {
  if (typeof segment === 'number') {
    return `${path}[${segment}]`;
  }

  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(segment)) {
    return `${path}.${segment}`;
  }

  return `${path}[${JSON.stringify(segment)}]`;
}

export function diffJsonValues(
  beforeValue: unknown,
  afterValue: unknown,
  path = '$'
): JsonDiffEntry[] {
  if (Object.is(beforeValue, afterValue)) {
    return [];
  }

  if (Array.isArray(beforeValue) && Array.isArray(afterValue)) {
    const maxLength = Math.max(beforeValue.length, afterValue.length);
    const differences: JsonDiffEntry[] = [];

    for (let index = 0; index < maxLength; index += 1) {
      const nextPath = formatPathSegment(path, index);
      const hasBefore = index < beforeValue.length;
      const hasAfter = index < afterValue.length;

      if (!hasBefore && hasAfter) {
        differences.push({
          path: nextPath,
          kind: 'added',
          after: afterValue[index]
        });
        continue;
      }

      if (hasBefore && !hasAfter) {
        differences.push({
          path: nextPath,
          kind: 'removed',
          before: beforeValue[index]
        });
        continue;
      }

      differences.push(...diffJsonValues(beforeValue[index], afterValue[index], nextPath));
    }

    return differences;
  }

  if (isPlainObject(beforeValue) && isPlainObject(afterValue)) {
    const differences: JsonDiffEntry[] = [];
    const keys = new Set([...Object.keys(beforeValue), ...Object.keys(afterValue)]);

    for (const key of Array.from(keys).sort()) {
      const nextPath = formatPathSegment(path, key);
      const hasBefore = Object.prototype.hasOwnProperty.call(beforeValue, key);
      const hasAfter = Object.prototype.hasOwnProperty.call(afterValue, key);

      if (!hasBefore && hasAfter) {
        differences.push({
          path: nextPath,
          kind: 'added',
          after: afterValue[key]
        });
        continue;
      }

      if (hasBefore && !hasAfter) {
        differences.push({
          path: nextPath,
          kind: 'removed',
          before: beforeValue[key]
        });
        continue;
      }

      differences.push(...diffJsonValues(beforeValue[key], afterValue[key], nextPath));
    }

    return differences;
  }

  const beforeType = getValueType(beforeValue);
  const afterType = getValueType(afterValue);

  return [
    {
      path,
      kind: beforeType === afterType ? 'changed' : 'type-changed',
      before: beforeValue,
      after: afterValue
    }
  ];
}

export function summarizeJsonDiff(entries: JsonDiffEntry[]): JsonDiffSummary {
  return entries.reduce<JsonDiffSummary>(
    (summary, entry) => {
      if (entry.kind === 'added') {
        summary.added += 1;
      } else if (entry.kind === 'removed') {
        summary.removed += 1;
      } else if (entry.kind === 'changed') {
        summary.changed += 1;
      } else {
        summary.typeChanged += 1;
      }

      summary.total += 1;
      return summary;
    },
    {
      total: 0,
      added: 0,
      removed: 0,
      changed: 0,
      typeChanged: 0
    }
  );
}
