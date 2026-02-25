import type { WebhookRequest } from '@/features/webhooks/types';
import { buildRawRequestText } from '@/features/webhooks/utils/body';

interface RawTabProps {
  request: WebhookRequest;
}

export function RawTab({ request }: RawTabProps) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border/60 bg-slate-950/70 p-3 text-sm text-slate-100">
      {buildRawRequestText(request)}
    </pre>
  );
}
