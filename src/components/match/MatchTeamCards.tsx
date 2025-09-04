import { Avatar, Box, Card, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { MatchDetails } from '../../adapters/shion/match';

export const MatchTeamCards = ({ players }: { players: MatchDetails[] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 2 }}>
      {players.map((player) => (
        <Card
          key={player.playerId}
          sx={{
            mb: 1.5,
            bgcolor: theme.palette.primary.main,
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
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <Avatar
              src={player.playerAvatarUrl}
              alt={player.playerSteamName}
              sx={{ width: 32, height: 32, mr: 1.5 }}
            />
            <Box>
              <Link
                to={`/player/${player.playerId}`}
                style={{
                  color: '#4C94FF',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                }}
              >
                {player.playerSteamName}
              </Link>
              <Typography
                variant="caption"
                sx={{ color: 'gray', display: 'block' }}
              >
                {player.playerSteamID}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                mb: 1,
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'gray',
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {t('match.frags')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'gray',
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {t('match.deaths')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'gray',
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {t('match.avg_ping')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'gray',
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {t('match.damage_dealt')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'gray',
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {t('match.damage_taken')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'gray',
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {t('match.gained_points')}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {player.frags}
              </Typography>
              <Typography
                sx={{
                  color: 'white',
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {player.deaths}
              </Typography>
              <Typography
                sx={{
                  color: 'white',
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {player.averagePing}
              </Typography>
              <Typography
                sx={{
                  color: 'white',
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {player.damageDealt}
              </Typography>
              <Typography
                sx={{
                  color: 'white',
                  flex: 1,
                  textAlign: 'center',
                  mr: 1,
                }}
              >
                {player.damageTaken}
              </Typography>
              <Typography
                sx={{
                  color: player.ratingDelta >= 0 ? '#4CFF4C' : '#FF4C4C',
                  fontWeight: 700,
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {player.ratingDelta >= 0 ? '+' : ''}
                {player.ratingDelta}
              </Typography>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
};
