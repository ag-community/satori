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
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PlayerLink } from '@/components/PlayerLink';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import type { GameDetailPlayerDto } from '@/lib/api/types';
import { formatDelta, formatRating } from '@/lib/format';

interface MatchTeamProps {
  teamName: string;
  isWinner: boolean;
  players: GameDetailPlayerDto[];
  unranked: boolean;
}

export function MatchTeam({
  teamName,
  isWinner,
  players,
  unranked,
}: MatchTeamProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const sorted = [...players].sort((a, b) => b.frags - a.frags);
  const totalFrags = players.reduce((sum, p) => sum + p.frags, 0);
  const totalDeaths = players.reduce((sum, p) => sum + p.deaths, 0);

  const positiveColor = theme.vars.palette.secondary.main;
  const negativeColor = theme.vars.palette.error.main;

  const pointsCell = (p: GameDetailPlayerDto): ReactNode =>
    unranked ? (
      'N/A'
    ) : (
      <Typography component="span" sx={{ whiteSpace: 'nowrap' }}>
        {formatRating(p.points_after_match)}
        {p.points_delta !== 0 && (
          <Typography
            component="span"
            sx={{
              ml: 0.75,
              color: p.points_delta > 0 ? positiveColor : negativeColor,
            }}
          >
            ({formatDelta(p.points_delta)})
          </Typography>
        )}
      </Typography>
    );

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          p: 1.5,
          ...(isWinner && {
            backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.12)`,
            border: '1px solid',
            borderColor: 'primary.main',
          }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            mb: isMobile ? 1.25 : 1,
          }}
        >
          <Typography
            component="h3"
            variant="h6"
            sx={{
              m: 0,
              color: isWinner ? 'primary.main' : 'inherit',
              fontWeight: 700,
            }}
          >
            {teamName}
          </Typography>
          {isWinner && (
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              {t('match.winner')}
            </Typography>
          )}
          <Typography
            component="span"
            sx={{ ml: 'auto', color: 'text.secondary' }}
          >
            {t('match.total_frags')}: <b>{totalFrags}</b> |{' '}
            {t('match.total_deaths')}: <b>{totalDeaths}</b>
          </Typography>
        </Box>

        {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {sorted.map((p) => (
              <Card key={p.player_id} variant="inset">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    flexWrap: 'wrap',
                  }}
                >
                  <Avatar
                    url={p.steam_avatar_url}
                    alt={p.steam_name}
                    size={32}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Link to={`/player/${p.player_id}`}>{p.steam_name}</Link>
                    <Typography
                      variant="caption"
                      component="p"
                      sx={{ m: 0, color: 'text.secondary' }}
                    >
                      {p.steam_id}
                    </Typography>
                  </Box>
                  <Typography component="span" sx={{ ml: 'auto' }}>
                    {pointsCell(p)}
                  </Typography>
                </Box>
                <Typography sx={{ m: '8px 0 0', fontSize: 12 }}>
                  {t('match.frags')}: <b>{p.frags}</b> | {t('match.deaths')}:{' '}
                  <b>{p.deaths}</b> | {t('match.avg_ping')}:{' '}
                  <b>{p.average_ping}</b> | {t('match.damage_dealt')}:{' '}
                  <b>{p.damage_dealt}</b> | {t('match.damage_taken')}:{' '}
                  <b>{p.damage_taken}</b>
                </Typography>
              </Card>
            ))}
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 560 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>{t('match.player')}</TableCell>
                  <TableCell>{t('match.frags')}</TableCell>
                  <TableCell>{t('match.deaths')}</TableCell>
                  <TableCell>{t('match.avg_ping')}</TableCell>
                  <TableCell>{t('match.damage_dealt')}</TableCell>
                  <TableCell>{t('match.damage_taken')}</TableCell>
                  <TableCell>{t('match.points')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sorted.map((p, idx) => (
                  <TableRow key={p.player_id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <PlayerLink
                        playerId={p.player_id}
                        name={p.steam_name}
                        avatarUrl={p.steam_avatar_url}
                      />
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', color: 'text.secondary' }}
                      >
                        {p.steam_id}
                      </Typography>
                    </TableCell>
                    <TableCell>{p.frags}</TableCell>
                    <TableCell>{p.deaths}</TableCell>
                    <TableCell>{p.average_ping}</TableCell>
                    <TableCell>{p.damage_dealt}</TableCell>
                    <TableCell>{p.damage_taken}</TableCell>
                    <TableCell>{pointsCell(p)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
