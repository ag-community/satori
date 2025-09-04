import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  Avatar,
  Box,
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
  type LeaderboardPlayer,
} from '../adapters/shion/leaderboard';
import { CardSection } from '../components/CardSection';

export const LeaderboardPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardPlayer[] | null
  >(null);

  useEffect(() => {
    document.title = t('title.leaderboard');
  }, [t]);

  useEffect(() => {
    (async () => {
      try {
        const leaderboardResponse = await fetchLeaderboard(page + 1, pageSize);
        setLeaderboardData(leaderboardResponse);
      } catch (error) {
        console.error('Failed to fetch data from server: ', error);
        return;
      }
    })();
  }, [page, pageSize]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
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
              {leaderboardData?.map((row, idx) => {
                const position = page * pageSize + idx + 1;
                let rankStyle = {};

                if (position <= 3) {
                  rankStyle = {
                    fontWeight: 800,
                    borderLeft: `4px solid ${
                      position === 1
                        ? 'rgba(255, 215, 0, 0.7)'
                        : position === 2
                          ? 'rgba(192, 192, 192, 0.7)'
                          : 'rgba(205, 127, 50, 0.7)'
                    }`,
                  };
                }

                return (
                  <TableRow
                    key={row.steamName + idx}
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
                      <Avatar
                        src={row.avatarURL}
                        alt={row.steamName}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      />
                      <Link
                        to={`/player/${row.id}`}
                        style={{
                          color: '#4C94FF',
                          textDecoration: 'none',
                          fontWeight: 700,
                        }}
                      >
                        {row.steamName}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>{row.steamID}</TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      {row.playerStats.wins + row.playerStats.losses}
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      {row.playerStats.wins + row.playerStats.losses > 0
                        ? `${(
                            (row.playerStats.wins /
                              (row.playerStats.wins + row.playerStats.losses)) *
                              100
                          ).toFixed(2)}%`
                        : '0%'}
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                      {row.playerStats.rating}
                    </TableCell>
                  </TableRow>
                );
              })}
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
