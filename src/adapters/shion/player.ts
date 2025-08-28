import axios from "axios";

export interface Player {
    id: number;
    steamID: string;
    steamName: string;
    avatarURL: string;
    rating: number;
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

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_SHION_API_BASE_URL,
})

export const fetchPlayer = async (playerId: number): Promise<Player> => {
    try {
        const response = await apiInstance.get(`/players/${playerId}`);
        return {
            id: response.data.id,
            steamID: response.data.steam_id,
            steamName: response.data.steam_name,
            avatarURL: response.data.steam_avatar_url,
            rating: Math.round(response.data.rating),
        };
    } catch (error) {
        console.error("Error fetching player data:", error);
        throw error;
    }
}

export const fetchPlayerMatches = async (playerId: number, page: number = 1, limit: number = 10): Promise<Match[]> => {
    try {
        const response = await apiInstance.get(`/players/${playerId}/matches`, {
            params: {
                page: page,
                limit: limit,
            }
        });
        
        return response.data.map((player: any) => ({
            matchId: player.id,
            serverIp: player.server_ip,
            matchDate: player.match_date,
            mapName: player.map_name,
            frags: player.match_details.find((detail: any) => detail.player_id === playerId)?.frags,
            deaths: player.match_details.find((detail: any) => detail.player_id === playerId)?.deaths,
            ratingAfterMatch: Math.round(player.rating_after_match),
            ratingDelta: Math.round(player.rating_delta),
        }));
    } catch (error) {
        console.error("Error fetching player matches:", error);
        throw error;
    }
}