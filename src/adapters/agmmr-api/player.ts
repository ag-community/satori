import axios from "axios";

export interface Player {
    id: number;
    steamID: string;
    steamName: string;
    avatarURL: string;
    mmr: number;
    matchHistory: Match[];
}

export interface Match {
    matchId: number;
    serverIp: string;
    matchDate: string;
    mapName: string;
    stats: MatchStats;
    mmrAfterMatch: number;
    mmrDelta: number;
}

export interface MatchStats {
    frags: number;
    deaths: number;
    averagePing: number;
    damageDealt: number;
    damageTaken: number;
    model: string;
}

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_AGMMR_API_BASE_URL,
})

export const fetchPlayer = async (playerId: number): Promise<Player> => {
    try {
        const response = await apiInstance.get(`/players/${playerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching player data:", error);
        throw error;
    }
}