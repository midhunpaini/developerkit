import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@/app/App';
import { AppProviders } from '@/app/AppProviders';

function createAppTree() {
  return (
    <StrictMode>
      <AppProviders>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProviders>
    </StrictMode>
  );
}

export function startClient() {
  const container = document.getElementById('root');

  if (!container) {
    return;
  }

  const shouldHydrate = container.firstElementChild !== null;

  if (shouldHydrate) {
    hydrateRoot(container, createAppTree());
    return;
  }

  createRoot(container).render(createAppTree());
}
