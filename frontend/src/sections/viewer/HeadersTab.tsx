import type { WebhookRequest } from '@/features/webhooks/types';
import { getSortedHeaderEntries } from '@/features/webhooks/utils/request-format';

interface HeadersTabProps {
  request: WebhookRequest;
}

export function HeadersTab({ request }: HeadersTabProps) {
  const entries = getSortedHeaderEntries(request.headers);

  return (
    <div className="space-y-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-1 gap-1 rounded-md border border-border/60 bg-slate-900/40 p-3 md:grid-cols-[220px_1fr]"
        >
          <span className="text-xs font-medium text-slate-400">{key}</span>
          <code className="break-all text-xs text-slate-200">{value}</code>
        </div>
      ))}
    </div>
  );
}
