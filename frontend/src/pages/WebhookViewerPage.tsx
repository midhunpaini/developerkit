import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { SITE_CONFIG, buildEndpointUrl } from '@/config/site';
import { WEBHOOK_TESTER_TOOL } from '@/config/tools';
import {
  createWebhookEndpoint,
  getApiErrorMessage
} from '@/features/webhooks/api/client';
import { useWebhookRequests } from '@/features/webhooks/hooks/useWebhookRequests';
import { buildSoftwareApplicationJsonLdForTool } from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';
import { RequestDetailPanel } from '@/sections/viewer/RequestDetailPanel';
import { RequestListSidebar } from '@/sections/viewer/RequestListSidebar';
import { ViewerTopBar } from '@/sections/viewer/ViewerTopBar';

function buildWebhookTesterUrl(endpointId: string) {
  const search = new URLSearchParams();
  search.set('endpoint', endpointId);
  return `/webhook-tester?${search.toString()}`;
}

interface WebhookViewerSessionProps {
  endpointId: string;
  onGenerateNew: () => void | Promise<void>;
  isGeneratingNew: boolean;
  generateErrorMessage: string | null;
}

function WebhookViewerSession({
  endpointId,
  onGenerateNew,
  isGeneratingNew,
  generateErrorMessage
}: WebhookViewerSessionProps) {
  const endpointUrl = buildEndpointUrl(endpointId);
  const {
    requests,
    selectedRequestId,
    selectedRequest,
    isStreaming,
    isLoading,
    errorMessage,
    selectRequest
  } = useWebhookRequests(endpointId);

  return (
    <section className="space-y-4" aria-label="Webhook tester application">
      <ViewerTopBar
        endpointUrl={endpointUrl}
        onGenerateNew={onGenerateNew}
        isGeneratingNew={isGeneratingNew}
      />

      {generateErrorMessage ? (
        <Panel className="border-error/40 bg-error/10 p-3">
          <p className="text-sm text-error">{generateErrorMessage}</p>
        </Panel>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <RequestListSidebar
          requests={requests}
          selectedRequestId={selectedRequestId}
          isStreaming={isStreaming}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onSelectRequest={selectRequest}
        />
        <section aria-label="Request details">
          <RequestDetailPanel
            endpointId={endpointId}
            request={selectedRequest}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        </section>
      </div>
    </section>
  );
}

export function WebhookViewerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const endpointId = searchParams.get('endpoint')?.trim() ?? '';
  const hasEndpoint = endpointId.length > 0;
  const [generateErrorMessage, setGenerateErrorMessage] = useState<string | null>(null);
  const [isGeneratingNew, setIsGeneratingNew] = useState(false);

  async function handleGenerateNew() {
    if (isGeneratingNew) {
      return;
    }

    setIsGeneratingNew(true);
    setGenerateErrorMessage(null);

    try {
      const endpoint = await createWebhookEndpoint();
      navigate(buildWebhookTesterUrl(endpoint.endpointId), { replace: false });
    } catch (error) {
      setGenerateErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsGeneratingNew(false);
    }
  }

  return (
    <>
      <SeoMeta
        title={WEBHOOK_TESTER_TOOL.seoTitle}
        description={WEBHOOK_TESTER_TOOL.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${WEBHOOK_TESTER_TOOL.routePath}`}
        robots={hasEndpoint ? 'noindex, nofollow' : undefined}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${WEBHOOK_TESTER_TOOL.routePath}`,
          type: 'website'
        }}
        jsonLd={buildSoftwareApplicationJsonLdForTool(WEBHOOK_TESTER_TOOL)}
      />

      <div className="min-h-screen bg-appbg text-text">
        <header className="border-b border-border/50 bg-appbg">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6">
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/"
                className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Go to DeveloperTools.dev home"
              >
                <SiteLogo />
              </Link>
              <Link
                to="/"
                className="text-sm text-slate-300 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                All tools
              </Link>
            </div>

            <Panel className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                    Free Webhook Tester
                  </h1>
                  <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                    {WEBHOOK_TESTER_TOOL.pageIntro}
                  </p>
                </div>
                <Button
                  onClick={handleGenerateNew}
                  variant="primary"
                  disabled={isGeneratingNew}
                  className="md:shrink-0"
                >
                  {isGeneratingNew ? 'Generating...' : 'Generate Endpoint'}
                </Button>
              </div>
            </Panel>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:py-6">
          {!hasEndpoint ? (
            <>
              {generateErrorMessage ? (
                <Panel className="border-error/40 bg-error/10 p-3">
                  <p className="text-sm text-error">{generateErrorMessage}</p>
                </Panel>
              ) : null}
              <Panel className="p-4">
                <p className="text-sm text-slate-300">
                  Generate a temporary endpoint to open the webhook viewer and start
                  inspecting incoming requests.
                </p>
              </Panel>
            </>
          ) : (
            <WebhookViewerSession
              endpointId={endpointId}
              onGenerateNew={handleGenerateNew}
              isGeneratingNew={isGeneratingNew}
              generateErrorMessage={generateErrorMessage}
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

export default WebhookViewerPage;
