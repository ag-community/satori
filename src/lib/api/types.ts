export interface StatsDto {
  player_id: number;
  rating: number;
  uncertainty: number;
  points: number;
  wins: number;
  losses: number;
  total_frags: number;
  total_deaths: number;
  num_games: number;
}

export interface SeasonDto {
  id: number;
  name: string;
  start_date: string;
  is_active: boolean;
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
  points: number;
}

export interface PlayerMatchDto {
  id: number;
  server_ip: string;
  map_name: string;
  date: string;
  frags: number;
  deaths: number;
  points_after_match: number;
  points_delta: number;
  won: boolean;
  unranked: boolean;
}

export type SortBy = 'Points' | 'WinRate' | 'Matches';

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
  points_after_match: number;
  points_delta: number;
  won: boolean;
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
  unranked: boolean;
  details: {
    teams: GameDetailTeam[];
  };
}
