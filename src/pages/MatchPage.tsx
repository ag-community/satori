import {
  Alert,
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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { fetchMatch, type Match } from '../adapters/shion/match';
import { CardSection } from '../components/CardSection';

const getMatchIdFromQueryParams = (identifier?: string): number => {
  let matchId = parseInt(identifier || '', 10);
  if (Number.isNaN(matchId)) {
    // TODO: do API lookup
    matchId = 0;
  }
  return matchId;
};

export const MatchPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const queryParams = useParams();
  const matchId = getMatchIdFromQueryParams(queryParams.matchId);
  const [matchData, setMatchData] = useState<Match | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = t('title.match', { matchId });
  }, [t, matchId]);

  useEffect(() => {
    (async () => {
      if (!matchId) return;
      try {
        const matchResponse = await fetchMatch(matchId);
        setMatchData(matchResponse);
        setError('');
      } catch (_error) {
        setError('Failed to fetch match data from server.');
      }
    })();
  }, [matchId]);

  if (!matchId) {
    return (
      <Typography variant="h2">Must provide a match id in the path.</Typography>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Something went wrong while loading the page: {error}
      </Alert>
    );
  }

  if (!matchData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Loading match data...
        </Typography>
      </Box>
    );
  }

  const bluePlayers = matchData.matchDetails.filter((p) => p.model === 'blue');
  const redPlayers = matchData.matchDetails.filter((p) => p.model === 'red');

  const matchType = `${bluePlayers.length}vs${redPlayers.length}`;

  const blueFrags = bluePlayers.reduce((sum, p) => sum + p.frags, 0);
  const blueDeaths = bluePlayers.reduce((sum, p) => sum + p.deaths, 0);
  const redFrags = redPlayers.reduce((sum, p) => sum + p.frags, 0);
  const redDeaths = redPlayers.reduce((sum, p) => sum + p.deaths, 0);

  const blueIsWinner = blueFrags > redFrags;
  const redIsWinner = redFrags > blueFrags;

  const renderTeamTable = (players: typeof matchData.matchDetails) => (
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
              {t('match.gained_points')}
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
                  color: player.ratingDelta >= 0 ? '#4CFF4C' : '#FF4C4C',
                  fontWeight: 700,
                }}
              >
                {player.ratingDelta >= 0 ? '+' : ''}
                {player.ratingDelta}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Ordenar por frags descendente
  const bluePlayersSorted = [...bluePlayers].sort((a, b) => b.frags - a.frags);
  const redPlayersSorted = [...redPlayers].sort((a, b) => b.frags - a.frags);

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        py: 4,
        px: 2,
      }}
    >
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
        {/* Imagen de fondo */}
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
        {/* Contenido encima */}
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
            {new Date(matchData.matchDate).toLocaleString()} |{' '}
            {t('match.server')}: {matchData.serverIp}
          </Typography>
        </Box>
      </CardSection>

      <CardSection>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          sx={
            blueIsWinner
              ? {
                  background: `${theme.palette.success.main}22`,
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
              color={theme.palette.success.main}
            >
              {t('match.blue_team')}
            </Typography>
            {blueIsWinner && (
              <Typography
                variant="body2"
                fontWeight={700}
                color="white"
                sx={{
                  ml: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  background: theme.palette.success.main,
                  letterSpacing: 1,
                }}
              >
                {t('match.winner')}
              </Typography>
            )}
          </Box>
          <Typography variant="body2" color="white">
            {t('match.total_frags')}: <b>{blueFrags}</b> &nbsp;|&nbsp;{' '}
            {t('match.total_deaths')}: <b>{blueDeaths}</b>
          </Typography>
        </Box>
        {renderTeamTable(bluePlayersSorted)}

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          sx={
            redIsWinner
              ? {
                  background: `${theme.palette.error.main}22`,
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
              color={theme.palette.error.main}
              sx={
                redIsWinner
                  ? { textShadow: `0 0 8px ${theme.palette.error.main}` }
                  : {}
              }
            >
              {t('match.red_team')}
            </Typography>
            {redIsWinner && (
              <Typography
                variant="body2"
                fontWeight={700}
                color="white"
                sx={{
                  ml: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  background: theme.palette.error.main,
                  letterSpacing: 1,
                }}
              >
                Winner
              </Typography>
            )}
          </Box>
          <Typography variant="body2" color="white">
            {t('match.total_frags')}: <b>{redFrags}</b> &nbsp;|&nbsp;{' '}
            {t('match.total_deaths')}: <b>{redDeaths}</b>
          </Typography>
        </Box>
        {renderTeamTable(redPlayersSorted)}
      </CardSection>
    </Box>
  );
};
