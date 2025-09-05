import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Card,
  IconButton,
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
import { fetchPlayerMatches, type Match } from '../../adapters/shion/player';

export const PlayerMatches = ({
  playerId,
  isMobile,
  onError,
}: {
  playerId: number;
  isMobile: boolean;
  onError: (error: string) => void;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!playerId) return;

    (async () => {
      setIsLoading(true);
      try {
        const matchesResponse = await fetchPlayerMatches(
          playerId,
          page + 1,
          pageSize,
        );
        setMatches(matchesResponse);
      } catch (_error) {
        onError('Failed to fetch player match history');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [playerId, page, pageSize, onError]);

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
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <Typography sx={{ color: 'white', textAlign: 'center', py: 2 }}>
            {t('common.loading')}
          </Typography>
        ) : matches.length === 0 ? (
          <Typography sx={{ color: 'white', textAlign: 'center', py: 2 }}>
            {t('player.no_matches')}
          </Typography>
        ) : (
          matches.map((match: Match, index) => (
            <Box
              key={match.matchId}
              sx={{
                borderBottom:
                  index < matches.length - 1
                    ? '1px solid rgba(255,255,255,0.1)'
                    : 'none',
              }}
            >
              <Card
                sx={{
                  boxShadow: 'none',
                  backgroundColor: 'transparent',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  <Typography
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    {match.mapName}
                  </Typography>
                  <IconButton
                    component={Link}
                    to={`/match/${match.matchId}`}
                    size="small"
                    sx={{ color: '#4C94FF' }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1.2,
                    }}
                  >
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'grey.500', display: 'block' }}
                      >
                        {t('player.date')}
                      </Typography>
                      <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                        {new Date(match.matchDate).toLocaleString(undefined, {
                          year: '2-digit',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'grey.500',
                          display: 'block',
                          textAlign: 'center',
                        }}
                      >
                        {t('player.match_type')}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'white',
                          fontSize: '0.875rem',
                          textAlign: 'center',
                        }}
                      >
                        {match.matchType}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, textAlign: 'right' }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'grey.500', display: 'block' }}
                      >
                        {t('player.rating_gained')}
                      </Typography>
                      <Typography
                        sx={{
                          color: match.ratingDelta >= 0 ? '#4CFF4C' : '#FF4C4C',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                        }}
                      >
                        {match.ratingDelta >= 0 ? '+' : ''}
                        {match.ratingDelta}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'grey.500', display: 'block' }}
                      >
                        {t('match.frags')}
                      </Typography>
                      <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                        {match.frags}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'grey.500',
                          display: 'block',
                          textAlign: 'center',
                        }}
                      >
                        {t('match.deaths')}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'white',
                          fontSize: '0.875rem',
                          textAlign: 'center',
                        }}
                      >
                        {match.deaths}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, textAlign: 'right' }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'grey.500', display: 'block' }}
                      >
                        {t('player.rating')}
                      </Typography>
                      <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                        {match.ratingAfterMatch}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))
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
                {t('player.match_type')}
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  sx={{ color: 'white', textAlign: 'center' }}
                >
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            ) : matches.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  sx={{ color: 'white', textAlign: 'center' }}
                >
                  {t('player.no_matches')}
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match: Match) => (
                <TableRow key={match.matchId}>
                  <TableCell sx={{ color: 'white' }}>
                    {new Date(match.matchDate).toLocaleString(undefined, {
                      year: '2-digit',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{match.mapName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {match.matchType}
                  </TableCell>
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
              ))
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
        />
      </TableContainer>
    );
  };

  return (
    <>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {t('player.match_history')}
      </Typography>
      {isMobile ? renderMobileView() : renderDesktopView()}
    </>
  );
};
