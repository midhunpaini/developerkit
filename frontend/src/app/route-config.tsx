import { Suspense, lazy, type ComponentType } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Panel } from '@/components/common/Panel';
import { LandingPage } from '@/pages/LandingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const LazyWebhookTesterPage = lazy(() => import('@/pages/WebhookViewerPage'));
const LazyJwtDebuggerPage = lazy(() => import('@/pages/JwtDebuggerPage'));
const LazyJsonFormatterPage = lazy(() => import('@/pages/JsonFormatterPage'));
const LazyHmacGeneratorPage = lazy(() => import('@/pages/HmacGeneratorPage'));

const ssrToolPageModules = import.meta.env.SSR
  ? import.meta.glob('../pages/{WebhookViewerPage,JwtDebuggerPage,JsonFormatterPage,HmacGeneratorPage}.tsx', {
      eager: true
    })
  : {};

function getSsrPageComponent(modulePath: string, exportName: string): ComponentType {
  const pageModule = ssrToolPageModules[modulePath] as Record<string, ComponentType> | undefined;
  const component = pageModule?.[exportName];

  if (!component) {
    throw new Error(`Missing SSR route component export "${exportName}" from ${modulePath}`);
  }

  return component;
}

const WebhookTesterPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/WebhookViewerPage.tsx', 'WebhookViewerPage')
  : LazyWebhookTesterPage;
const JwtDebuggerPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/JwtDebuggerPage.tsx', 'JwtDebuggerPage')
  : LazyJwtDebuggerPage;
const JsonFormatterPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/JsonFormatterPage.tsx', 'JsonFormatterPage')
  : LazyJsonFormatterPage;
const HmacGeneratorPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/HmacGeneratorPage.tsx', 'HmacGeneratorPage')
  : LazyHmacGeneratorPage;

function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Panel className="p-4 text-sm text-slate-300">Loading tool...</Panel>
    </div>
  );
}

function LazyRoute({ Component }: { Component: ComponentType }) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/webhook-tester" element={<LazyRoute Component={WebhookTesterPage} />} />
      <Route path="/jwt-debugger" element={<LazyRoute Component={JwtDebuggerPage} />} />
      <Route path="/json-formatter" element={<LazyRoute Component={JsonFormatterPage} />} />
      <Route path="/hmac-generator" element={<LazyRoute Component={HmacGeneratorPage} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
