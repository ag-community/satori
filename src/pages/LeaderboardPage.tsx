import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CardSection } from '../components/CardSection';
import { GlobalLeaderboardPlayer } from '../components/leaderboard/GlobalLeaderboardPlayer';

export const LeaderboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = t('title.leaderboard');
  }, [t]);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: 'auto',
        py: 4,
        px: 2,
      }}
    >
      <CardSection>
        <Box display="flex" alignItems="center" mb={2}>
          <EmojiEventsIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700}>
            {t('leaderboard.global')}
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <GlobalLeaderboardPlayer isMobile={isMobile} onError={handleError} />
      </CardSection>
    </Box>
  );
};
