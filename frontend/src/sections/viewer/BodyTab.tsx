import { Suspense, lazy } from 'react';

import { CopyButton } from '@/components/common/CopyButton';
import type { WebhookRequest } from '@/features/webhooks/types';

const JsonTree = lazy(() => import('@/components/json/JsonTree'));

interface BodyTabProps {
  request: WebhookRequest;
}

export function BodyTab({ request }: BodyTabProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-slate-400">
          {request.parsedJson ? 'Parsed JSON body' : 'Raw request body'}
        </p>
        <CopyButton
          value={request.rawBody}
          label="Copy Body"
          ariaLabel="Copy request body"
        />
      </div>

      <div className="rounded-md border border-border/60 bg-slate-950/70 p-3">
        {request.parsedJson ? (
          <Suspense fallback={<p className="text-sm text-slate-400">Loading JSON viewer...</p>}>
            <div className="text-sm font-mono text-slate-100">
              <JsonTree value={request.parsedJson} />
            </div>
          </Suspense>
        ) : (
          <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm text-slate-100">
            {request.rawBody}
          </pre>
        )}
      </div>
    </div>
  );
}
