import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useQuery } from '@tanstack/react-query';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/ViewStates';
import { api } from '@/lib/api/client';
import type { PlayerMatchDto } from '@/lib/api/types';
import { formatDate, formatDelta, formatRating } from '@/lib/format';

const DEFAULT_PAGE_SIZE = 10;

function resultCell(
  match: PlayerMatchDto,
  unranked: boolean,
  t: (key: string) => string,
): string {
  if (unranked) return 'N/A';
  return match.won ? t('match.won') : t('match.lost');
}

const unrankedBadge = (t: (key: string) => string) => (
  <Typography
    component="span"
    sx={{
      ml: 0.75,
      px: 0.5,
      fontSize: 11,
      lineHeight: 1.4,
      color: 'text.secondary',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 0.5,
      whiteSpace: 'nowrap',
    }}
  >
    {t('match.unranked')}
  </Typography>
);

interface MatchHistoryProps {
  playerId: number;
  seasonId?: number;
}

export function MatchHistory({ playerId, seasonId }: MatchHistoryProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(parseInt(searchParams.get('page') ?? '1', 10) || 1, 1);
  const size = DEFAULT_PAGE_SIZE;

  const { data, isLoading, error } = useQuery({
    queryKey: ['player-matches', playerId, seasonId, page, size],
    queryFn: () => api.fetchPlayerMatches(playerId, page, size, seasonId),
  });

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const positiveColor = theme.vars.palette.secondary.main;
  const negativeColor = theme.vars.palette.error.main;

  return (
    <Box>
      {isLoading && <LoadingState />}
      {error && <ErrorState message={error.message} />}
      {data && data.records.length === 0 && (
        <EmptyState label={t('player.no_matches')} />
      )}

      {data && data.records.length > 0 && (
        <>
          {isMobile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {data.records.map((match) => {
                const unranked = match.unranked;
                return (
                  <Link
                    key={match.id}
                    to={`/game/${match.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Card variant="inset">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography component="span" sx={{ fontWeight: 700 }}>
                          {match.map_name}
                        </Typography>
                        {unranked && unrankedBadge(t)}
                        <Typography
                          component="span"
                          sx={{
                            ml: 'auto',
                            color: !unranked
                              ? match.won
                                ? positiveColor
                                : negativeColor
                              : 'inherit',
                          }}
                        >
                          {resultCell(match, unranked, t)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ m: '8px 0 0', fontSize: 12 }}
                      >
                        {t('player.date')}: <b>{formatDate(match.date)}</b> |{' '}
                        {t('match.frags')}: <b>{match.frags}</b> |{' '}
                        {t('match.deaths')}: <b>{match.deaths}</b>
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ m: '4px 0 0', fontSize: 12 }}
                      >
                        {t('match.points')}:{' '}
                        <b>
                          {unranked ? (
                            'N/A'
                          ) : (
                            <>
                              {formatRating(match.points_after_match)}
                              {match.points_delta !== 0 && (
                                <span
                                  style={{
                                    marginLeft: 6,
                                    color:
                                      match.points_delta > 0
                                        ? positiveColor
                                        : negativeColor,
                                  }}
                                >
                                  ({formatDelta(match.points_delta)})
                                </span>
                              )}
                            </>
                          )}
                        </b>
                      </Typography>
                    </Card>
                  </Link>
                );
              })}
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('player.date')}</TableCell>
                    <TableCell>{t('player.map')}</TableCell>
                    <TableCell>{t('match.result')}</TableCell>
                    <TableCell>{t('match.frags')}</TableCell>
                    <TableCell>{t('match.deaths')}</TableCell>
                    <TableCell>{t('match.points')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.records.map((match) => {
                    const unranked = match.unranked;
                    return (
                      <TableRow
                        key={match.id}
                        hover
                        onClick={() => navigate(`/game/${match.id}`)}
                        onKeyDown={(e: KeyboardEvent<HTMLTableRowElement>) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/game/${match.id}`);
                          }
                        }}
                        tabIndex={0}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {formatDate(match.date)}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <b>{match.map_name}</b>
                          {unranked && unrankedBadge(t)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: !unranked
                              ? match.won
                                ? positiveColor
                                : negativeColor
                              : 'inherit',
                          }}
                        >
                          {resultCell(match, unranked, t)}
                        </TableCell>
                        <TableCell>{match.frags}</TableCell>
                        <TableCell>{match.deaths}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {unranked ? (
                            'N/A'
                          ) : (
                            <>
                              {formatRating(match.points_after_match)}
                              {match.points_delta !== 0 && (
                                <span
                                  style={{
                                    marginLeft: 6,
                                    color:
                                      match.points_delta > 0
                                        ? positiveColor
                                        : negativeColor,
                                  }}
                                >
                                  ({formatDelta(match.points_delta)})
                                </span>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Pagination
            page={page}
            pageSize={size}
            total={data.total}
            onPageChange={(p) => setParam('page', String(p))}
          />
        </>
      )}
    </Box>
  );
}
