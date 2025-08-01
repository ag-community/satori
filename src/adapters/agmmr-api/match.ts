import axios from "axios";


export interface Match {
  id: number;
  serverIp: string;
  matchDate: Date;
  mapName: string;
  matchDetails: MatchDetails[];
  isInvalidMatch: boolean;
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
  mmrDelta: number;
}

export const fetchMatch = async (matchId: number): Promise<Match> => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_AGMMR_API_BASE_URL}/matches/${matchId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching match:", error);
        throw error;
    }
}