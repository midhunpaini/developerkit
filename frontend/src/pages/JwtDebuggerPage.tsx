import { type ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { SITE_CONFIG } from '@/config/site';
import { JWT_DEBUGGER_TOOL } from '@/config/tools';
import { decodeJwt } from '@/features/jwt/decode';
import type { JwtDecodeResult } from '@/features/jwt/types';
import { buildSoftwareApplicationJsonLdForTool } from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';

function formatJson(value: Record<string, unknown>) {
  return JSON.stringify(value, null, 2);
}

function unixToReadable(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '-';
  }
  return new Date(value * 1000).toLocaleString();
}

function getTimingStatus(payload: Record<string, unknown>) {
  const now = Math.floor(Date.now() / 1000);
  const exp = typeof payload.exp === 'number' ? payload.exp : null;
  const nbf = typeof payload.nbf === 'number' ? payload.nbf : null;

  if (nbf !== null && now < nbf) {
    return {
      label: 'Not Active Yet',
      classes: 'border-border bg-slate-900/60 text-slate-300'
    };
  }

  if (exp !== null && now >= exp) {
    return {
      label: 'Expired',
      classes: 'border-error/40 bg-error/10 text-error'
    };
  }

  if (exp !== null && now < exp) {
    return {
      label: 'Valid',
      classes: 'border-success/40 bg-success/10 text-success'
    };
  }

  return {
    label: 'No Expiry Claim',
    classes: 'border-border bg-slate-900/60 text-slate-300'
  };
}

export function JwtDebuggerPage() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<JwtDecodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timingStatus = decoded ? getTimingStatus(decoded.payload) : null;
  const headerString = decoded ? formatJson(decoded.header) : '';
  const payloadString = decoded ? formatJson(decoded.payload) : '';

  function handleTokenChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setToken(event.target.value);
  }

  function handleDecode() {
    try {
      const result = decodeJwt(token);
      setDecoded(result);
      setError(null);
    } catch (decodeError) {
      setDecoded(null);
      setError(
        decodeError instanceof Error ? decodeError.message : 'Failed to decode JWT.'
      );
    }
  }

  function handleClear() {
    setToken('');
    setDecoded(null);
    setError(null);
  }

  return (
    <>
      <SeoMeta
        title={JWT_DEBUGGER_TOOL.seoTitle}
        description={JWT_DEBUGGER_TOOL.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${JWT_DEBUGGER_TOOL.routePath}`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${JWT_DEBUGGER_TOOL.routePath}`,
          type: 'website'
        }}
        jsonLd={buildSoftwareApplicationJsonLdForTool(JWT_DEBUGGER_TOOL)}
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
          <section aria-labelledby="jwt-debugger-heading">
            <Panel className="p-6">
              <div className="space-y-3">
                <h1
                  id="jwt-debugger-heading"
                  className="text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                >
                  Free JWT Debugger
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {JWT_DEBUGGER_TOOL.pageIntro}
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
                  <label htmlFor="jwt-token" className="text-sm font-medium text-slate-200">
                    JWT Token
                  </label>
                  <textarea
                    id="jwt-token"
                    value={token}
                    onChange={handleTokenChange}
                    rows={10}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="JWT token input"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" onClick={handleDecode}>
                    Decode Token
                  </Button>
                  <Button onClick={handleClear}>Clear</Button>
                </div>
              </div>
            </Panel>

            <Panel className="p-4">
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-text">Token Overview</h2>
                {decoded ? (
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <p>
                        <span className="text-slate-400">Algorithm:</span>{' '}
                        {String(decoded.header.alg ?? '-')}
                      </p>
                      <p>
                        <span className="text-slate-400">Type:</span>{' '}
                        {String(decoded.header.typ ?? '-')}
                      </p>
                      <p>
                        <span className="text-slate-400">Issuer:</span>{' '}
                        {String(decoded.payload.iss ?? '-')}
                      </p>
                      <p>
                        <span className="text-slate-400">Subject:</span>{' '}
                        {String(decoded.payload.sub ?? '-')}
                      </p>
                    </div>
                    <p>
                      <span className="text-slate-400">Issued At:</span>{' '}
                      {unixToReadable(decoded.payload.iat)}
                    </p>
                    <p>
                      <span className="text-slate-400">Expires At:</span>{' '}
                      {unixToReadable(decoded.payload.exp)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Token Status:</span>
                      <span
                        className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${timingStatus?.classes ?? ''}`}
                      >
                        {timingStatus?.label ?? 'Unknown'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    Decode a JWT token to inspect its claims and status.
                  </p>
                )}
              </div>
            </Panel>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Panel className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-text">Header</h2>
                  {decoded ? (
                    <CopyButton
                      value={headerString}
                      label="Copy"
                      ariaLabel="Copy JWT header JSON"
                    />
                  ) : null}
                </div>
                {decoded ? (
                  <textarea
                    readOnly
                    rows={8}
                    value={headerString}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none"
                    aria-label="Decoded JWT header"
                  />
                ) : (
                  <p className="text-sm text-slate-400">Header JSON appears after decoding.</p>
                )}
              </div>
            </Panel>

            <Panel className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-text">Payload</h2>
                  {decoded ? (
                    <CopyButton
                      value={payloadString}
                      label="Copy"
                      ariaLabel="Copy JWT payload JSON"
                    />
                  ) : null}
                </div>
                {decoded ? (
                  <textarea
                    readOnly
                    rows={8}
                    value={payloadString}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none"
                    aria-label="Decoded JWT payload"
                  />
                ) : (
                  <p className="text-sm text-slate-400">Payload JSON appears after decoding.</p>
                )}
              </div>
            </Panel>
          </section>

          <section aria-label="JWT signature">
            <Panel className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-text">Signature</h2>
                  {decoded ? (
                    <CopyButton
                      value={decoded.signature}
                      label="Copy"
                      ariaLabel="Copy JWT signature"
                    />
                  ) : null}
                </div>
                {decoded ? (
                  <textarea
                    readOnly
                    rows={3}
                    value={decoded.signature || '(empty)'}
                    className="w-full rounded-md border border-border bg-slate-900/60 px-3 py-2 font-mono text-sm text-text focus-visible:outline-none"
                    aria-label="JWT signature segment"
                  />
                ) : (
                  <p className="text-sm text-slate-400">
                    Signature segment appears after decoding.
                  </p>
                )}
              </div>
            </Panel>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default JwtDebuggerPage;

