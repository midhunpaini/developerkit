import { Suspense, lazy, type ComponentType } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Panel } from '@/components/common/Panel';
import { LandingPage } from '@/pages/LandingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const LazyWebhookTesterPage = lazy(() => import('@/pages/WebhookViewerPage'));
const LazyJwtDebuggerPage = lazy(() => import('@/pages/JwtDebuggerPage'));
const LazyJsonFormatterPage = lazy(() => import('@/pages/JsonFormatterPage'));
const LazyHmacGeneratorPage = lazy(() => import('@/pages/HmacGeneratorPage'));
const LazyRegexTesterPage = lazy(() => import('@/pages/RegexTesterPage'));
const LazyBase64EncoderDecoderPage = lazy(() => import('@/pages/Base64EncoderDecoderPage'));
const LazyUrlEncoderDecoderPage = lazy(() => import('@/pages/UrlEncoderDecoderPage'));
const LazyUuidGeneratorPage = lazy(() => import('@/pages/UuidGeneratorPage'));
const LazyTimestampConverterPage = lazy(() => import('@/pages/TimestampConverterPage'));
const LazyCronExpressionParserPage = lazy(() => import('@/pages/CronExpressionParserPage'));
const LazyJsonDiffPage = lazy(() => import('@/pages/JsonDiffPage'));
const LazyJsonSchemaValidatorPage = lazy(() => import('@/pages/JsonSchemaValidatorPage'));
const LazyOpenapiValidatorPage = lazy(() => import('@/pages/OpenapiValidatorPage'));
const LazyCurlToFetchPage = lazy(() => import('@/pages/CurlToFetchPage'));
const LazySqlFormatterPage = lazy(() => import('@/pages/SqlFormatterPage'));
const LazyXmlToJsonPage = lazy(() => import('@/pages/XmlToJsonPage'));
const LazyCsvToJsonPage = lazy(() => import('@/pages/CsvToJsonPage'));
const LazyJsonToTypescriptPage = lazy(() => import('@/pages/JsonToTypescriptPage'));
const LazyUlidGeneratorPage = lazy(() => import('@/pages/UlidGeneratorPage'));
const LazyEnvParserPage = lazy(() => import('@/pages/EnvParserPage'));

const ssrToolPageModules = import.meta.env.SSR
  ? import.meta.glob('../pages/{WebhookViewerPage,JwtDebuggerPage,JsonFormatterPage,HmacGeneratorPage,RegexTesterPage,Base64EncoderDecoderPage,UrlEncoderDecoderPage,UuidGeneratorPage,TimestampConverterPage,CronExpressionParserPage,JsonDiffPage,JsonSchemaValidatorPage,OpenapiValidatorPage,CurlToFetchPage,SqlFormatterPage,XmlToJsonPage,CsvToJsonPage,JsonToTypescriptPage,UlidGeneratorPage,EnvParserPage}.tsx', {
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
const RegexTesterPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/RegexTesterPage.tsx', 'RegexTesterPage')
  : LazyRegexTesterPage;
const Base64EncoderDecoderPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/Base64EncoderDecoderPage.tsx', 'Base64EncoderDecoderPage')
  : LazyBase64EncoderDecoderPage;
const UrlEncoderDecoderPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/UrlEncoderDecoderPage.tsx', 'UrlEncoderDecoderPage')
  : LazyUrlEncoderDecoderPage;
const UuidGeneratorPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/UuidGeneratorPage.tsx', 'UuidGeneratorPage')
  : LazyUuidGeneratorPage;
const TimestampConverterPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/TimestampConverterPage.tsx', 'TimestampConverterPage')
  : LazyTimestampConverterPage;
const CronExpressionParserPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/CronExpressionParserPage.tsx', 'CronExpressionParserPage')
  : LazyCronExpressionParserPage;
const JsonDiffPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/JsonDiffPage.tsx', 'JsonDiffPage')
  : LazyJsonDiffPage;
const JsonSchemaValidatorPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/JsonSchemaValidatorPage.tsx', 'JsonSchemaValidatorPage')
  : LazyJsonSchemaValidatorPage;
const OpenapiValidatorPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/OpenapiValidatorPage.tsx', 'OpenapiValidatorPage')
  : LazyOpenapiValidatorPage;
const CurlToFetchPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/CurlToFetchPage.tsx', 'CurlToFetchPage')
  : LazyCurlToFetchPage;
const SqlFormatterPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/SqlFormatterPage.tsx', 'SqlFormatterPage')
  : LazySqlFormatterPage;
const XmlToJsonPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/XmlToJsonPage.tsx', 'XmlToJsonPage')
  : LazyXmlToJsonPage;
const CsvToJsonPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/CsvToJsonPage.tsx', 'CsvToJsonPage')
  : LazyCsvToJsonPage;
const JsonToTypescriptPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/JsonToTypescriptPage.tsx', 'JsonToTypescriptPage')
  : LazyJsonToTypescriptPage;
const UlidGeneratorPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/UlidGeneratorPage.tsx', 'UlidGeneratorPage')
  : LazyUlidGeneratorPage;
const EnvParserPage: ComponentType = import.meta.env.SSR
  ? getSsrPageComponent('../pages/EnvParserPage.tsx', 'EnvParserPage')
  : LazyEnvParserPage;

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
      <Route path="/regex-tester" element={<LazyRoute Component={RegexTesterPage} />} />
      <Route
        path="/base64-encoder-decoder"
        element={<LazyRoute Component={Base64EncoderDecoderPage} />}
      />
      <Route
        path="/url-encoder-decoder"
        element={<LazyRoute Component={UrlEncoderDecoderPage} />}
      />
      <Route path="/uuid-generator" element={<LazyRoute Component={UuidGeneratorPage} />} />
      <Route
        path="/timestamp-converter"
        element={<LazyRoute Component={TimestampConverterPage} />}
      />
      <Route
        path="/cron-expression-parser"
        element={<LazyRoute Component={CronExpressionParserPage} />}
      />
      <Route path="/json-diff" element={<LazyRoute Component={JsonDiffPage} />} />
      <Route
        path="/json-schema-validator"
        element={<LazyRoute Component={JsonSchemaValidatorPage} />}
      />
      <Route
        path="/openapi-validator"
        element={<LazyRoute Component={OpenapiValidatorPage} />}
      />
      <Route path="/curl-to-fetch" element={<LazyRoute Component={CurlToFetchPage} />} />
      <Route path="/sql-formatter" element={<LazyRoute Component={SqlFormatterPage} />} />
      <Route path="/xml-to-json" element={<LazyRoute Component={XmlToJsonPage} />} />
      <Route path="/csv-to-json" element={<LazyRoute Component={CsvToJsonPage} />} />
      <Route
        path="/json-to-typescript"
        element={<LazyRoute Component={JsonToTypescriptPage} />}
      />
      <Route path="/ulid-generator" element={<LazyRoute Component={UlidGeneratorPage} />} />
      <Route path="/env-parser" element={<LazyRoute Component={EnvParserPage} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
