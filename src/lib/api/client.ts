import { apiGet } from '@/lib/api/http';
import type {
  GameDto,
  PageResult,
  PlayerDto,
  PlayerMatchDto,
  RatingHistoryDto,
  SortBy,
} from '@/lib/api/types';

export const api = {
  fetchPlayer: (playerId: number) => apiGet<PlayerDto>(`/players/${playerId}`),

  fetchRatingHistory: (playerId: number) =>
    apiGet<RatingHistoryDto[]>(`/players/${playerId}/rating_history`),

  fetchPlayerMatches: (playerId: number, index = 1, size = 10) =>
    apiGet<PageResult<PlayerMatchDto>>(`/players/${playerId}/matches`, {
      index,
      size,
    }),

  searchPlayers: (value: string, limit = 10) =>
    apiGet<PlayerDto[]>('/players/search', { value, limit }),

  fetchLeaderboard: (
    options: {
      index?: number;
      size?: number;
      sortBy?: SortBy;
      country?: string;
    } = {},
  ) =>
    apiGet<PageResult<PlayerDto>>('/players/leaderboard', {
      index: options.index,
      size: options.size,
      sort_by: options.sortBy,
      country: options.country,
    }),

  fetchGame: (gameId: number) => apiGet<GameDto>(`/games/${gameId}`),
};
