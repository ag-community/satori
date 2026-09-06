import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { MatchTeam } from '@/components/MatchTeam';
import { Card } from '@/components/ui/Card';
import { ErrorState, LoadingState } from '@/components/ui/ViewStates';
import { api } from '@/lib/api/client';
import { formatDate } from '@/lib/format';
import { BLACKLISTED_MAPS } from '@/lib/maps';
import { usePageTitle } from '@/lib/usePageTitle';

export function GamePage() {
  const { t } = useTranslation();
  const { gameId } = useParams();
  const id = parseInt(gameId ?? '', 10);
  const valid = !Number.isNaN(id) && id > 0;

  const {
    data: game,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['game', id],
    queryFn: () => api.fetchGame(id),
    enabled: valid,
  });

  usePageTitle(game ? t('title.match', { matchId: game.id }) : undefined);

  if (!valid) {
    return (
      <Card>
        <Typography sx={{ m: 0 }}>{t('match.must_provide_id')}</Typography>
      </Card>
    );
  }

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!game) return null;

  const teams = game.details.teams;
  const blue = teams[0]?.players ?? [];
  const red = teams[1]?.players ?? [];

  const blueFrags = blue.reduce((sum, p) => sum + p.frags, 0);
  const redFrags = red.reduce((sum, p) => sum + p.frags, 0);
  const blueWins = blueFrags > redFrags;
  const redWins = redFrags > blueFrags;

  const bannerUrl = `/images/map_banners/${game.map_name}.jpg`;

  return (
    <div>
      <Card>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: 72, sm: 100 },
            px: { xs: 1.25, sm: 2 },
            py: { xs: 1.25, sm: 2 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${bannerUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.25,
              pointerEvents: 'none',
            }}
          />
          <Box sx={{ position: 'relative' }}>
            <Typography
              component="h2"
              variant="h5"
              sx={{ m: 0, fontWeight: 700 }}
            >
              {t('match.match_on', {
                matchType: game.match_type,
                mapName: game.map_name,
              })}
            </Typography>
            <Typography
              component="p"
              sx={{ m: '4px 0 0', color: 'text.secondary' }}
            >
              {formatDate(game.date)} | {t('match.server')}: {game.server_ip}
            </Typography>
          </Box>
        </Box>

        {BLACKLISTED_MAPS.includes(game.map_name) && (
          <Typography
            sx={{ mt: 1, mb: 1, textAlign: 'center', color: 'error.main' }}
          >
            {t('match.unranked_banner')}
          </Typography>
        )}

        <MatchTeam
          teamName={t('match.blue_team')}
          isWinner={blueWins}
          players={blue}
          mapName={game.map_name}
        />

        <MatchTeam
          teamName={t('match.red_team')}
          isWinner={redWins}
          players={red}
          mapName={game.map_name}
        />
      </Card>
    </div>
  );
}
