import { type ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { SITE_CONFIG } from '@/config/site';
import { HMAC_GENERATOR_TOOL } from '@/config/tools';
import { generateHmacSignature } from '@/features/hmac/crypto';
import { signaturesMatch } from '@/features/hmac/normalize';
import type {
  HmacAlgorithm,
  HmacEncoding,
  VerifyStatus
} from '@/features/hmac/types';
import { buildSoftwareApplicationJsonLdForTool } from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';

const ALGORITHM_OPTIONS: HmacAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
const ENCODING_OPTIONS: HmacEncoding[] = ['hex', 'base64'];

function verifyStatusClasses(status: VerifyStatus) {
  if (status === 'match') {
    return 'border-success/40 bg-success/10 text-success';
  }
  if (status === 'mismatch') {
    return 'border-error/40 bg-error/10 text-error';
  }
  return 'border-border bg-slate-900/60 text-slate-300';
}

function verifyStatusLabel(status: VerifyStatus) {
  if (status === 'match') {
    return 'Match';
  }
  if (status === 'mismatch') {
    return 'Does not match';
  }
  return 'Awaiting input';
}

export function HmacGeneratorPage() {
  const [secret, setSecret] = useState('');
  const [message, setMessage] = useState('');
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>('SHA-256');
  const [encoding, setEncoding] = useState<HmacEncoding>('hex');
  const [signature, setSignature] = useState('');
  const [expectedSignature, setExpectedSignature] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>('idle');
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  function resetErrors() {
    setValidationError(null);
    setRuntimeError(null);
  }

  function handleSecretChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setSecret(event.target.value);
  }

  function handleMessageChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
  }

  function handleExpectedSignatureChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setExpectedSignature(event.target.value);
  }

  function handleAlgorithmChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextAlgorithm = event.target.value as HmacAlgorithm;
    setAlgorithm(nextAlgorithm);
    setSignature('');
    setVerifyStatus('idle');
    resetErrors();
  }

  function handleEncodingChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextEncoding = event.target.value as HmacEncoding;
    setEncoding(nextEncoding);
    setSignature('');
    setVerifyStatus('idle');
    resetErrors();
  }

  async function handleGenerateSignature() {
    if (isGenerating) {
      return;
    }

    if (!secret.trim()) {
      setValidationError('Secret is required.');
      return;
    }

    setIsGenerating(true);
    resetErrors();

    try {
      const nextSignature = await generateHmacSignature({
        secret,
        message,
        algorithm,
        encoding
      });

      setSignature(nextSignature);

      if (expectedSignature.trim()) {
        setVerifyStatus(
          signaturesMatch(nextSignature, expectedSignature, encoding)
            ? 'match'
            : 'mismatch'
        );
      } else {
        setVerifyStatus('idle');
      }
    } catch (error) {
      setSignature('');
      setVerifyStatus('idle');
      setRuntimeError(
        error instanceof Error
          ? error.message
          : 'Unable to generate signature right now.'
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleVerifySignature() {
    if (!signature) {
      setValidationError('Generate a signature before verifying.');
      return;
    }

    if (!expectedSignature.trim()) {
      setValidationError('Enter an expected signature to verify.');
      return;
    }

    resetErrors();
    setVerifyStatus(
      signaturesMatch(signature, expectedSignature, encoding) ? 'match' : 'mismatch'
    );
  }

  function handleClear() {
    setSecret('');
    setMessage('');
    setAlgorithm('SHA-256');
    setEncoding('hex');
    setSignature('');
    setExpectedSignature('');
    setVerifyStatus('idle');
    setIsGenerating(false);
    resetErrors();
  }

  return (
    <>
      <SeoMeta
        title={HMAC_GENERATOR_TOOL.seoTitle}
        description={HMAC_GENERATOR_TOOL.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${HMAC_GENERATOR_TOOL.routePath}`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${HMAC_GENERATOR_TOOL.routePath}`,
          type: 'website'
        }}
        jsonLd={buildSoftwareApplicationJsonLdForTool(HMAC_GENERATOR_TOOL)}
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
          <section aria-labelledby="hmac-generator-heading">
            <Panel className="p-6">
              <div className="space-y-3">
                <h1
                  id="hmac-generator-heading"
                  className="text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                >
                  Free HMAC Generator
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {HMAC_GENERATOR_TOOL.pageIntro}
                </p>
              </div>
            </Panel>
          </section>

          {validationError ? (
            <Panel className="border-error/40 bg-error/10 p-3">
              <p className="text-sm text-error">{validationError}</p>
            </Panel>
          ) : null}

          {runtimeError ? (
            <Panel className="border-error/40 bg-error/10 p-3">
              <p className="text-sm text-error">{runtimeError}</p>
            </Panel>
          ) : null}

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            <Panel className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="hmac-secret" className="text-sm font-medium text-slate-200">
                    Secret
                  </label>
                  <textarea
                    id="hmac-secret"
                    value={secret}
                    onChange={handleSecretChange}
                    rows={4}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="Secret value"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="hmac-message" className="text-sm font-medium text-slate-200">
                    Message
                  </label>
                  <textarea
                    id="hmac-message"
                    value={message}
                    onChange={handleMessageChange}
                    rows={6}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="Message payload"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="hmac-algorithm"
                      className="text-sm font-medium text-slate-200"
                    >
                      Algorithm
                    </label>
                    <select
                      id="hmac-algorithm"
                      value={algorithm}
                      onChange={handleAlgorithmChange}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-label="HMAC algorithm"
                    >
                      {ALGORITHM_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="hmac-encoding"
                      className="text-sm font-medium text-slate-200"
                    >
                      Output format
                    </label>
                    <select
                      id="hmac-encoding"
                      value={encoding}
                      onChange={handleEncodingChange}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-label="Signature encoding format"
                    >
                      {ENCODING_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="primary"
                    onClick={handleGenerateSignature}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Signature'}
                  </Button>
                  <Button onClick={handleClear}>Clear</Button>
                </div>
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel className="p-4">
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-text">Generated Signature</h2>
                  {signature ? (
                    <>
                      <textarea
                        readOnly
                        value={signature}
                        rows={4}
                        className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none"
                        aria-label="Generated HMAC signature"
                      />
                      <CopyButton
                        value={signature}
                        label="Copy Signature"
                        ariaLabel="Copy generated signature"
                      />
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">
                      Generate a signature to view and copy it.
                    </p>
                  )}
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-text">Verify Signature</h2>
                  <div className="space-y-2">
                    <label
                      htmlFor="hmac-expected-signature"
                      className="text-sm font-medium text-slate-200"
                    >
                      Expected signature
                    </label>
                    <textarea
                      id="hmac-expected-signature"
                      value={expectedSignature}
                      onChange={handleExpectedSignatureChange}
                      rows={3}
                      className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-label="Expected signature"
                    />
                    <p className="text-xs text-slate-400">
                      Prefixes like <code>sha256=</code> and <code>v1=</code> are
                      accepted automatically.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button onClick={handleVerifySignature}>Verify</Button>
                    <span
                      className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${verifyStatusClasses(
                        verifyStatus
                      )}`}
                    >
                      {verifyStatusLabel(verifyStatus)}
                    </span>
                    <span aria-live="polite" className="sr-only">
                      {verifyStatusLabel(verifyStatus)}
                    </span>
                  </div>
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

export default HmacGeneratorPage;
