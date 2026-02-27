import { type ChangeEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { ToolFaqSection } from '@/components/seo/ToolFaqSection';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { SITE_CONFIG } from '@/config/site';
import { CURL_TO_FETCH_TOOL } from '@/config/tools';
import {
  convertCurlToFetch,
  type ParsedCurlCommand
} from '@/features/curl-to-fetch/convert';
import {
  buildSoftwareApplicationJsonLdForTool,
  buildWebApplicationJsonLdForTool,
  buildFaqJsonLd,
  type FaqItem
} from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';

const SAMPLE_CURL_COMMAND = `curl -X POST https://api.example.com/v1/events \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{"name":"deploy","status":"ok"}'`;

const CURL_TO_FETCH_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Which cURL options are supported?',
    answer:
      'The converter supports common options including method, URL, headers, and body data flags for most API examples.'
  },
  {
    question: 'Will this include headers and body in fetch output?',
    answer:
      'Yes. Parsed headers and body values are emitted in the generated fetch options when present.'
  },
  {
    question: 'Can I convert multiline cURL commands?',
    answer:
      'Yes. The parser handles line continuations and quoted values used in multiline commands.'
  }
];

export function CurlToFetchPage() {
  const [curlInput, setCurlInput] = useState(SAMPLE_CURL_COMMAND);
  const [fetchOutput, setFetchOutput] = useState('');
  const [parsedCommand, setParsedCommand] = useState<ParsedCurlCommand | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headerCount = useMemo(
    () => (parsedCommand ? Object.keys(parsedCommand.headers).length : 0),
    [parsedCommand]
  );

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setCurlInput(event.target.value);
  }

  function handleConvert() {
    try {
      const result = convertCurlToFetch(curlInput);
      setParsedCommand(result.parsed);
      setFetchOutput(result.code);
      setError(null);
    } catch (convertError) {
      setParsedCommand(null);
      setFetchOutput('');
      setError(
        convertError instanceof Error
          ? convertError.message
          : 'Unable to convert cURL command.'
      );
    }
  }

  function handleClear() {
    setCurlInput('');
    setFetchOutput('');
    setParsedCommand(null);
    setError(null);
  }

  return (
    <>
      <SeoMeta
        title={CURL_TO_FETCH_TOOL.seoTitle}
        description={CURL_TO_FETCH_TOOL.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${CURL_TO_FETCH_TOOL.routePath}`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${CURL_TO_FETCH_TOOL.routePath}`,
          type: 'website'
        }}
        jsonLd={[
          buildSoftwareApplicationJsonLdForTool(CURL_TO_FETCH_TOOL),
          buildWebApplicationJsonLdForTool(CURL_TO_FETCH_TOOL),
          buildFaqJsonLd(CURL_TO_FETCH_FAQ_ITEMS)
        ]}
      />

      <div className="flex min-h-screen flex-col bg-appbg text-text">
        <header className="border-b border-border/50 bg-appbg">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-6">
            <Link
              to="/"
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Go to DeveloperKit.dev home"
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
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6">
          <section aria-labelledby="curl-to-fetch-heading">
            <Panel className="p-6">
              <div className="space-y-3">
                <h1
                  id="curl-to-fetch-heading"
                  className="text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                >
                  Free cURL to Fetch Converter
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {CURL_TO_FETCH_TOOL.pageIntro}
                </p>
              </div>
            </Panel>
          </section>

          {error ? (
            <Panel className="border-error/40 bg-error/10 p-3">
              <p className="text-sm text-error">{error}</p>
            </Panel>
          ) : null}

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <Panel className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="curl-command-input"
                    className="text-sm font-medium text-slate-200"
                  >
                    cURL command
                  </label>
                  <textarea
                    id="curl-command-input"
                    value={curlInput}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="cURL command input"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" onClick={handleConvert}>
                    Convert
                  </Button>
                  <Button onClick={handleClear}>Clear</Button>
                </div>
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel className="p-4">
                <div className="space-y-2 text-sm text-slate-300">
                  <h2 className="text-base font-semibold text-text">Parsed Request</h2>
                  <p>
                    Method:{' '}
                    <span className="font-mono text-slate-200">
                      {parsedCommand?.method ?? '-'}
                    </span>
                  </p>
                  <p>
                    URL:{' '}
                    <span className="break-all font-mono text-xs text-slate-200">
                      {parsedCommand?.url ?? '-'}
                    </span>
                  </p>
                  <p>
                    Headers:{' '}
                    <span className="font-medium text-text">{headerCount}</span>
                  </p>
                  <p>
                    Body:{' '}
                    <span className="font-medium text-text">
                      {parsedCommand
                        ? parsedCommand.body !== null
                          ? 'Yes'
                          : 'No'
                        : '-'}
                    </span>
                  </p>
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-text">Fetch Output</h2>
                    {fetchOutput ? (
                      <CopyButton
                        value={fetchOutput}
                        label="Copy"
                        ariaLabel="Copy fetch code output"
                      />
                    ) : null}
                  </div>
                  {fetchOutput ? (
                    <textarea
                      readOnly
                      rows={14}
                      value={fetchOutput}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-xs text-text focus-visible:outline-none"
                      aria-label="Fetch code output"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">
                      Converted fetch code appears here.
                    </p>
                  )}
                </div>
              </Panel>
            </div>
          </section>

          <ToolFaqSection headingId="curl-to-fetch-faq-heading" items={CURL_TO_FETCH_FAQ_ITEMS} />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default CurlToFetchPage;
