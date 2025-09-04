import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Avatar, Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Player } from '../../adapters/shion/player';

export const PlayerProfile = ({ playerProfile }: { playerProfile: Player }) => {
  const { t } = useTranslation();

  return (
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
  );
};
