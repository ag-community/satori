export interface StatsDto {
  player_id: number
  rating: number
  uncertainty: number
  points: number
  wins: number
  losses: number
  total_frags: number
  total_deaths: number
  num_games: number
}

export interface SeasonDto {
  id: number
  name: string
  start_date: string
  is_active: boolean
}

export interface ProfileDto {
  bio: string
  twitter_handle: string | null
  twitch_handle: string | null
  youtube_handle: string | null
  discord_handle: string | null
  website_url: string | null
  updated_at: string
}

export interface PlayerDto {
  id: number
  steam_id: string
  steam_name: string
  steam_avatar_url: string
  country: string
  stats: StatsDto | null
  global_rank: number | null
  country_rank: number | null
  profile: ProfileDto | null
}

export interface AuthUserDto {
  id: number
  steam_id: string
  steam_name: string
  steam_avatar_url: string
  country: string
}

export interface AuthSessionDto {
  token: string
  expires_at: string
  player: AuthUserDto
}

export interface RatingHistoryDto {
  captured_at: string
  points: number
}

export interface PlayerMatchDto {
  id: number
  server_ip: string
  map_name: string
  date: string
  frags: number
  deaths: number
  points_after_match: number
  points_delta: number
  won: boolean
  unranked: boolean
}

export interface GameDetailPlayerDto {
  player_id: number
  steam_name: string
  steam_id: string
  steam_avatar_url: string
  frags: number
  deaths: number
  average_ping: number
  damage_dealt: number
  damage_taken: number
  model: "BLUE" | "RED"
  points_after_match: number
  points_delta: number
  won: boolean
}

export interface GameDetailTeam {
  players: GameDetailPlayerDto[]
}

export interface GameDto {
  id: number
  server_ip: string
  map_name: string
  match_type: string
  date: string
  unranked: boolean
  details: {
    teams: GameDetailTeam[]
  }
}

export interface StatsSummaryDto {
  total_players: number
  ranked_players: number
  ranked_games: number
  total_frags: number
  total_deaths: number
  average_frags: number
  maps_played: number
}

export interface StatsMapDto {
  map_name: string
  games: number
  average_frags: number
}

export interface StatsCountryDto {
  country: string
  players: number
  ranked_players: number
  average_points: number
}

export interface StatsActivityDto {
  month: string
  games: number
  frags: number
}

export interface StatsPointsBucketDto {
  label: string
  players: number
}

export interface StatsWeekdayDto {
  day: number
  games: number
}

export interface StatsBestFragDto {
  game_id: number
  map_name: string
  date: string
  player_id: number
  steam_name: string
  steam_avatar_url: string
  country: string
  frags: number
}

export interface StatsOverviewDto {
  season_id: number
  summary: StatsSummaryDto
  maps: StatsMapDto[]
  countries: StatsCountryDto[]
  activity: StatsActivityDto[]
  points_distribution: StatsPointsBucketDto[]
  weekdays: StatsWeekdayDto[]
  best_frag_game: StatsBestFragDto | null
}

export interface PageResult<T> {
  records: T[]
  current: number
  size: number
  total: number
}

export type SortBy = "Points" | "WinRate" | "Matches"
