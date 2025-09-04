import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Match } from '../../adapters/shion/match';
import { CardSection } from '../CardSection';

export const MatchBanner = ({
  matchData,
  matchType,
}: {
  matchData: Match;
  matchType: string;
}) => {
  const { t } = useTranslation();

  return (
    <CardSection
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        mb: 3,
        p: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(/images/map_banners/${matchData.mapName}.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          {matchType} {t('match.match_on')} {matchData.mapName}
        </Typography>
        <Typography color="text.secondary" mb={2}>
          {new Date(matchData.matchDate).toLocaleString()} | {t('match.server')}
          : {matchData.serverIp}
        </Typography>
      </Box>
    </CardSection>
  );
};
