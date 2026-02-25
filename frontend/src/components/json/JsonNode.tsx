import { useState } from 'react';

import type { JsonValue } from '@/features/webhooks/types';
import { cn } from '@/lib/cn';

interface JsonNodeProps {
  value: JsonValue;
  name?: string;
  depth?: number;
}

function isObject(value: JsonValue): value is Record<string, JsonValue> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function renderPrimitive(value: Exclude<JsonValue, object>) {
  if (typeof value === 'string') {
    return <span className="text-emerald-300">"{value}"</span>;
  }

  if (typeof value === 'number') {
    return <span className="text-sky-300">{value}</span>;
  }

  if (typeof value === 'boolean') {
    return <span className="text-fuchsia-300">{String(value)}</span>;
  }

  return <span className="text-slate-400">null</span>;
}

export function JsonNode({ value, name, depth = 0 }: JsonNodeProps) {
  const expandable = Array.isArray(value) || isObject(value);
  const [open, setOpen] = useState(depth < 1);

  if (!expandable) {
    return (
      <div className="leading-6">
        {name ? <span className="text-indigo-300">"{name}"</span> : null}
        {name ? <span className="text-slate-500">: </span> : null}
        {renderPrimitive(value)}
      </div>
    );
  }

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);

  const empty = entries.length === 0;
  const openToken = Array.isArray(value) ? '[' : '{';
  const closeToken = Array.isArray(value) ? ']' : '}';

  if (empty) {
    return (
      <div className="leading-6">
        {name ? <span className="text-indigo-300">"{name}"</span> : null}
        {name ? <span className="text-slate-500">: </span> : null}
        <span className="text-slate-300">
          {openToken}
          {closeToken}
        </span>
      </div>
    );
  }

  return (
    <div className="leading-6">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? 'Collapse JSON node' : 'Expand JSON node'}
          className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {open ? '-' : '+'}
        </button>
        <div className="min-w-0">
          {name ? <span className="text-indigo-300">"{name}"</span> : null}
          {name ? <span className="text-slate-500">: </span> : null}
          <span className="text-slate-300">{openToken}</span>
          {!open ? (
            <>
              <span className="text-slate-500">
                {Array.isArray(value) ? `${entries.length} items` : '...'}
              </span>
              <span className="text-slate-300">{closeToken}</span>
            </>
          ) : null}
        </div>
      </div>

      {open ? (
        <div className={cn('ml-6 border-l border-border/60 pl-3')}>
          {entries.map(([key, child]) => (
            <JsonNode key={key} name={Array.isArray(value) ? undefined : key} value={child} depth={depth + 1} />
          ))}
          <div className="text-slate-300">{closeToken}</div>
        </div>
      ) : null}
    </div>
  );
}
