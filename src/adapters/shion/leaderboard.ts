import axios from "axios";

export interface LeaderboardPlayer {
    id: number;
    player: string;
    steamID: string;
    avatarURL: string;
    rating: number;
    matches: number;
    winRate: number;
}

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_SHION_API_BASE_URL,
})

export const fetchLeaderboard = async (page: number, limit: number): Promise<LeaderboardPlayer[]> => {
    try {
        const response = await apiInstance.get('/players/leaderboard', {
            params: {
                page: page,
                limit: limit,
            }
        });

        return response.data.map((player: any) => ({
            id: player.id,
            player: player.steam_name ? player.steam_name : "Unknown Player",
            steamID: player.steam_id,
            avatarURL: player.steam_avatar_url,
            rating: Math.round(player.rating),
            matches: 0,
            winRate: 0,
        }))
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
}