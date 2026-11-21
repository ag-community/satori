import { browser } from "$app/env"
import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES, type ThemeName } from "./skins.js"

let current = $state<ThemeName>(DEFAULT_THEME)

export function getTheme(): ThemeName {
  return current
}

export function setTheme(theme: ThemeName): void {
  current = theme
  if (!browser) return

  localStorage.setItem(THEME_STORAGE_KEY, theme)
  document.documentElement.dataset.theme = theme
}

export function initTheme(): void {
  if (!browser) return

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  const initial = THEMES.some((theme) => theme.value === stored)
    ? (stored as ThemeName)
    : DEFAULT_THEME
  setTheme(initial)
}
