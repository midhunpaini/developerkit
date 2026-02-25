import type { WebhookRequest } from '@/features/webhooks/types';
import { getMethodBadgeClass } from '@/features/webhooks/utils/request-format';
import { cn } from '@/lib/cn';
import { formatTimestamp } from '@/lib/format';

import { StatusBadge } from '@/components/common/StatusBadge';

interface RequestListItemProps {
  request: WebhookRequest;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function RequestListItem({
  request,
  selected,
  onSelect
}: RequestListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(request.id)}
        aria-pressed={selected}
        className={cn(
          'w-full rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          selected
            ? 'border-primary/50 bg-primary/10'
            : 'border-border bg-slate-900/40 hover:bg-slate-900/80'
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'inline-flex rounded-md border px-2 py-0.5 text-xs font-medium',
              getMethodBadgeClass(request.method)
            )}
          >
            {request.method}
          </span>
          <StatusBadge statusCode={request.statusCode} />
        </div>
        <p className="mt-2 truncate text-xs text-slate-300">{request.path}</p>
        <p className="mt-1 text-xs tabular-nums text-slate-400">
          {formatTimestamp(request.receivedAt)}
        </p>
      </button>
    </li>
  );
}
