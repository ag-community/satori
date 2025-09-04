import { Box, Card, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const MatchTeamHeader = ({
  teamName,
  isWinner,
  teamColor,
  totalFrags,
  totalDeaths,
  isMobile = false,
}: {
  teamName: string;
  isWinner: boolean;
  teamColor: string;
  totalFrags: number;
  totalDeaths: number;
  isMobile?: boolean;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (isMobile) {
    return (
      <Card
        sx={{
          mb: 1.5,
          bgcolor: theme.palette.primary.main,
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: 'none',
          borderLeft: isWinner ? `4px solid ${teamColor}` : undefined,
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" fontWeight={700} color={teamColor}>
            {teamName}
          </Typography>

          {isWinner && (
            <Typography
              variant="body2"
              fontWeight={700}
              color="white"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                background: teamColor,
                letterSpacing: 1,
              }}
            >
              {t('match.winner')}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            px: 2,
            py: 0.75,
            display: 'flex',
            justifyContent: 'space-between',
            bgcolor: 'rgba(0,0,0,0.2)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Typography variant="body2" color="white">
            {t('match.total_frags')}: <b>{totalFrags}</b>
          </Typography>
          <Typography variant="body2" color="white">
            {t('match.total_deaths')}: <b>{totalDeaths}</b>
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={2}
      sx={
        isWinner
          ? {
              background: `${teamColor}22`,
              borderRadius: 2,
              px: 2,
              py: 1,
            }
          : {}
      }
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography
          variant="h6"
          fontWeight={700}
          color={teamColor}
          sx={isWinner ? { textShadow: `0 0 8px ${teamColor}` } : {}}
        >
          {teamName}
        </Typography>
        {isWinner && (
          <Typography
            variant="body2"
            fontWeight={700}
            color="white"
            sx={{
              ml: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              background: teamColor,
              letterSpacing: 1,
            }}
          >
            {t('match.winner')}
          </Typography>
        )}
      </Box>
      <Typography variant="body2" color="white">
        {t('match.total_frags')}: <b>{totalFrags}</b> &nbsp;|&nbsp;{' '}
        {t('match.total_deaths')}: <b>{totalDeaths}</b>
      </Typography>
    </Box>
  );
};
