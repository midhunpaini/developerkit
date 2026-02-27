import { type ChangeEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { ToolFaqSection } from '@/components/seo/ToolFaqSection';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { SITE_CONFIG } from '@/config/site';
import { ENV_PARSER_TOOL } from '@/config/tools';
import {
  formatEnvValuesAsJson,
  formatNormalizedEnv,
  parseEnvContent
} from '@/features/env-parser/parse';
import {
  buildSoftwareApplicationJsonLdForTool,
  buildWebApplicationJsonLdForTool,
  buildFaqJsonLd,
  type FaqItem
} from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';

const SAMPLE_ENV = `# App configuration
NODE_ENV=production
API_URL=https://api.example.com
FEATURE_FLAG=true
RETRY_COUNT=3
export SECRET_KEY="abc 123"
`;

const ENV_PARSER_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What .env syntax does this parser support?',
    answer:
      'It supports KEY=VALUE entries, comments, quoted values, and optional export prefixes.'
  },
  {
    question: 'Can it detect invalid lines and duplicate keys?',
    answer:
      'Yes. It reports parse errors and warnings when duplicate keys override previous values.'
  },
  {
    question: 'What outputs does the parser provide?',
    answer:
      'It provides parsed JSON output, normalized .env output, and a list of validation issues.'
  }
];

export function EnvParserPage() {
  const [envInput, setEnvInput] = useState(SAMPLE_ENV);
  const [jsonOutput, setJsonOutput] = useState('');
  const [normalizedOutput, setNormalizedOutput] = useState('');
  const [issuesOutput, setIssuesOutput] = useState<string[]>([]);

  const issueCounts = useMemo(
    () => ({
      errors: issuesOutput.filter((issue) => issue.startsWith('[error]')).length,
      warnings: issuesOutput.filter((issue) => issue.startsWith('[warning]')).length
    }),
    [issuesOutput]
  );

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setEnvInput(event.target.value);
  }

  function handleParse() {
    const parsed = parseEnvContent(envInput);
    setJsonOutput(formatEnvValuesAsJson(parsed.values));
    setNormalizedOutput(formatNormalizedEnv(parsed.entries));
    setIssuesOutput(
      parsed.issues.map(
        (issue) => `[${issue.severity}] line ${issue.line}: ${issue.message}`
      )
    );
  }

  function handleClear() {
    setEnvInput('');
    setJsonOutput('');
    setNormalizedOutput('');
    setIssuesOutput([]);
  }

  return (
    <>
      <SeoMeta
        title={ENV_PARSER_TOOL.seoTitle}
        description={ENV_PARSER_TOOL.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${ENV_PARSER_TOOL.routePath}`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${ENV_PARSER_TOOL.routePath}`,
          type: 'website'
        }}
        jsonLd={[
          buildSoftwareApplicationJsonLdForTool(ENV_PARSER_TOOL),
          buildWebApplicationJsonLdForTool(ENV_PARSER_TOOL),
          buildFaqJsonLd(ENV_PARSER_FAQ_ITEMS)
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
          <section aria-labelledby="env-parser-heading">
            <Panel className="p-6">
              <div className="space-y-3">
                <h1
                  id="env-parser-heading"
                  className="text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                >
                  Free .env Parser
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {ENV_PARSER_TOOL.pageIntro}
                </p>
              </div>
            </Panel>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            <Panel className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="env-parser-input" className="text-sm font-medium text-slate-200">
                    .env input
                  </label>
                  <textarea
                    id="env-parser-input"
                    value={envInput}
                    onChange={handleInputChange}
                    rows={14}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label=".env input"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" onClick={handleParse}>
                    Parse
                  </Button>
                  <Button onClick={handleClear}>Clear</Button>
                </div>
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel className="p-4">
                <div className="space-y-2 text-sm text-slate-300">
                  <h2 className="text-base font-semibold text-text">Validation Summary</h2>
                  <p>
                    Errors: <span className="font-medium text-error">{issueCounts.errors}</span>
                  </p>
                  <p>
                    Warnings:{' '}
                    <span className="font-medium text-slate-200">{issueCounts.warnings}</span>
                  </p>
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-text">JSON Output</h2>
                    {jsonOutput ? (
                      <CopyButton value={jsonOutput} label="Copy" ariaLabel="Copy parsed env JSON" />
                    ) : null}
                  </div>
                  {jsonOutput ? (
                    <textarea
                      readOnly
                      rows={8}
                      value={jsonOutput}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-xs text-text focus-visible:outline-none"
                      aria-label="Parsed env JSON output"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">Parsed key/value JSON appears here.</p>
                  )}
                </div>
              </Panel>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Panel className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-text">Normalized .env</h2>
                  {normalizedOutput ? (
                    <CopyButton
                      value={normalizedOutput}
                      label="Copy"
                      ariaLabel="Copy normalized env output"
                    />
                  ) : null}
                </div>
                {normalizedOutput ? (
                  <textarea
                    readOnly
                    rows={10}
                    value={normalizedOutput}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-xs text-text focus-visible:outline-none"
                    aria-label="Normalized env output"
                  />
                ) : (
                  <p className="text-sm text-slate-400">
                    Normalized output appears after parsing.
                  </p>
                )}
              </div>
            </Panel>

            <Panel className="p-4">
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-text">Issues</h2>
                {issuesOutput.length > 0 ? (
                  <textarea
                    readOnly
                    rows={10}
                    value={issuesOutput.join('\n')}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-xs text-text focus-visible:outline-none"
                    aria-label="Env parser validation issues"
                  />
                ) : (
                  <p className="text-sm text-slate-400">
                    No issues reported. Parse input to validate entries.
                  </p>
                )}
              </div>
            </Panel>
          </section>

          <ToolFaqSection headingId="env-parser-faq-heading" items={ENV_PARSER_FAQ_ITEMS} />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default EnvParserPage;
