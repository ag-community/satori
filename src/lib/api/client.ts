import { apiGet } from '@/lib/api/http';
import type {
  GameDto,
  PageResult,
  PlayerDto,
  PlayerMatchDto,
  RatingHistoryDto,
  SeasonDto,
  SortBy,
} from '@/lib/api/types';

export const api = {
  fetchSeasons: () => apiGet<SeasonDto[]>('/seasons'),

  fetchPlayer: (playerId: number, season?: number) =>
    apiGet<PlayerDto>(`/players/${playerId}`, { season }),

  fetchPointsHistory: (playerId: number, season?: number) =>
    apiGet<RatingHistoryDto[]>(`/players/${playerId}/points_history`, {
      season,
    }),

  fetchPlayerMatches: (
    playerId: number,
    index = 1,
    size = 10,
    season?: number,
  ) =>
    apiGet<PageResult<PlayerMatchDto>>(`/players/${playerId}/matches`, {
      index,
      size,
      season,
    }),

  searchPlayers: (value: string, limit = 10) =>
    apiGet<PlayerDto[]>('/players/search', { value, limit }),

  fetchLeaderboard: (
    options: {
      index?: number;
      size?: number;
      sortBy?: SortBy;
      country?: string;
      season?: number;
    } = {},
  ) =>
    apiGet<PageResult<PlayerDto>>('/players/leaderboard', {
      index: options.index,
      size: options.size,
      sort_by: options.sortBy,
      country: options.country,
      season: options.season,
    }),

  fetchGame: (gameId: number) => apiGet<GameDto>(`/games/${gameId}`),
};
