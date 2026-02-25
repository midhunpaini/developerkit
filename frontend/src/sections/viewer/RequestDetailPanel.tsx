import { useState } from 'react';

import { CopyButton } from '@/components/common/CopyButton';
import { EmptyState } from '@/components/common/EmptyState';
import { Panel } from '@/components/common/Panel';
import { Tabs } from '@/components/common/Tabs';
import { VIEWER_TABS } from '@/features/webhooks/constants';
import type { ViewerTab, WebhookRequest } from '@/features/webhooks/types';
import { buildCurlCommand } from '@/features/webhooks/utils/curl';

import { BodyTab } from '@/sections/viewer/BodyTab';
import { HeadersTab } from '@/sections/viewer/HeadersTab';
import { OverviewTab } from '@/sections/viewer/OverviewTab';
import { RawTab } from '@/sections/viewer/RawTab';

interface RequestDetailPanelProps {
  endpointId: string;
  request: WebhookRequest | null;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function RequestDetailPanel({
  endpointId,
  request,
  isLoading = false,
  errorMessage = null
}: RequestDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<ViewerTab>('overview');

  if (!request) {
    const curlCommand = buildCurlCommand({ endpointId });
    const title = errorMessage
      ? 'Unable to load requests'
      : isLoading
        ? 'Loading requests'
        : 'No requests yet';
    const description = errorMessage
      ? errorMessage
      : isLoading
        ? 'Connecting to the backend and loading recent requests for this endpoint.'
        : 'Send a webhook to your temporary endpoint to inspect headers and payload.';

    return (
      <EmptyState title={title} description={description}>
        <div className="rounded-md border border-border/60 bg-slate-950/70 p-3">
          <code className="block whitespace-pre-wrap break-all text-sm text-slate-100">
            {curlCommand}
          </code>
        </div>
        <CopyButton
          value={curlCommand}
          label="Copy cURL"
          ariaLabel="Copy example curl command"
        />
      </EmptyState>
    );
  }

  let tabContent: JSX.Element;
  switch (activeTab) {
    case 'headers':
      tabContent = <HeadersTab request={request} />;
      break;
    case 'body':
      tabContent = <BodyTab request={request} />;
      break;
    case 'raw':
      tabContent = <RawTab request={request} />;
      break;
    case 'overview':
    default:
      tabContent = <OverviewTab request={request} />;
      break;
  }

  return (
    <Panel className="p-3">
      <Tabs
        ariaLabel="Request detail tabs"
        items={[...VIEWER_TABS]}
        value={activeTab}
        onChange={setActiveTab}
        actions={
          <CopyButton
            value={buildCurlCommand(request)}
            label="Copy as cURL"
            ariaLabel="Copy current request as curl command"
          />
        }
      />

      <section
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="mt-4"
      >
        {tabContent}
      </section>
    </Panel>
  );
}
