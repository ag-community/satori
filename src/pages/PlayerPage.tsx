import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  fetchPlayer,
  fetchPlayerMatches,
  fetchPlayerRatingHistory,
  type Match,
  type Player,
  type PlayerHistory,
} from '../adapters/shion/player';
import { CardSection } from '../components/CardSection';

const getPlayerIdFromQueryParams = (identifier?: string): number => {
  let userId = parseInt(identifier || '', 10);
  if (Number.isNaN(userId)) {
    // TODO: do API lookup
    userId = 0;
  }
  return userId;
};

const getChartOptions = () => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      y: {
        display: true,
        ticks: {
          precision: 0,
        },
      },
      x: {
        display: false,
      },
    },
    plugins: {
      tooltip: {
        intersect: false,
      },
      legend: {
        display: false,
      },
    },
  } as const;
};

const PlayerRatingChart = ({
  playerRatingHistory,
}: {
  playerRatingHistory: PlayerHistory | null;
}) => {
  const { t } = useTranslation();

  if (!playerRatingHistory || playerRatingHistory.captures.length === 0) {
    return (
      <Box
        sx={{
          height: 231,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}
      >
        <Typography align="center">{t('player.no_rating_data')}</Typography>
      </Box>
    );
  }

  const captures = playerRatingHistory.captures;
  let chartLabels = [];
  let chartRatings = [];

  if (captures.length === 1) {
    const capture = captures[0];
    const date = capture.capturedAt.toLocaleDateString();

    chartLabels = [date, date];
    chartRatings = [capture.rating, capture.rating];
  } else {
    chartLabels = captures.map((capture) =>
      capture.capturedAt.toLocaleDateString(),
    );
    chartRatings = captures.map((capture) => capture.rating);
  }

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: t('player.rating'),
        data: chartRatings,
        borderColor: '#ffffff',
        tension: 0.5,
        borderWidth: 3,
      },
    ],
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '231px',
        width: '100%',
      }}
    >
      <Line data={chartData} options={getChartOptions()} />
    </Box>
  );
};

export const PlayerPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const queryParams = useParams();
  const profilePlayerId = getPlayerIdFromQueryParams(queryParams.playerId);
  const [playerProfile, setPlayerProfile] = useState<Player | null>(null);
  const [playerRatingHistory, setPlayerRatingHistory] =
    useState<PlayerHistory | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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

  useEffect(() => {
    (async () => {
      if (!profilePlayerId) return;
      try {
        const matchesResponse = await fetchPlayerMatches(
          profilePlayerId,
          page + 1,
          pageSize,
        );
        setMatches(matchesResponse);
      } catch (_error) {
        setError('Failed to fetch player match history');
      }
    })();
  }, [profilePlayerId, page, pageSize]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
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
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={playerProfile.avatarURL}
            alt={playerProfile.steamName}
            sx={{ width: 64, height: 64, mr: 2, border: '2px solid #4C94FF' }}
          />
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {playerProfile.steamName}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 16 }}>
              SteamID: <b>{playerProfile.steamID}</b>
            </Typography>
            <Box mt={1}>
              <Chip
                icon={<EmojiEventsIcon color="secondary" />}
                label={`${t('leaderboard.rating')}: ${playerProfile.playerStats.rating}`}
                color="secondary"
                sx={{ fontWeight: 700, fontSize: 16 }}
              />
            </Box>
          </Box>
        </Box>
      </CardSection>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
          mt: 3,
        }}
      >
        <CardSection sx={{ flexGrow: 1, flexBasis: '40%' }}>
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
                  <TableCell sx={{ color: 'white' }}>
                    {t('player.wins')}
                  </TableCell>
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
        </CardSection>

        <CardSection sx={{ flexGrow: 1, flexBasis: '60%' }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            {t('player.rating_progression')}
          </Typography>
          <Paper
            sx={{
              background: theme.palette.primary.main,
              borderRadius: 2,
              boxShadow: 'none',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <PlayerRatingChart playerRatingHistory={playerRatingHistory} />
          </Paper>
        </CardSection>
      </Box>

      <CardSection>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {t('player.match_history')}
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
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                  {t('player.date')}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                  {t('player.map')}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                  {t('match.frags')}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                  {t('match.deaths')}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                  {t('player.rating_gained')}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                  {t('player.rating')}
                </TableCell>
                <TableCell
                  sx={{ color: 'white', fontWeight: 700 }}
                  align="center"
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    sx={{ color: 'white', textAlign: 'center' }}
                  >
                    {t('player.no_matches')}
                  </TableCell>
                </TableRow>
              )}
              {matches.map((match: Match) => (
                <TableRow key={match.matchId}>
                  <TableCell sx={{ color: 'white' }}>
                    {new Date(match.matchDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{match.mapName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{match.frags}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{match.deaths}</TableCell>
                  <TableCell
                    sx={{
                      color: match.ratingDelta >= 0 ? '#4CFF4C' : '#FF4C4C',
                      fontWeight: 700,
                    }}
                  >
                    {match.ratingDelta >= 0 ? '+' : ''}
                    {match.ratingDelta}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {match.ratingAfterMatch}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      component={Link}
                      to={`/match/${match.matchId}`}
                      size="small"
                      sx={{ color: '#4C94FF' }}
                    >
                      <InfoOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={-1}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{
              color: 'white',
              '.MuiTablePagination-toolbar': { color: 'white' },
              '.MuiTablePagination-selectIcon': { color: 'white' },
              '.MuiTablePagination-actions': { color: 'white' },
            }}
          />
        </TableContainer>
      </CardSection>
    </Box>
  );
};
