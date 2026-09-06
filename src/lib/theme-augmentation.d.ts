import type {} from '@mui/material/themeCssVarsAugmentation';

declare module '@mui/material/styles' {
  interface ColorSchemeOverrides {
    greensteam: true;
    blacksteam: true;
    greysteam: true;
  }
  interface Palette {
    gold: string;
    goldBright: string;
    borderLight: string;
    borderDark: string;
    line: string;
    surface: string;
    surfaceLighter: string;
    inset: string;
    radius: string;
  }
  interface PaletteOptions {
    gold?: string;
    goldBright?: string;
    borderLight?: string;
    borderDark?: string;
    line?: string;
    surface?: string;
    surfaceLighter?: string;
    inset?: string;
    radius?: string;
  }
}
