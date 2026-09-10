import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { MatchHistory } from '@/components/MatchHistory';
import { PointsChart } from '@/components/PointsChart';
import { SeasonSelector } from '@/components/SeasonSelector';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Flag } from '@/components/ui/Flag';
import { SortableSections } from '@/components/ui/SortableSections';
import { StatCard } from '@/components/ui/StatCard';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/ViewStates';
import { api } from '@/lib/api/client';
import { getCountryName } from '@/lib/countries';
import { formatPercent, formatRating } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';

const SECTION_ORDER = [
  'points_progression',
  'statistics',
  'match_history',
] as const;
type SectionId = (typeof SECTION_ORDER)[number];

export function PlayerPage() {
  const { t, i18n } = useTranslation();
  const { playerId } = useParams();
  const id = parseInt(playerId ?? '', 10);
  const valid = !Number.isNaN(id) && id > 0;

  const [season, setSeason] = useState<number | undefined>(undefined);

  const { data: seasons } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => api.fetchSeasons(),
    enabled: valid,
  });

  const activeSeason = seasons?.find((s) => s.is_active);
  const resolvedSeason = season ?? activeSeason?.id;

  const {
    data: player,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['player', id, resolvedSeason],
    queryFn: () => api.fetchPlayer(id, resolvedSeason),
    enabled: valid && resolvedSeason !== undefined,
  });

  const { data: history } = useQuery({
    queryKey: ['player-points-history', id, resolvedSeason],
    queryFn: () => api.fetchPointsHistory(id, resolvedSeason),
    enabled: valid && resolvedSeason !== undefined,
  });

  usePageTitle(
    player ? t('title.player', { playerName: player.steam_name }) : undefined,
  );

  if (!valid) {
    return (
      <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
        {t('player.must_provide_id')}
      </Typography>
    );
  }

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!player) return <EmptyState label={t('player.not_found')} />;

  const stats = player.stats;
  const matches = (stats?.wins ?? 0) + (stats?.losses ?? 0);
  const kd =
    (stats?.total_deaths ?? 0) > 0
      ? ((stats?.total_frags ?? 0) / (stats?.total_deaths ?? 1)).toFixed(2)
      : (stats?.total_frags ?? 0).toFixed(2);
  const avgFrags =
    matches > 0 ? ((stats?.total_frags ?? 0) / matches).toFixed(2) : '0';

  const sections: Record<SectionId, { title: string; body: ReactNode }> = {
    points_progression: {
      title: t('player.points_progression'),
      body: history ? (
        <PointsChart history={history} />
      ) : (
        <p>{t('player.no_points_data')}</p>
      ),
    },
    statistics: {
      title: t('player.statistics'),
      body: (
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              label={t('player.matches_played')}
              value={String(matches)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              label={t('player.wins')}
              value={String(stats?.wins ?? 0)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              label={t('player.losses')}
              value={String(stats?.losses ?? 0)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              label={t('player.win_rate')}
              value={formatPercent(stats?.wins ?? 0, matches)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              label={t('player.total_frags')}
              value={String(stats?.total_frags ?? 0)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              label={t('player.total_deaths')}
              value={String(stats?.total_deaths ?? 0)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard label={t('player.kd_ratio')} value={kd} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              label={t('player.avg_frags_per_match')}
              value={avgFrags}
            />
          </Grid>
        </Grid>
      ),
    },
    match_history: {
      title: t('player.match_history'),
      body: <MatchHistory playerId={id} seasonId={resolvedSeason} />,
    },
  };

  return (
    <div>
      <Card>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Avatar
            url={player.steam_avatar_url}
            alt={player.steam_name}
            size={64}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ m: 0, fontWeight: 700 }}
            >
              {player.steam_name}
            </Typography>
            <Typography variant="body1" component="p" sx={{ m: 0 }}>
              {t('player.steam_id')} <b>{player.steam_id}</b>{' '}
              <Flag countryCode={player.country} />
            </Typography>
            <Typography variant="body1" component="p" sx={{ m: 0 }}>
              {t('leaderboard.points')}: <b>{formatRating(stats?.points)}</b>
              {player.global_rank && (
                <span style={{ marginLeft: 12 }}>
                  #{player.global_rank} {t('player.global_rank')}
                </span>
              )}
              {player.country_rank && (
                <span style={{ marginLeft: 12 }}>
                  #{player.country_rank}{' '}
                  {getCountryName(player.country, i18n.language)}
                </span>
              )}
            </Typography>
          </Box>
          {resolvedSeason !== undefined && (
            <Box sx={{ ml: 'auto' }}>
              <SeasonSelector value={resolvedSeason} onChange={setSeason} />
            </Box>
          )}
        </Box>
      </Card>

      <SortableSections sections={sections} initialOrder={SECTION_ORDER} />
    </div>
  );
}
