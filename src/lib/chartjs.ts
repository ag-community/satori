import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js"
import { SKINS } from "#lib/theme/skins.js"

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
)

export interface ChartColors {
  text: string
  grid: string
  primary: string
}

function withAlpha(color: string, alpha: number): string {
  const value = color.trim()

  if (value.startsWith("#")) {
    const hex = value.slice(1)
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => `${char}${char}`)
            .join("")
        : hex
    const red = Number.parseInt(full.slice(0, 2), 16)
    const green = Number.parseInt(full.slice(2, 4), 16)
    const blue = Number.parseInt(full.slice(4, 6), 16)
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }

  if (value.startsWith("rgb(")) {
    return value.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
  }

  return value
}

const defaultSkin = SKINS.greensteam

export const DEFAULT_CHART_COLORS: ChartColors = {
  text: defaultSkin.text,
  grid: withAlpha(defaultSkin.text, 0.28),
  primary: defaultSkin.gold,
}

export function resolveChartColors(): ChartColors {
  if (typeof document === "undefined") return DEFAULT_CHART_COLORS

  const styles = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string): string =>
    styles.getPropertyValue(name).trim() || fallback

  const text = read("--skin-text", DEFAULT_CHART_COLORS.text)

  return {
    text,
    grid: withAlpha(text, 0.28),
    primary: read("--skin-gold", DEFAULT_CHART_COLORS.primary),
  }
}
