import type { SeasonDto, StatsOverviewDto } from "#lib/api/types.js"
import { shion } from "#lib/server/shion.js"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ url }) => {
  let seasons: SeasonDto[] = []
  try {
    seasons = await shion<SeasonDto[]>("/seasons")
  } catch {
    seasons = []
  }

  const active = seasons.find((season) => season.is_active)
  const seasonParam = url.searchParams.get("season")
  const season = seasonParam ? Number(seasonParam) : active?.id

  try {
    const stats = await shion<StatsOverviewDto>("/stats", { params: { season } })
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
