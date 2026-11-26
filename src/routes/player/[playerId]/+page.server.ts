import type {
  PageResult,
  PlayerDto,
  PlayerMatchDto,
  RatingHistoryDto,
  SeasonDto,
} from "#lib/api/types.js"
import { shion } from "#lib/server/shion.js"
import type { PageServerLoad } from "./$types"

const MATCHES_PAGE_SIZE = 10

export const load: PageServerLoad = async ({ params, url, parent }) => {
  const { user } = await parent()
  const id = Number(params.playerId)
  const invalidId = !Number.isInteger(id) || id <= 0

  let seasons: SeasonDto[] = []
  try {
    seasons = await shion<SeasonDto[]>("/seasons")
  } catch {
    seasons = []
  }

  const active = seasons.find((season) => season.is_active)
  const seasonParam = url.searchParams.get("season")
  const season = seasonParam ? Number(seasonParam) : active?.id
  const matchesPage = Math.max(Number(url.searchParams.get("page") ?? "1") || 1, 1)

  if (invalidId) {
    return {
      user,
      id,
      seasons,
      season,
      player: null,
      history: [] as RatingHistoryDto[],
      matches: null,
      matchesPage,
      matchesPageSize: MATCHES_PAGE_SIZE,
      error: null,
      invalidId,
    }
  }

  try {
    const [player, history, matches] = await Promise.all([
      shion<PlayerDto>(`/players/${id}`, { params: { season } }),
      shion<RatingHistoryDto[]>(`/players/${id}/points_history`, { params: { season } }),
      shion<PageResult<PlayerMatchDto>>(`/players/${id}/matches`, {
        params: {
          index: matchesPage,
          size: MATCHES_PAGE_SIZE,
          season,
        },
      }),
    ])

    return {
      user,
      id,
      seasons,
      season,
      player,
      history,
      matches,
      matchesPage,
      matchesPageSize: MATCHES_PAGE_SIZE,
      error: null,
      invalidId,
    }
  } catch (error) {
    return {
      user,
      id,
      seasons,
      season,
      player: null,
      history: [] as RatingHistoryDto[],
      matches: null,
      matchesPage,
      matchesPageSize: MATCHES_PAGE_SIZE,
      error: error instanceof Error ? error.message : "Failed to load player",
      invalidId,
    }
  }
}
