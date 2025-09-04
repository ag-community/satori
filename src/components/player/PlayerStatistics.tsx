import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Player } from '../../adapters/shion/player';

export const PlayerStatistics = ({
  playerProfile,
}: {
  playerProfile: Player;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {t('player.statistics')}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          background: theme.palette.primary.main,
          borderRadius: 2,
          boxShadow: 'none',
        }}
      >
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>
                {t('player.matches_played')}
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {playerProfile.playerStats.wins +
                  playerProfile.playerStats.losses}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>{t('player.wins')}</TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {playerProfile.playerStats.wins}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>
                {t('player.losses')}
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {playerProfile.playerStats.losses}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>
                {t('player.win_rate')}
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {playerProfile.playerStats.wins +
                playerProfile.playerStats.losses
                  ? `${(
                      (playerProfile.playerStats.wins /
                        (playerProfile.playerStats.wins +
                          playerProfile.playerStats.losses)) *
                        100
                    ).toFixed(2)}%`
                  : '0%'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>
                {t('player.total_frags')}
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {playerProfile.playerStats.totalFrags || 0}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>
                {t('player.total_deaths')}
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {playerProfile.playerStats.totalDeaths || 0}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>
                {t('player.kd_ratio')}
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {playerProfile.playerStats.totalDeaths > 0
                  ? (
                      playerProfile.playerStats.totalFrags /
                      playerProfile.playerStats.totalDeaths
                    ).toFixed(2)
                  : playerProfile.playerStats.totalFrags.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>
                {t('player.avg_frags_per_match')}
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                {playerProfile.playerStats.wins +
                  playerProfile.playerStats.losses >
                0
                  ? (
                      playerProfile.playerStats.totalFrags /
                      (playerProfile.playerStats.wins +
                        playerProfile.playerStats.losses)
                    ).toFixed(2)
                  : '0'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
