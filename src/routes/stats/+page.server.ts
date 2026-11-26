import { fetchSeasons } from "#lib/server/shion/seasons.js"
import { fetchStatsOverview } from "#lib/server/shion/stats.js"
import type { SeasonDto } from "#lib/types.js"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ url }) => {
  let seasons: SeasonDto[] = []
  try {
    seasons = await fetchSeasons()
  } catch {
    seasons = []
  }

  const active = seasons.find((season) => season.is_active)
  const seasonParam = url.searchParams.get("season")
  const season = seasonParam ? Number(seasonParam) : active?.id

  try {
    const stats = await fetchStatsOverview(season)
    return { seasons, season, stats, error: null }
  } catch (error) {
    return {
      seasons,
      season,
      stats: null,
      error: error instanceof Error ? error.message : "Failed to load stats",
    }
  }
}
