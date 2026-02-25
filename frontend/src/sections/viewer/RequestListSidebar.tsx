import { Panel } from '@/components/common/Panel';
import type { WebhookRequest } from '@/features/webhooks/types';

import { RequestListItem } from '@/sections/viewer/RequestListItem';

interface RequestListSidebarProps {
  requests: WebhookRequest[];
  selectedRequestId: string | null;
  isStreaming: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  onSelectRequest: (id: string) => void;
}

export function RequestListSidebar({
  requests,
  selectedRequestId,
  isStreaming,
  isLoading = false,
  errorMessage = null,
  onSelectRequest
}: RequestListSidebarProps) {
  return (
    <aside aria-label="Webhook requests">
      <Panel className="h-full p-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-text">Requests</h2>
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <span
              className={`inline-block h-2 w-2 rounded-full ${isStreaming ? 'bg-success' : 'bg-slate-500'}`}
              aria-hidden="true"
            />
            {isStreaming ? 'Listening' : 'Idle'}
          </span>
        </div>

        {errorMessage ? (
          <p className="mt-4 text-sm text-error">{errorMessage}</p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            {isLoading ? 'Loading requests...' : 'Waiting for the first request...'}
          </p>
        ) : (
          <ul className="mt-3 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
            {requests.map((request) => (
              <RequestListItem
                key={request.id}
                request={request}
                selected={request.id === selectedRequestId}
                onSelect={onSelectRequest}
              />
            ))}
          </ul>
        )}
      </Panel>
    </aside>
  );
}
