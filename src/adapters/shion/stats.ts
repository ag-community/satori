import axios from 'axios';

export interface StatsOverview {
  totalPlayers: number;
  totalMatches: number;
  totalFrags: number;
  totalDeaths: number;
}

export interface MatchesPerDay {
  date: string;
  count: number;
}

export interface PopularMap {
  mapName: string;
  count: number;
}

export interface HourlyActivity {
  hour: number;
  count: number;
}

export interface PlayerCountry {
  country: string;
  count: number;
}

const apiInstance = axios.create({
  baseURL: process.env.PUBLIC_APP_SHION_API_BASE_URL,
});

export const fetchStatsOverview = async (): Promise<StatsOverview> => {
  try {
    const response = await apiInstance.get('/stats/overview');
    return {
      totalPlayers: response.data.total_players,
      totalMatches: response.data.total_matches,
      totalFrags: response.data.total_frags,
      totalDeaths: response.data.total_deaths,
    };
  } catch (error) {
    console.error('Error fetching stats overview:', error);
    throw error;
  }
};

export const fetchMatchesPerDay = async (
  days: number = 30,
): Promise<MatchesPerDay[]> => {
  try {
    const response = await apiInstance.get('/stats/matches-per-day', {
      params: { days },
    });
    return response.data.map((item: any) => ({
      date: item.date,
      count: item.count,
    }));
  } catch (error) {
    console.error('Error fetching matches per day:', error);
    throw error;
  }
};

export const fetchPopularMaps = async (
  limit: number = 10,
): Promise<PopularMap[]> => {
  try {
    const response = await apiInstance.get('/stats/popular-maps', {
      params: { limit },
    });
    return response.data.map((item: any) => ({
      mapName: item.map_name,
      count: item.count,
    }));
  } catch (error) {
    console.error('Error fetching popular maps:', error);
    throw error;
  }
};

export const fetchHourlyActivity = async (): Promise<HourlyActivity[]> => {
  try {
    const response = await apiInstance.get('/stats/hourly-activity');
    return response.data.map((item: any) => ({
      hour: item.hour,
      count: item.count,
    }));
  } catch (error) {
    console.error('Error fetching hourly activity:', error);
    throw error;
  }
};

export const fetchPlayerCountries = async (): Promise<PlayerCountry[]> => {
  try {
    const response = await apiInstance.get('/stats/player-countries');
    return response.data.map((item: any) => ({
      country: item.country,
      count: item.count,
    }));
  } catch (error) {
    console.error('Error fetching player countries:', error);
    throw error;
  }
};
