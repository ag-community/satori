import { shion } from "#lib/server/shion/client.js"
import type { StatsOverviewDto } from "#lib/types.js"

export function fetchStatsOverview(season?: number): Promise<StatsOverviewDto> {
  return shion<StatsOverviewDto>("/stats", { params: { season } })
}
