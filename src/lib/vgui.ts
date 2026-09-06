import type { Theme } from '@mui/material/styles';

export interface BevelStyle {
  borderTop: string;
  borderBottom: string;
  borderLeft: string;
  borderRight: string;
}

export function bevel(
  theme: Theme,
  kind: 'raised' | 'sunken' = 'raised',
): BevelStyle {
  const light = theme.vars.palette.borderLight;
  const dark = theme.vars.palette.borderDark;

  return kind === 'sunken'
    ? {
        borderTop: `1px solid ${dark}`,
        borderBottom: `1px solid ${light}`,
        borderLeft: `1px solid ${dark}`,
        borderRight: `1px solid ${light}`,
      }
    : {
        borderTop: `1px solid ${light}`,
        borderBottom: `1px solid ${dark}`,
        borderLeft: `1px solid ${light}`,
        borderRight: `1px solid ${dark}`,
      };
}

export const pressedBevel = (theme: Theme): BevelStyle =>
  bevel(theme, 'sunken');

export function insetPanel(theme: Theme) {
  return {
    backgroundColor: theme.vars.palette.inset,
    ...bevel(theme, 'sunken'),
  };
}

export function raisedPanel(theme: Theme) {
  return {
    backgroundColor: theme.vars.palette.surface,
    ...bevel(theme, 'raised'),
  };
}

export function cssColor(varName: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || fallback;
}
