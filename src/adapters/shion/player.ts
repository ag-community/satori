import axios from 'axios';

export interface Player {
  id: number;
  steamID: string;
  steamName: string;
  avatarURL: string;
  playerStats: PlayerStats;
}

export interface PlayerStats {
  rating: number;
  wins: number;
  losses: number;
  totalFrags: number;
  totalDeaths: number;
}

export interface Match {
  matchId: number;
  serverIp: string;
  matchDate: string;
  mapName: string;
  frags: number;
  deaths: number;
  ratingAfterMatch: number;
  ratingDelta: number;
}

export interface PlayerHistory {
  captures: PlayerHistoryCapture[];
}

export interface PlayerHistoryCapture {
  capturedAt: Date;
  rating: number;
}

const apiInstance = axios.create({
  baseURL: process.env.PUBLIC_APP_SHION_API_BASE_URL,
});

export const fetchPlayer = async (playerId: number): Promise<Player> => {
  try {
    const response = await apiInstance.get(`/players/${playerId}`);
    return {
      id: response.data.id,
      steamID: response.data.steam_id,
      steamName: response.data.steam_name
        ? response.data.steam_name
        : 'Unknown Player',
      avatarURL: response.data.steam_avatar_url,
      playerStats: {
        rating: Math.round(response.data.stats.rating),
        wins: response.data.stats.wins,
        losses: response.data.stats.losses,
        totalFrags: response.data.stats.total_frags,
        totalDeaths: response.data.stats.total_deaths,
      },
    };
  } catch (error) {
    console.error('Error fetching player data:', error);
    throw error;
  }
};

export const fetchPlayerMatches = async (
  playerId: number,
  page: number = 1,
  limit: number = 10,
): Promise<Match[]> => {
  try {
    const response = await apiInstance.get(`/players/${playerId}/matches`, {
      params: {
        page: page,
        limit: limit,
      },
    });

    return response.data.map((match: any) => ({
      matchId: match.id,
      serverIp: match.server_ip,
      matchDate: match.match_date,
      mapName: match.map_name,
      frags: match.match_details.find(
        (detail: any) => detail.player_id === playerId,
      )?.frags,
      deaths: match.match_details.find(
        (detail: any) => detail.player_id === playerId,
      )?.deaths,
      ratingAfterMatch: Math.floor(
        match.match_details.find((detail: any) => detail.player_id === playerId)
          ?.rating_after_match,
      ),
      ratingDelta: Math.round(
        match.match_details.find((detail: any) => detail.player_id === playerId)
          ?.rating_delta,
      ),
    }));
  } catch (error) {
    console.error('Error fetching player matches:', error);
    throw error;
  }
};

export const fetchPlayerRatingHistory = async (
  playerId: number,
): Promise<PlayerHistory> => {
  try {
    const response = await apiInstance.get(
      `/players/${playerId}/rating_history`,
    );

    return {
      captures: response.data.captures.map((capture: any) => ({
        capturedAt: new Date(capture.captured_at),
        rating: Math.round(capture.rating),
      })),
    };
  } catch (error) {
    console.error('Error fetching player rating history:', error);
    throw error;
  }
};
