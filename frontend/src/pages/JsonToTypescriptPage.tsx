import { type ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { ToolFaqSection } from '@/components/seo/ToolFaqSection';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { SITE_CONFIG } from '@/config/site';
import { JSON_TO_TYPESCRIPT_TOOL } from '@/config/tools';
import { generateTypeScriptFromJson } from '@/features/json-to-typescript/generate';
import {
  buildSoftwareApplicationJsonLdForTool,
  buildWebApplicationJsonLdForTool,
  buildFaqJsonLd,
  type FaqItem
} from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';

const SAMPLE_JSON = `{
  "id": 42,
  "name": "Webhook Event",
  "active": true,
  "metadata": {
    "region": "us-east-1",
    "retries": 3
  },
  "tags": ["api", "events"]
}`;

const JSON_TO_TYPESCRIPT_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What TypeScript output does this generator create?',
    answer:
      'It generates a Root interface for object inputs or a Root type alias for non-object JSON values.'
  },
  {
    question: 'How are arrays and nested objects handled?',
    answer:
      'Nested structures are inferred recursively, and arrays are represented with inferred item union types when needed.'
  },
  {
    question: 'Do I need valid JSON input?',
    answer:
      'Yes. Input must be valid JSON before TypeScript types can be generated.'
  }
];

export function JsonToTypescriptPage() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setJsonInput(event.target.value);
  }

  function handleGenerate() {
    try {
      const generatedTypes = generateTypeScriptFromJson(jsonInput);
      setOutput(generatedTypes);
      setError(null);
    } catch (generationError) {
      setOutput('');
      setError(
        generationError instanceof Error
          ? generationError.message
          : 'Unable to generate TypeScript types.'
      );
    }
  }

  function handleClear() {
    setJsonInput('');
    setOutput('');
    setError(null);
  }

  return (
    <>
      <SeoMeta
        title={JSON_TO_TYPESCRIPT_TOOL.seoTitle}
        description={JSON_TO_TYPESCRIPT_TOOL.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${JSON_TO_TYPESCRIPT_TOOL.routePath}`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${JSON_TO_TYPESCRIPT_TOOL.routePath}`,
          type: 'website'
        }}
        jsonLd={[
          buildSoftwareApplicationJsonLdForTool(JSON_TO_TYPESCRIPT_TOOL),
          buildWebApplicationJsonLdForTool(JSON_TO_TYPESCRIPT_TOOL),
          buildFaqJsonLd(JSON_TO_TYPESCRIPT_FAQ_ITEMS)
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
          <section aria-labelledby="json-to-typescript-heading">
            <Panel className="p-6">
              <div className="space-y-3">
                <h1
                  id="json-to-typescript-heading"
                  className="text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                >
                  Free JSON to TypeScript Converter
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {JSON_TO_TYPESCRIPT_TOOL.pageIntro}
                </p>
              </div>
            </Panel>
          </section>

          {error ? (
            <Panel className="border-error/40 bg-error/10 p-3">
              <p className="text-sm text-error">{error}</p>
            </Panel>
          ) : null}

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            <Panel className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="json-to-typescript-input"
                    className="text-sm font-medium text-slate-200"
                  >
                    JSON sample
                  </label>
                  <textarea
                    id="json-to-typescript-input"
                    value={jsonInput}
                    onChange={handleInputChange}
                    rows={14}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="JSON sample input"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" onClick={handleGenerate}>
                    Generate Types
                  </Button>
                  <Button onClick={handleClear}>Clear</Button>
                </div>
              </div>
            </Panel>

            <Panel className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-text">TypeScript Output</h2>
                  {output ? (
                    <CopyButton
                      value={output}
                      label="Copy"
                      ariaLabel="Copy generated TypeScript types"
                    />
                  ) : null}
                </div>
                {output ? (
                  <textarea
                    readOnly
                    rows={16}
                    value={output}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-xs text-text focus-visible:outline-none"
                    aria-label="Generated TypeScript output"
                  />
                ) : (
                  <p className="text-sm text-slate-400">
                    Generated TypeScript interfaces and types appear here.
                  </p>
                )}
              </div>
            </Panel>
          </section>

          <ToolFaqSection
            headingId="json-to-typescript-faq-heading"
            items={JSON_TO_TYPESCRIPT_FAQ_ITEMS}
          />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default JsonToTypescriptPage;
