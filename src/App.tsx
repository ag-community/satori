import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';

import { Layout } from '@/components/layout/Layout';
import type { buildAppTheme } from '@/lib/theme';
import { DocsPage } from '@/pages/DocsPage';
import { GamePage } from '@/pages/GamePage';
import { HomePage } from '@/pages/HomePage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PlayerPage } from '@/pages/PlayerPage';

type AppTheme = ReturnType<typeof buildAppTheme>;

export default function App({ theme }: { theme: AppTheme }) {
  return (
    <ThemeProvider
      theme={theme}
      defaultMode="dark"
      colorSchemeStorageKey="satori-theme"
      forceThemeRerender
      disableTransitionOnChange
    >
      <CssBaseline enableColorScheme />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/player/:playerId" element={<PlayerPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
