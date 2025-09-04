import axios from 'axios';

export interface LeaderboardPlayer {
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

const apiInstance = axios.create({
  baseURL: process.env.PUBLIC_APP_SHION_API_BASE_URL,
});

export const fetchLeaderboard = async (
  page: number,
  limit: number,
): Promise<LeaderboardPlayer[]> => {
  try {
    const response = await apiInstance.get('/players/leaderboard', {
      params: {
        page: page,
        limit: limit,
      },
    });

    return response.data.map((player: any) => ({
      id: player.id,
      steamID: player.steam_id,
      steamName: player.steam_name ? player.steam_name : 'Unknown Player',
      avatarURL: player.steam_avatar_url,
      playerStats: {
        rating: Math.round(player.stats.rating),
        wins: player.stats.wins,
        losses: player.stats.losses,
        totalFrags: player.stats.total_frags,
        totalDeaths: player.stats.total_deaths,
      },
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};
