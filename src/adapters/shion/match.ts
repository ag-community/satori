import axios from 'axios';

export interface Match {
  id: number;
  serverIp: string;
  matchDate: Date;
  mapName: string;
  matchDetails: MatchDetails[];
}

export interface MatchDetails {
  playerId: number;
  playerSteamName: string;
  playerSteamID: string;
  playerAvatarUrl: string;
  frags: number;
  deaths: number;
  averagePing: number;
  damageDealt: number;
  damageTaken: number;
  model: string;
  ratingDelta: number;
}

const apiInstance = axios.create({
  baseURL: process.env.PUBLIC_APP_SHION_API_BASE_URL,
});

export const fetchMatch = async (matchId: number): Promise<Match> => {
  try {
    const response = await apiInstance.get(`/matches/${matchId}`);
    return {
      id: response.data.id,
      serverIp: response.data.server_ip,
      matchDate: new Date(response.data.match_date),
      mapName: response.data.map_name,
      matchDetails: response.data.match_details.map((details: any) => ({
        playerId: details.player_id,
        playerSteamName: details.steam_name,
        playerSteamID: details.steam_id,
        playerAvatarUrl: details.steam_avatar_url,
        frags: details.frags,
        deaths: details.deaths,
        averagePing: details.average_ping,
        damageDealt: details.damage_dealt,
        damageTaken: details.damage_taken,
        model: details.model,
        ratingDelta: Math.round(details.rating_delta),
      })),
    };
  } catch (error) {
    console.error('Error fetching match:', error);
    throw error;
  }
};
