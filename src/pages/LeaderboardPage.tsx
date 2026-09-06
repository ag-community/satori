import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { PlayerLink } from '@/components/PlayerLink';
import { Flag } from '@/components/ui/Flag';
import { Pagination } from '@/components/ui/Pagination';
import { SortableSections } from '@/components/ui/SortableSections';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/ViewStates';
import { api } from '@/lib/api/client';
import type { SortBy } from '@/lib/api/types';
import { COUNTRY_CODES, getCountryName } from '@/lib/countries';
import { formatPercent, formatRating } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';

const SORT_OPTIONS: { value: SortBy; key: string }[] = [
  { value: 'Rating', key: 'leaderboard.filter_sort_rating' },
  { value: 'WinRate', key: 'leaderboard.filter_sort_winrate' },
  { value: 'Matches', key: 'leaderboard.filter_sort_matches' },
];

const FILTER_MIN_HEIGHT = 34;

function parseSort(value: string | null): SortBy {
  return SORT_OPTIONS.some((o) => o.value === value)
    ? (value as SortBy)
    : 'Rating';
}

export function LeaderboardPage() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  usePageTitle(t('title.leaderboard'));
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = parseSort(searchParams.get('sort'));
  const country = searchParams.get('country') ?? 'all';
  const page = Math.max(parseInt(searchParams.get('page') ?? '1', 10) || 1, 1);
  const size = Math.max(
    parseInt(searchParams.get('size') ?? '50', 10) || 50,
    1,
  );

  const countryOptions = useMemo(
    () =>
      COUNTRY_CODES.map((code) => ({
        code,
        name: getCountryName(code, i18n.language),
      })).sort((a, b) => a.name.localeCompare(b.name)),
    [i18n.language],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', sort, country, page, size],
    queryFn: () =>
      api.fetchLeaderboard({
        index: page,
        size,
        sortBy: sort,
        country: country === 'all' ? undefined : country,
      }),
  });

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next, { replace: true });
  };

  const rankColor = (rank: number): string => {
    if (rank === 1) return theme.vars.palette.primary.main;
    if (rank === 2) return theme.vars.palette.grey[400];
    if (rank === 3) return theme.vars.palette.grey[500];
    return 'inherit';
  };

  const body: ReactNode = (
    <>
      <Typography sx={{ mb: 1.5 }}>{t('leaderboard.description')}</Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          mb: 1.5,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel id="sort-filter-label">
            {t('leaderboard.filter_sort')}
          </InputLabel>
          <Select<SortBy>
            labelId="sort-filter-label"
            id="sort-filter"
            size="small"
            value={sort}
            label={t('leaderboard.filter_sort')}
            onChange={(e) => setParam('sort', e.target.value)}
            sx={{ minHeight: FILTER_MIN_HEIGHT }}
          >
            {SORT_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {t(o.key)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="country-filter-label">
            {t('leaderboard.filter_country')}
          </InputLabel>
          <Select<string>
            labelId="country-filter-label"
            id="country-filter"
            size="small"
            value={country}
            label={t('leaderboard.filter_country')}
            onChange={(e) => setParam('country', e.target.value)}
            sx={{ minHeight: FILTER_MIN_HEIGHT }}
          >
            <MenuItem value="all">{t('leaderboard.all_countries')}</MenuItem>
            {countryOptions.map(({ code, name }) => (
              <MenuItem key={code} value={code}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error.message} />}
      {data && data.records.length === 0 && (
        <EmptyState label={t('leaderboard.no_data')} />
      )}

      {data && data.records.length > 0 && (
        <>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>{t('leaderboard.player')}</TableCell>
                  <TableCell>{t('leaderboard.matches_played')}</TableCell>
                  <TableCell>{t('leaderboard.rating')}</TableCell>
                  <TableCell>{t('leaderboard.win_rate')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.records.map((player, idx) => {
                  const rank = (page - 1) * size + idx + 1;
                  const matches =
                    (player.stats?.wins ?? 0) + (player.stats?.losses ?? 0);
                  const winRate = formatPercent(
                    player.stats?.wins ?? 0,
                    matches,
                  );
                  return (
                    <TableRow key={player.id}>
                      <TableCell
                        sx={{
                          color: rankColor(rank),
                          fontWeight: rank === 1 ? 700 : undefined,
                        }}
                      >
                        #{rank}
                      </TableCell>
                      <TableCell>
                        <PlayerLink
                          playerId={player.id}
                          name={player.steam_name}
                          avatarUrl={player.steam_avatar_url}
                        >
                          <Flag countryCode={player.country} />
                        </PlayerLink>
                      </TableCell>
                      <TableCell>{matches}</TableCell>
                      <TableCell>
                        {formatRating(player.stats?.rating)}
                      </TableCell>
                      <TableCell>{winRate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            page={page}
            pageSize={size}
            total={data.total}
            onPageChange={(p) => setParam('page', String(p))}
          />
        </>
      )}
    </>
  );

  return (
    <SortableSections
      sections={{ global: { title: t('leaderboard.global'), body } }}
      initialOrder={['global']}
    />
  );
}
