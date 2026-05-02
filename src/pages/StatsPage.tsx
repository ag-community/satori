import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchHourlyActivity,
  fetchMatchesPerDay,
  fetchPlayerCountries,
  fetchPopularMaps,
  fetchStatsOverview,
  type HourlyActivity,
  type MatchesPerDay,
  type PlayerCountry,
  type PopularMap,
  type StatsOverview,
} from '../adapters/shion/stats';
import { CardSection } from '../components/CardSection';
import { HourlyActivityChart } from '../components/stats/HourlyActivityChart';
import { MatchesPerDayChart } from '../components/stats/MatchesPerDayChart';
import { PlayerCountriesTable } from '../components/stats/PlayerCountriesTable';
import { PopularMapsChart } from '../components/stats/PopularMapsChart';
import { StatCard } from '../components/stats/StatCard';

export const StatsPage = () => {
  const { t } = useTranslation();

  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [matchesPerDay, setMatchesPerDay] = useState<MatchesPerDay[]>([]);
  const [popularMaps, setPopularMaps] = useState<PopularMap[]>([]);
  const [hourlyActivity, setHourlyActivity] = useState<HourlyActivity[]>([]);
  const [playerCountries, setPlayerCountries] = useState<PlayerCountry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = t('title.stats');
  }, [t]);

  useEffect(() => {
    (async () => {
      try {
        const [ov, mpd, pm, ha, pc] = await Promise.all([
          fetchStatsOverview(),
          fetchMatchesPerDay(30),
          fetchPopularMaps(10),
          fetchHourlyActivity(),
          fetchPlayerCountries(),
        ]);
        setOverview(ov);
        setMatchesPerDay(mpd);
        setPopularMaps(pm);
        setHourlyActivity(ha);
        setPlayerCountries(pc);
      } catch {
        setError(t('common.loading'));
      }
    })();
  }, [t]);

  const overviewCards = overview
    ? [
        {
          label: t('stats.total_players'),
          value: overview.totalPlayers.toLocaleString(),
          icon: <PeopleAltIcon color="secondary" />,
        },
        {
          label: t('stats.total_matches'),
          value: overview.totalMatches.toLocaleString(),
          icon: <SportsEsportsIcon color="secondary" />,
        },
        {
          label: t('stats.total_frags'),
          value: overview.totalFrags.toLocaleString(),
          icon: <EmojiEventsIcon color="secondary" />,
        },
        {
          label: t('stats.total_deaths'),
          value: overview.totalDeaths.toLocaleString(),
          icon: <BarChartIcon color="secondary" />,
        },
      ]
    : [];

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', py: 4, px: 2 }}>
      <CardSection>
        <Box display="flex" alignItems="center" mb={3}>
          <BarChartIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700}>
            {t('stats.title')}
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }}
          gap={2}
          mb={3}
        >
          {overviewCards.map((card) => (
            <StatCard
              key={card.label}
              icon={card.icon}
              value={card.value}
              label={card.label}
            />
          ))}
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={3}
        >
          <MatchesPerDayChart data={matchesPerDay} />
          <PopularMapsChart data={popularMaps} />
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={3}
          mt={3}
        >
          <HourlyActivityChart data={hourlyActivity} />
          <PlayerCountriesTable data={playerCountries} />
        </Box>
      </CardSection>
    </Box>
  );
};
