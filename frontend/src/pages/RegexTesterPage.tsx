import { type ChangeEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { ToolFaqSection } from '@/components/seo/ToolFaqSection';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { SITE_CONFIG } from '@/config/site';
import { REGEX_TESTER_TOOL } from '@/config/tools';
import {
  executeRegex,
  replaceWithRegex,
  type RegexMatchResult
} from '@/features/regex-tester/match';
import {
  buildSoftwareApplicationJsonLdForTool,
  buildWebApplicationJsonLdForTool,
  buildFaqJsonLd,
  type FaqItem
} from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';

const REGEX_TESTER_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Which regex flags are supported?',
    answer:
      'This tool supports JavaScript regex flags: g, i, m, s, u, and y.'
  },
  {
    question: 'Can I test capture groups and named groups?',
    answer:
      'Yes. Match output includes capture groups and named groups when present in your pattern.'
  },
  {
    question: 'Does replacement preview support backreferences?',
    answer:
      'Yes. You can use replacement patterns like $1, $2, and named group replacements supported by JavaScript.'
  }
];

export function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [replacement, setReplacement] = useState('');
  const [matches, setMatches] = useState<RegexMatchResult[]>([]);
  const [replacementOutput, setReplacementOutput] = useState('');
  const [compiledExpression, setCompiledExpression] = useState('');
  const [error, setError] = useState<string | null>(null);

  const matchesOutput = useMemo(
    () => (matches.length > 0 ? JSON.stringify(matches, null, 2) : ''),
    [matches]
  );

  function handlePatternChange(event: ChangeEvent<HTMLInputElement>) {
    setPattern(event.target.value);
  }

  function handleFlagsChange(event: ChangeEvent<HTMLInputElement>) {
    setFlags(event.target.value);
  }

  function handleTestTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setTestText(event.target.value);
  }

  function handleReplacementChange(event: ChangeEvent<HTMLInputElement>) {
    setReplacement(event.target.value);
  }

  function handleRunTest() {
    try {
      const result = executeRegex(pattern, flags, testText);
      const replacedText = replaceWithRegex(pattern, flags, testText, replacement);

      setCompiledExpression(result.regex.toString());
      setMatches(result.matches);
      setReplacementOutput(replacedText);
      setError(null);
    } catch (runError) {
      setCompiledExpression('');
      setMatches([]);
      setReplacementOutput('');
      setError(runError instanceof Error ? runError.message : 'Unable to run regex test.');
    }
  }

  function handleClear() {
    setPattern('');
    setFlags('g');
    setTestText('');
    setReplacement('');
    setMatches([]);
    setReplacementOutput('');
    setCompiledExpression('');
    setError(null);
  }

  return (
    <>
      <SeoMeta
        title={REGEX_TESTER_TOOL.seoTitle}
        description={REGEX_TESTER_TOOL.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${REGEX_TESTER_TOOL.routePath}`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${REGEX_TESTER_TOOL.routePath}`,
          type: 'website'
        }}
        jsonLd={[
          buildSoftwareApplicationJsonLdForTool(REGEX_TESTER_TOOL),
          buildWebApplicationJsonLdForTool(REGEX_TESTER_TOOL),
          buildFaqJsonLd(REGEX_TESTER_FAQ_ITEMS)
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
          <section aria-labelledby="regex-tester-heading">
            <Panel className="p-6">
              <div className="space-y-3">
                <h1
                  id="regex-tester-heading"
                  className="text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                >
                  Free Regex Tester
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {REGEX_TESTER_TOOL.pageIntro}
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
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
                  <div className="space-y-2">
                    <label
                      htmlFor="regex-pattern"
                      className="text-sm font-medium text-slate-200"
                    >
                      Pattern
                    </label>
                    <input
                      id="regex-pattern"
                      value={pattern}
                      onChange={handlePatternChange}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      placeholder="\\b(error|warn)\\b"
                      aria-label="Regex pattern"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="regex-flags"
                      className="text-sm font-medium text-slate-200"
                    >
                      Flags
                    </label>
                    <input
                      id="regex-flags"
                      value={flags}
                      onChange={handleFlagsChange}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      placeholder="gim"
                      aria-label="Regex flags"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="regex-input"
                    className="text-sm font-medium text-slate-200"
                  >
                    Test text
                  </label>
                  <textarea
                    id="regex-input"
                    value={testText}
                    onChange={handleTestTextChange}
                    rows={12}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    placeholder="Paste text to test your expression"
                    aria-label="Regex test text"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="regex-replacement"
                    className="text-sm font-medium text-slate-200"
                  >
                    Replacement string
                  </label>
                  <input
                    id="regex-replacement"
                    value={replacement}
                    onChange={handleReplacementChange}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    placeholder="$1"
                    aria-label="Regex replacement value"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" onClick={handleRunTest}>
                    Run Test
                  </Button>
                  <Button onClick={handleClear}>Clear</Button>
                </div>
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel className="p-4">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-text">Summary</h2>
                  <p className="text-sm text-slate-300">
                    Compiled expression:{' '}
                    <span className="font-mono text-xs text-slate-200">
                      {compiledExpression || '-'}
                    </span>
                  </p>
                  <p className="text-sm text-slate-300">
                    Match count:{' '}
                    <span className="font-medium text-text">{matches.length}</span>
                  </p>
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-text">Matches</h2>
                    {matchesOutput ? (
                      <CopyButton
                        value={matchesOutput}
                        label="Copy"
                        ariaLabel="Copy regex matches"
                      />
                    ) : null}
                  </div>
                  {matchesOutput ? (
                    <textarea
                      readOnly
                      rows={10}
                      value={matchesOutput}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-xs text-text focus-visible:outline-none"
                      aria-label="Regex matches output"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">Run a test to inspect match output.</p>
                  )}
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-text">Replacement Preview</h2>
                    {replacementOutput ? (
                      <CopyButton
                        value={replacementOutput}
                        label="Copy"
                        ariaLabel="Copy regex replacement output"
                      />
                    ) : null}
                  </div>
                  {replacementOutput ? (
                    <textarea
                      readOnly
                      rows={6}
                      value={replacementOutput}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none"
                      aria-label="Regex replacement preview"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">
                      Replacement output appears after running the test.
                    </p>
                  )}
                </div>
              </Panel>
            </div>
          </section>

          <ToolFaqSection headingId="regex-tester-faq-heading" items={REGEX_TESTER_FAQ_ITEMS} />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default RegexTesterPage;
