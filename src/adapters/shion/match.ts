import axios from "axios";


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

export const fetchMatch = async (matchId: number): Promise<Match> => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_SHION_API_BASE_URL}/matches/${matchId}`);
        return {
            id: response.data.id,
            serverIp: response.data.server_ip,
            matchDate: new Date(response.data.match_date),
            mapName: response.data.map_name,
            matchDetails: response.data.match_details.map((player: any) => ({
                playerId: player.player_id,
                playerSteamName: player.steam_name,
                playerSteamID: player.steam_id, 
                playerAvatarUrl: player.steam_avatar_url,
                frags: player.frags,
                deaths: player.deaths,
                averagePing: player.average_ping,
                damageDealt: player.damage_dealt,
                damageTaken: player.damage_taken,
                model: player.model,
                ratingDelta: Math.round(player.rating_delta),
            })),
        };
    } catch (error) {
        console.error("Error fetching match:", error);
        throw error;
    }
}