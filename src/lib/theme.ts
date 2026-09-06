import { alpha, createColorScheme, createTheme } from '@mui/material/styles';

import type {} from './theme-augmentation';
import { vguiComponents } from './vguiComponents';

export type Theme = 'greensteam' | 'blacksteam' | 'greysteam';

export const THEMES: { value: Theme; label: string }[] = [
  { value: 'greensteam', label: 'Green' },
  { value: 'blacksteam', label: 'Black' },
  { value: 'greysteam', label: 'Grey' },
];

export const DEFAULT_THEME: Theme = 'greensteam';
export const LAYOUT_MAX_WIDTH = 780;
export const CONTROL_HEIGHT = 25;

interface SkinTokens {
  bg: string;
  surface: string;
  surfaceLighter: string;
  inset: string;
  borderLight: string;
  borderDark: string;
  gold: string;
  goldBright: string;
  accent: string;
  text: string;
}

const SKINS: Record<Theme, SkinTokens> = {
  greensteam: {
    bg: '#3e4637',
    surface: '#4c5844',
    surfaceLighter: '#5a6a50',
    inset: '#3e4637',
    borderLight: '#899281',
    borderDark: '#292d23',
    gold: '#c4b550',
    goldBright: '#e3e41f',
    accent: '#96892d',
    text: '#d8ded3',
  },
  blacksteam: {
    bg: '#080808',
    surface: '#212121',
    surfaceLighter: '#181818',
    inset: '#080808',
    borderLight: '#323232',
    borderDark: '#080808',
    gold: '#f0b43f',
    goldBright: '#e3e41f',
    accent: '#96892d',
    text: '#d8ded3',
  },
  greysteam: {
    bg: 'rgba(0, 0, 0, 0.5)',
    surface: 'rgba(160, 160, 160, 0.75)',
    surfaceLighter: 'rgba(160, 160, 160, 0.5)',
    inset: 'rgba(0, 0, 0, 0.5)',
    borderLight: '#c8c8c8',
    borderDark: 'rgba(40, 40, 40, 0.75)',
    gold: '#ffffff',
    goldBright: '#e3e41f',
    accent: '#ffffff',
    text: '#ffffff',
  },
};

function scheme(theme: Theme) {
  const s = SKINS[theme];
  return createColorScheme({
    palette: {
      mode: 'dark',
      background: { default: s.bg, paper: s.surface },
      text: { primary: s.text, secondary: s.text },
      divider: alpha(s.text, 0.28),
      primary: { main: s.gold, contrastText: s.bg },
      secondary: { main: s.goldBright, contrastText: s.bg },
      gold: s.gold,
      goldBright: s.goldBright,
      borderLight: s.borderLight,
      borderDark: s.borderDark,
      line: s.borderDark,
      surface: s.surface,
      surfaceLighter: s.surfaceLighter,
      inset: s.inset,
      radius: theme === 'greysteam' ? '10px' : '0px',
    },
  });
}

export function buildAppTheme(): ReturnType<typeof createTheme> {
  return createTheme({
    defaultColorScheme: DEFAULT_THEME,
    colorSchemes: {
      greensteam: scheme('greensteam'),
      blacksteam: scheme('blacksteam'),
      greysteam: scheme('greysteam'),
    },
    cssVariables: {
      colorSchemeSelector: 'data-theme',
    },
    shape: {
      borderRadius: 'var(--mui-palette-radius)',
    },
    typography: {
      fontFamily: "'Trebuchet MS', 'Verdana', sans-serif",
      fontSize: 14,
    },
    components: vguiComponents(),
  });
}
