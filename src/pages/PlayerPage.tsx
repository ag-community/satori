import { Alert, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  fetchPlayer,
  fetchPlayerRatingHistory,
  type Player,
  type PlayerHistory,
} from '../adapters/shion/player';
import { CardSection } from '../components/CardSection';
import { PlayerMatches } from '../components/player/PlayerMatches';
import { PlayerProfile } from '../components/player/PlayerProfile';
import { PlayerRatingChart } from '../components/player/PlayerRatingChart';
import { PlayerStatistics } from '../components/player/PlayerStatistics';

const getPlayerIdFromQueryParams = (identifier?: string): number => {
  let userId = parseInt(identifier || '', 10);
  if (Number.isNaN(userId)) {
    // TODO: do API lookup
    userId = 0;
  }
  return userId;
};

export const PlayerPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const queryParams = useParams();
  const profilePlayerId = getPlayerIdFromQueryParams(queryParams.playerId);
  const [playerProfile, setPlayerProfile] = useState<Player | null>(null);
  const [playerRatingHistory, setPlayerRatingHistory] =
    useState<PlayerHistory | null>(null);
  const [error, setError] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    document.title = t('title.player', {
      playerName: playerProfile?.steamName,
    });
  }, [t, playerProfile]);

  useEffect(() => {
    (async () => {
      if (!profilePlayerId) return;
      try {
        const playerResponse = await fetchPlayer(profilePlayerId);
        setPlayerProfile(playerResponse);
        setError('');
      } catch (_error) {
        setError('Failed to fetch user profile data from server');
      }
    })();
  }, [profilePlayerId]);

  useEffect(() => {
    (async () => {
      if (!profilePlayerId) return;
      try {
        const historyResponse = await fetchPlayerRatingHistory(profilePlayerId);
        setPlayerRatingHistory(historyResponse);
      } catch (_error) {
        setError('Failed to fetch player rating history.');
      }
    })();
  }, [profilePlayerId]);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!profilePlayerId) {
    return (
      <Typography variant="h2">
        Must provide an account id in the path.
      </Typography>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Something went wrong while loading the page: {error}
      </Alert>
    );
  }

  if (!playerProfile) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Loading player data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        py: 4,
        px: 2,
      }}
    >
      <CardSection>
        <PlayerProfile playerProfile={playerProfile} />
      </CardSection>

      <Box
        sx={{
          display: 'flex',
          gap: { md: 3 },
          flexDirection: { xs: 'column', md: 'row' },
          mt: 3,
        }}
      >
        <CardSection sx={{ flexGrow: 1, flexBasis: '40%' }}>
          <PlayerStatistics playerProfile={playerProfile} />
        </CardSection>

        <CardSection sx={{ flexGrow: 1, flexBasis: '60%' }}>
          <PlayerRatingChart playerRatingHistory={playerRatingHistory} />
        </CardSection>
      </Box>

      <CardSection>
        <PlayerMatches
          playerId={profilePlayerId}
          isMobile={isMobile}
          onError={handleError}
        />
      </CardSection>
    </Box>
  );
};
