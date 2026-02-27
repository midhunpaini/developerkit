import { type ChangeEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { ToolFaqSection } from '@/components/seo/ToolFaqSection';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { SITE_CONFIG } from '@/config/site';
import { JSON_DIFF_TOOL } from '@/config/tools';
import {
  diffJsonValues,
  summarizeJsonDiff,
  type JsonDiffEntry
} from '@/features/json-diff/diff';
import {
  buildSoftwareApplicationJsonLdForTool,
  buildWebApplicationJsonLdForTool,
  buildFaqJsonLd,
  type FaqItem
} from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';

const INITIAL_LEFT = `{
  "id": 12,
  "name": "DeveloperKit",
  "enabled": true,
  "tags": ["tools", "json"]
}`;

const INITIAL_RIGHT = `{
  "id": "12",
  "name": "DeveloperKit",
  "enabled": false,
  "tags": ["tools", "json", "diff"],
  "region": "us-east-1"
}`;

const JSON_DIFF_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What kinds of changes does JSON Diff detect?',
    answer:
      'It detects added keys, removed keys, changed values, and type changes across nested objects and arrays.'
  },
  {
    question: 'Can I compare deeply nested JSON?',
    answer:
      'Yes. Differences are reported with full JSON paths so nested changes are easy to trace.'
  },
  {
    question: 'Does this tool validate JSON before comparing?',
    answer:
      'Yes. Both inputs must be valid JSON before diffing starts.'
  }
];

export function JsonDiffPage() {
  const [leftInput, setLeftInput] = useState(INITIAL_LEFT);
  const [rightInput, setRightInput] = useState(INITIAL_RIGHT);
  const [diffEntries, setDiffEntries] = useState<JsonDiffEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => summarizeJsonDiff(diffEntries), [diffEntries]);
  const diffOutput = useMemo(
    () => (diffEntries.length > 0 ? JSON.stringify(diffEntries, null, 2) : ''),
    [diffEntries]
  );

  function handleLeftInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setLeftInput(event.target.value);
  }

  function handleRightInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setRightInput(event.target.value);
  }

  function handleCompare() {
    try {
      const beforeValue = JSON.parse(leftInput);
      const afterValue = JSON.parse(rightInput);
      const nextDiffEntries = diffJsonValues(beforeValue, afterValue);

      setDiffEntries(nextDiffEntries);
      setError(null);
    } catch (compareError) {
      setDiffEntries([]);
      setError(
        compareError instanceof Error ? compareError.message : 'Unable to compare JSON.'
      );
    }
  }

  function handleSwap() {
    setLeftInput(rightInput);
    setRightInput(leftInput);
    setDiffEntries([]);
    setError(null);
  }

  function handleClear() {
    setLeftInput('');
    setRightInput('');
    setDiffEntries([]);
    setError(null);
  }

  return (
    <>
      <SeoMeta
        title={JSON_DIFF_TOOL.seoTitle}
        description={JSON_DIFF_TOOL.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${JSON_DIFF_TOOL.routePath}`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${JSON_DIFF_TOOL.routePath}`,
          type: 'website'
        }}
        jsonLd={[
          buildSoftwareApplicationJsonLdForTool(JSON_DIFF_TOOL),
          buildWebApplicationJsonLdForTool(JSON_DIFF_TOOL),
          buildFaqJsonLd(JSON_DIFF_FAQ_ITEMS)
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
          <section aria-labelledby="json-diff-heading">
            <Panel className="p-6">
              <div className="space-y-3">
                <h1
                  id="json-diff-heading"
                  className="text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                >
                  Free JSON Diff Tool
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {JSON_DIFF_TOOL.pageIntro}
                </p>
              </div>
            </Panel>
          </section>

          {error ? (
            <Panel className="border-error/40 bg-error/10 p-3">
              <p className="text-sm text-error">{error}</p>
            </Panel>
          ) : null}

          <section className="space-y-4">
            <Panel className="p-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="json-diff-left" className="text-sm font-medium text-slate-200">
                    Before JSON
                  </label>
                  <textarea
                    id="json-diff-left"
                    value={leftInput}
                    onChange={handleLeftInputChange}
                    rows={12}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="Before JSON input"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="json-diff-right"
                    className="text-sm font-medium text-slate-200"
                  >
                    After JSON
                  </label>
                  <textarea
                    id="json-diff-right"
                    value={rightInput}
                    onChange={handleRightInputChange}
                    rows={12}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="After JSON input"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button variant="primary" onClick={handleCompare}>
                  Compare
                </Button>
                <Button onClick={handleSwap}>Swap</Button>
                <Button onClick={handleClear}>Clear</Button>
              </div>
            </Panel>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
              <Panel className="p-4">
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-text">Diff Summary</h2>
                  <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                    <p>
                      Total changes: <span className="font-medium text-text">{summary.total}</span>
                    </p>
                    <p>
                      Added: <span className="font-medium text-success">{summary.added}</span>
                    </p>
                    <p>
                      Removed: <span className="font-medium text-error">{summary.removed}</span>
                    </p>
                    <p>
                      Changed: <span className="font-medium text-text">{summary.changed}</span>
                    </p>
                    <p>
                      Type changes:{' '}
                      <span className="font-medium text-primary">{summary.typeChanged}</span>
                    </p>
                  </div>
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-text">Diff Output</h2>
                    {diffOutput ? (
                      <CopyButton value={diffOutput} label="Copy" ariaLabel="Copy diff output" />
                    ) : null}
                  </div>
                  {diffOutput ? (
                    <textarea
                      readOnly
                      rows={12}
                      value={diffOutput}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-xs text-text focus-visible:outline-none"
                      aria-label="JSON diff output"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">
                      Run compare to inspect key-level differences.
                    </p>
                  )}
                </div>
              </Panel>
            </div>
          </section>

          <ToolFaqSection headingId="json-diff-faq-heading" items={JSON_DIFF_FAQ_ITEMS} />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default JsonDiffPage;
