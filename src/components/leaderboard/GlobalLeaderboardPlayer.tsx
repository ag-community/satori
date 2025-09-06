import {
  Avatar,
  Box,
  Card,
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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  fetchLeaderboard,
  type LeaderboardPlayer as LeaderboardPlayerType,
} from '../../adapters/shion/leaderboard';
import { getFlagUrl } from '../../utils/countries';
import { getRankColor } from '../../utils/leaderboard';

const LeaderboardPlayerItem = ({
  player,
  position,
  isMobile,
}: {
  player: LeaderboardPlayerType;
  position: number;
  isMobile: boolean;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const rankColor = getRankColor(position);

  const matchesPlayed = player.playerStats.wins + player.playerStats.losses;
  const winRate =
    matchesPlayed > 0
      ? `${((player.playerStats.wins / matchesPlayed) * 100).toFixed(2)}%`
      : '0%';

  const renderCountryFlag = () => {
    return (
      <Box
        component="img"
        src={getFlagUrl(player.country.toUpperCase())}
        sx={{
          height: 25,
          borderRadius: '2px',
          marginRight: 1.5,
        }}
      />
    );
  };

  if (isMobile) {
    return (
      <Card
        sx={{
          mb: 2,
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            bgcolor: theme.palette.primary.main,
            borderLeft: position <= 3 ? `4px solid ${rankColor}` : undefined,
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontWeight: 700,
              minWidth: '30px',
            }}
          >
            #{position}
          </Typography>
          <Avatar
            src={player.avatarURL}
            alt={player.steamName}
            sx={{ width: 28, height: 28, mr: 1.5 }}
          />
          <Link
            to={`/player/${player.id}`}
            style={{
              color: '#4C94FF',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {player.steamName}
          </Link>
          {renderCountryFlag()}
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'grey.500', display: 'block' }}
              >
                {t('leaderboard.steam_id')}
              </Typography>
              <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                {player.steamID}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant="caption"
                sx={{ color: 'grey.500', display: 'block' }}
              >
                {t('leaderboard.rating')}
              </Typography>
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                {player.playerStats.rating}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'grey.500', display: 'block' }}
              >
                {t('leaderboard.matches_played')}
              </Typography>
              <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                {matchesPlayed}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant="caption"
                sx={{ color: 'grey.500', display: 'block' }}
              >
                {t('leaderboard.win_rate')}
              </Typography>
              <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                {winRate}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  }

  let rankStyle = {};
  if (position <= 3) {
    rankStyle = {
      fontWeight: 800,
      borderLeft: `4px solid ${rankColor}`,
    };
  }

  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        background: theme.palette.primary.main,
        ...rankStyle,
      }}
    >
      <TableCell sx={{ color: 'white', fontWeight: 700 }}>
        #{position}
      </TableCell>
      <TableCell
        sx={{
          color: 'white',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {renderCountryFlag()}
        <Avatar
          src={player.avatarURL}
          alt={player.steamName}
          sx={{ width: 32, height: 32, mr: 1 }}
        />
        <Link
          to={`/player/${player.id}`}
          style={{
            color: '#4C94FF',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          {player.steamName}
        </Link>
      </TableCell>
      <TableCell sx={{ color: 'white' }}>{player.steamID}</TableCell>
      <TableCell sx={{ color: 'white' }}>{matchesPlayed}</TableCell>
      <TableCell sx={{ color: 'white' }}>{winRate}</TableCell>
      <TableCell sx={{ color: 'white', fontWeight: 700 }}>
        {player.playerStats.rating}
      </TableCell>
    </TableRow>
  );
};

export const GlobalLeaderboardPlayer = ({
  isMobile,
  onError,
}: {
  isMobile: boolean;
  onError?: (error: string) => void;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardPlayerType[]
  >([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const leaderboardResponse = await fetchLeaderboard(page + 1, pageSize);
        setLeaderboardData(leaderboardResponse);
      } catch (error) {
        if (onError) onError('Failed to fetch leaderboard data');
        console.error('Failed to fetch leaderboard data: ', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, pageSize, onError]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderMobileView = () => {
    return (
      <Box>
        {isLoading ? (
          <Typography sx={{ color: 'white', textAlign: 'center', py: 2 }}>
            {t('common.loading')}
          </Typography>
        ) : leaderboardData.length === 0 ? (
          <Typography sx={{ color: 'white', textAlign: 'center', py: 2 }}>
            {t('leaderboard.no_data')}
          </Typography>
        ) : (
          leaderboardData.map((player, idx) => {
            const position = page * pageSize + idx + 1;
            return (
              <LeaderboardPlayerItem
                key={player.id || `player-${idx}`}
                player={player}
                position={position}
                isMobile={true}
              />
            );
          })
        )}
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
          labelRowsPerPage={t('pagination.rows_per_page')}
          labelDisplayedRows={({ from, to }) =>
            `${t('pagination.displayed_rows', { from, to })}`
          }
        />
      </Box>
    );
  };

  const renderDesktopView = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{
          background: theme.palette.primary.main,
          borderRadius: 2,
          boxShadow: 'none',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                {t('leaderboard.rank')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                {t('leaderboard.player')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                {t('leaderboard.steam_id')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                {t('leaderboard.matches_played')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                {t('leaderboard.win_rate')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                {t('leaderboard.rating')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{ color: 'white', textAlign: 'center' }}
                >
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            ) : leaderboardData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{ color: 'white', textAlign: 'center' }}
                >
                  {t('leaderboard.no_data')}
                </TableCell>
              </TableRow>
            ) : (
              leaderboardData.map((player, idx) => {
                const position = page * pageSize + idx + 1;
                return (
                  <LeaderboardPlayerItem
                    key={player.id || `player-${idx}`}
                    player={player}
                    position={position}
                    isMobile={false}
                  />
                );
              })
            )}
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
          labelRowsPerPage={t('pagination.rows_per_page')}
          labelDisplayedRows={({ from, to }) =>
            `${t('pagination.displayed_rows', { from, to })}`
          }
        />
      </TableContainer>
    );
  };

  return <>{isMobile ? renderMobileView() : renderDesktopView()}</>;
};
