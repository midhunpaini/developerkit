import type { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';

interface AppProvidersProps {
  children: ReactNode;
  helmetContext?: Record<string, unknown>;
}

export function AppProviders({
  children,
  helmetContext
}: AppProvidersProps) {
  return <HelmetProvider context={helmetContext}>{children}</HelmetProvider>;
}
