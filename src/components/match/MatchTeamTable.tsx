import {
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { MatchDetails } from '../../adapters/shion/match';

export const MatchTeamTable = ({
  players,
  isBlacklisted,
}: {
  players: MatchDetails[];
  isBlacklisted: boolean;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <TableContainer
      component={Paper}
      sx={{
        background: theme.palette.primary.main,
        borderRadius: 2,
        boxShadow: 'none',
        mb: 2,
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 700 }}>
              {t('match.player')}
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 700 }}>
              {t('match.frags')}
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 700 }}>
              {t('match.deaths')}
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 700 }}>
              {t('match.avg_ping')}
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 700 }}>
              {t('match.damage_dealt')}
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 700 }}>
              {t('match.damage_taken')}
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 700 }}>
              {t('match.rating')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.playerId}>
              <TableCell
                sx={{ color: 'white', display: 'flex', alignItems: 'center' }}
              >
                <Avatar
                  src={player.playerAvatarUrl}
                  alt={player.playerSteamName}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Link
                    to={`/player/${player.playerId}`}
                    style={{
                      color: '#4C94FF',
                      textDecoration: 'none',
                      fontWeight: 700,
                    }}
                  >
                    {player.playerSteamName}
                  </Link>
                  <Typography variant="caption" sx={{ color: 'gray' }}>
                    {player.playerSteamID}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white' }}>{player.frags}</TableCell>
              <TableCell sx={{ color: 'white' }}>{player.deaths}</TableCell>
              <TableCell sx={{ color: 'white' }}>
                {player.averagePing}
              </TableCell>
              <TableCell sx={{ color: 'white' }}>
                {player.damageDealt}
              </TableCell>
              <TableCell sx={{ color: 'white' }}>
                {player.damageTaken}
              </TableCell>
              <TableCell
                sx={{
                  color: isBlacklisted
                    ? 'grey.500'
                    : player.ratingDelta > 0
                      ? '#4CFF4C'
                      : player.ratingDelta < 0
                        ? '#FF4C4C'
                        : 'grey.500',
                  fontWeight: 700,
                }}
              >
                {isBlacklisted ? '—' : player.ratingAfterMatch}{' '}
                <Typography
                  component="span"
                  sx={{ fontWeight: 400, fontSize: '0.85em' }}
                >
                  {isBlacklisted
                    ? ''
                    : `(${player.ratingDelta > 0 ? '+' : ''}${player.ratingDelta})`}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
