import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App';
import i18n from '@/lib/i18n';
import { buildAppTheme, DEFAULT_THEME, THEMES } from '@/lib/theme';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 2 } },
});

const theme = buildAppTheme();

const stored = localStorage.getItem('satori-theme-dark');
const initialTheme = THEMES.some((t) => t.value === stored)
  ? stored!
  : DEFAULT_THEME;
document.documentElement.dataset.theme = initialTheme;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App theme={theme} />
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
