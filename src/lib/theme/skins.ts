export type ThemeName = "greensteam" | "blacksteam" | "greysteam"

export interface SkinTokens {
  bg: string
  surface: string
  surfaceLighter: string
  inset: string
  borderLight: string
  borderDark: string
  gold: string
  goldBright: string
  accent: string
  text: string
}

export const THEMES: { value: ThemeName; label: string }[] = [
  { value: "greensteam", label: "Green" },
  { value: "blacksteam", label: "Black" },
  { value: "greysteam", label: "Grey" },
]

export const DEFAULT_THEME: ThemeName = "greensteam"
export const THEME_STORAGE_KEY = "satori-theme"

export const SKINS: Record<ThemeName, SkinTokens> = {
  greensteam: {
    bg: "#3e4637",
    surface: "#4c5844",
    surfaceLighter: "#5a6a50",
    inset: "#3e4637",
    borderLight: "#899281",
    borderDark: "#292d23",
    gold: "#c4b550",
    goldBright: "#e3e41f",
    accent: "#96892d",
    text: "#d8ded3",
  },
  blacksteam: {
    bg: "#080808",
    surface: "#212121",
    surfaceLighter: "#181818",
    inset: "#080808",
    borderLight: "#323232",
    borderDark: "#080808",
    gold: "#f0b43f",
    goldBright: "#e3e41f",
    accent: "#96892d",
    text: "#d8ded3",
  },
  greysteam: {
    bg: "rgba(0, 0, 0, 0.5)",
    surface: "rgba(160, 160, 160, 0.75)",
    surfaceLighter: "rgba(160, 160, 160, 0.5)",
    inset: "rgba(0, 0, 0, 0.5)",
    borderLight: "#c8c8c8",
    borderDark: "rgba(40, 40, 40, 0.75)",
    gold: "#ffffff",
    goldBright: "#e3e41f",
    accent: "#ffffff",
    text: "#ffffff",
  },
}
