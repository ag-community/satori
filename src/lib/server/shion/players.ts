import { shion } from "#lib/server/shion/client.js"
import type {
  PageResult,
  PlayerDto,
  PlayerMatchDto,
  ProfileDto,
  RatingHistoryDto,
  UpdateProfileInput,
} from "#lib/types.js"

export function fetchPlayer(id: number, season?: number): Promise<PlayerDto> {
  return shion<PlayerDto>(`/players/${id}`, { params: { season } })
}

export function fetchLeaderboard(options: {
  index?: number
  size: number
  sortBy: string
  country?: string
  season?: number
}): Promise<PageResult<PlayerDto>> {
  return shion<PageResult<PlayerDto>>("/players/leaderboard", {
    params: {
      index: options.index,
      size: options.size,
      sort_by: options.sortBy,
      country: options.country,
      season: options.season,
    },
  })
}

export function searchPlayers(value: string, limit = 8): Promise<PlayerDto[]> {
  return shion<PlayerDto[]>("/players/search", { params: { value, limit } })
}

export function fetchRatingHistory(id: number, season?: number): Promise<RatingHistoryDto[]> {
  return shion<RatingHistoryDto[]>(`/players/${id}/points_history`, { params: { season } })
}

export function fetchPlayerMatches(
  id: number,
  options: { index: number; size: number; season?: number }
): Promise<PageResult<PlayerMatchDto>> {
  return shion<PageResult<PlayerMatchDto>>(`/players/${id}/matches`, {
    params: {
      index: options.index,
      size: options.size,
      season: options.season,
    },
  })
}

export function updateProfile(
  id: number,
  body: UpdateProfileInput,
  token: string
): Promise<ProfileDto> {
  return shion<ProfileDto>(`/players/${id}/profile`, { method: "PUT", body, token })
}
