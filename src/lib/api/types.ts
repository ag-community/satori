export interface StatsDto {
  player_id: number;
  rating: number;
  uncertainty: number;
  wins: number;
  losses: number;
  total_frags: number;
  total_deaths: number;
}

export interface PlayerDto {
  id: number;
  steam_id: string;
  steam_name: string;
  steam_avatar_url: string;
  country: string;
  stats: StatsDto | null;
  global_rank: number | null;
  country_rank: number | null;
}

export interface PageResult<T> {
  records: T[];
  current: number;
  size: number;
  total: number;
}

export interface RatingHistoryDto {
  captured_at: string;
  rating: number;
}

export interface PlayerMatchDto {
  id: number;
  server_ip: string;
  map_name: string;
  date: string;
  frags: number;
  deaths: number;
  rating_after_match: number;
  rating_delta: number;
}

export type SortBy = 'Rating' | 'WinRate' | 'Matches';

export interface GameDetailPlayerDto {
  player_id: number;
  steam_name: string;
  steam_id: string;
  steam_avatar_url: string;
  frags: number;
  deaths: number;
  average_ping: number;
  damage_dealt: number;
  damage_taken: number;
  model: 'BLUE' | 'RED';
  rating_after_match: number;
  rating_delta: number;
}

export interface GameDetailTeam {
  players: GameDetailPlayerDto[];
}

export interface GameDto {
  id: number;
  server_ip: string;
  map_name: string;
  match_type: string;
  date: string;
  details: {
    teams: GameDetailTeam[];
  };
}
