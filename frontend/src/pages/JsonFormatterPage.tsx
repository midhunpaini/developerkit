import { type ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { SITE_CONFIG } from '@/config/site';
import { JSON_FORMATTER_TOOL } from '@/config/tools';
import { formatJson, minifyJson, validateJson } from '@/features/json-formatter/format';
import { buildSoftwareApplicationJsonLdForTool } from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';

type ValidationState = 'idle' | 'valid' | 'invalid';

function getValidationBadgeClass(state: ValidationState) {
  if (state === 'valid') {
    return 'border-success/40 bg-success/10 text-success';
  }
  if (state === 'invalid') {
    return 'border-error/40 bg-error/10 text-error';
  }
  return 'border-border bg-slate-900/60 text-slate-300';
}

function getValidationBadgeLabel(state: ValidationState) {
  if (state === 'valid') {
    return 'Valid JSON';
  }
  if (state === 'invalid') {
    return 'Invalid JSON';
  }
  return 'Awaiting input';
}

export function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [error, setError] = useState<string | null>(null);

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
  }

  function resetError() {
    setError(null);
  }

  function handleFormat() {
    try {
      const formatted = formatJson(input);
      setOutput(formatted);
      setValidationState('valid');
      resetError();
    } catch (formatError) {
      setValidationState('invalid');
      setError(formatError instanceof Error ? formatError.message : 'Unable to format JSON.');
    }
  }

  function handleMinify() {
    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setValidationState('valid');
      resetError();
    } catch (minifyError) {
      setValidationState('invalid');
      setError(minifyError instanceof Error ? minifyError.message : 'Unable to minify JSON.');
    }
  }

  function handleValidate() {
    try {
      validateJson(input);
      setValidationState('valid');
      resetError();
    } catch (validateError) {
      setValidationState('invalid');
      setError(
        validateError instanceof Error ? validateError.message : 'Unable to validate JSON.'
      );
    }
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setValidationState('idle');
    resetError();
  }

  return (
    <>
      <SeoMeta
        title={JSON_FORMATTER_TOOL.seoTitle}
        description={JSON_FORMATTER_TOOL.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${JSON_FORMATTER_TOOL.routePath}`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${JSON_FORMATTER_TOOL.routePath}`,
          type: 'website'
        }}
        jsonLd={buildSoftwareApplicationJsonLdForTool(JSON_FORMATTER_TOOL)}
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
          <section aria-labelledby="json-formatter-heading">
            <Panel className="p-6">
              <div className="space-y-3">
                <h1
                  id="json-formatter-heading"
                  className="text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                >
                  Free JSON Formatter
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {JSON_FORMATTER_TOOL.pageIntro}
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
                    htmlFor="json-formatter-input"
                    className="text-sm font-medium text-slate-200"
                  >
                    JSON Input
                  </label>
                  <textarea
                    id="json-formatter-input"
                    value={input}
                    onChange={handleInputChange}
                    rows={14}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="JSON input"
                    placeholder='{"hello":"world"}'
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" onClick={handleFormat}>
                    Format
                  </Button>
                  <Button onClick={handleMinify}>Minify</Button>
                  <Button onClick={handleValidate}>Validate</Button>
                  <Button onClick={handleClear}>Clear</Button>
                </div>
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-text">Validation</h2>
                    <span
                      className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${getValidationBadgeClass(
                        validationState
                      )}`}
                    >
                      {getValidationBadgeLabel(validationState)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Use validate to quickly check whether your JSON is syntactically
                    correct.
                  </p>
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-text">Output</h2>
                    {output ? (
                      <CopyButton
                        value={output}
                        label="Copy"
                        ariaLabel="Copy formatted JSON output"
                      />
                    ) : null}
                  </div>
                  {output ? (
                    <textarea
                      readOnly
                      rows={12}
                      value={output}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none"
                      aria-label="JSON output"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">
                      Formatted or minified JSON will appear here.
                    </p>
                  )}
                </div>
              </Panel>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default JsonFormatterPage;

