import type { WebhookRequest } from '@/features/webhooks/types';
import { formatBytes, formatFullTimestamp } from '@/lib/format';

interface OverviewTabProps {
  request: WebhookRequest;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 border-b border-border/40 py-2 text-sm last:border-0">
      <dt className="text-slate-400">{label}</dt>
      <dd className="min-w-0 break-words text-text">{value}</dd>
    </div>
  );
}

export function OverviewTab({ request }: OverviewTabProps) {
  return (
    <dl>
      <Row label="Method" value={request.method} />
      <Row label="Status" value={String(request.statusCode)} />
      <Row label="IP" value={request.ip} />
      <Row label="Content type" value={request.contentType} />
      <Row label="Body size" value={formatBytes(request.bodySizeBytes)} />
      <Row label="Timestamp" value={formatFullTimestamp(request.receivedAt)} />
    </dl>
  );
}
