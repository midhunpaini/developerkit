import type { KeyboardEvent, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  ariaLabel: string;
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  actions?: ReactNode;
}

export function Tabs<T extends string>({
  ariaLabel,
  items,
  value,
  onChange,
  className,
  actions
}: TabsProps<T>) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const currentIndex = items.findIndex((item) => item.value === value);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + direction + items.length) % items.length;
    onChange(items[nextIndex].value);
  }

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className="inline-flex rounded-md border border-border bg-slate-900/50 p-1"
      >
        {items.map((item) => {
          const selected = item.value === value;
          const tabId = `tab-${item.value}`;

          return (
            <button
              key={item.value}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                selected
                  ? 'bg-primary text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
