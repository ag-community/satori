import { fetchLeaderboard } from "#lib/server/shion/players.js"
import { fetchSeasons } from "#lib/server/shion/seasons.js"
import type { SeasonDto } from "#lib/types.js"
import type { PageServerLoad } from "./$types"

const SORTS = ["Points", "WinRate", "Matches"] as const
type Sort = (typeof SORTS)[number]

function parseSort(value: string | null): Sort {
  return SORTS.includes(value as Sort) ? (value as Sort) : "Points"
}

export const load: PageServerLoad = async ({ url }) => {
  const sort = parseSort(url.searchParams.get("sort"))
  const country = url.searchParams.get("country") ?? "all"
  const page = Math.max(Number(url.searchParams.get("page") ?? "1") || 1, 1)
  const size = Math.max(Number(url.searchParams.get("size") ?? "50") || 50, 1)
  const seasonParam = url.searchParams.get("season")

  let seasons: SeasonDto[] = []
  try {
    seasons = await fetchSeasons()
  } catch {
    seasons = []
  }

  const active = seasons.find((season) => season.is_active)
  const season = seasonParam ? Number(seasonParam) : active?.id

  try {
    const data = await fetchLeaderboard({
      index: page,
      size,
      sortBy: sort,
      country: country === "all" ? undefined : country,
      season,
    })
    return { sort, country, page, size, season, seasons, data, error: null }
  } catch (error) {
    return {
      sort,
      country,
      page,
      size,
      season,
      seasons,
      data: null,
      error: error instanceof Error ? error.message : "Failed to load leaderboard",
    }
  }
}
