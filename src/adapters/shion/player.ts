import axios from "axios";

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
  baseURL: process.env.REACT_APP_SHION_API_BASE_URL,
})

export const fetchPlayer = async (playerId: number): Promise<Player> => {
    try {
        const response = await apiInstance.get(`/players/${playerId}`);
        return {
            id: response.data.id,
            steamID: response.data.steam_id,
            steamName: response.data.steam_name ? response.data.steam_name : "Unknown Player",
            avatarURL: response.data.steam_avatar_url,
            playerStats: {
                rating: Math.round(response.data.stats.rating),
                wins: response.data.stats.wins,
                losses: response.data.stats.losses,
                totalFrags: response.data.stats.total_frags,
                totalDeaths: response.data.stats.total_deaths,
            }
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

export const fetchPlayerRatingHistory = async (playerId: number): Promise<PlayerHistory> => {
    try {
        const response = await apiInstance.get(`/players/${playerId}/rating_history`);

        return {
            captures: response.data.captures.map((capture: any) => ({
                capturedAt: new Date(capture.captured_at),
                rating: Math.round(capture.rating),
            }))
        };
    } catch (error) {
        console.error("Error fetching player rating history:", error);
        throw error;
    }
}