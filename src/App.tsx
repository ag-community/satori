/// <reference types="@rsbuild/core/types" />

import {
  Box,
  CssBaseline,
  createTheme,
  Stack,
  ThemeProvider,
  Toolbar,
} from '@mui/material';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider } from 'react-i18next';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { BANNER_HEIGHT, Navbar } from './components/Navbar';
import { _i18n } from './i18n';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { MatchPage } from './pages/MatchPage';
import { PlayerPage } from './pages/PlayerPage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Toolbar />
      <Box sx={{ height: `${BANNER_HEIGHT}px` }} />
      <Stack
        direction="column"
        justifyContent="space-between"
        minHeight="100vh"
      >
        <Box flexGrow={1}>
          <Outlet />
        </Box>
      </Stack>
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/match/:matchId" element={<MatchPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/player/:playerId" element={<PlayerPage />} />
    </Route>,
  ),
);

function fallbackRender({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

export default function App() {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#161616',
          },
          secondary: {
            main: '#4C94FF',
          },
          success: {
            main: '#4C94FF',
          },
          error: {
            main: '#FF4C4C',
          },
          background: {
            default: '#0F0F0F',
          },
        },
        typography: {
          fontFamily: 'Nunito',
        },
      }),
    [],
  );

  return (
    <React.StrictMode>
      <I18nextProvider i18n={_i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary fallbackRender={fallbackRender}>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </ThemeProvider>
      </I18nextProvider>
    </React.StrictMode>
  );
}
