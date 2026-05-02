import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CardSection } from '../components/CardSection';
import { GlobalLeaderboardPlayer } from '../components/leaderboard/GlobalLeaderboardPlayer';
import { ALPHA2_COUNTRY_LIST, getFlagUrl } from '../utils/countries';

export const LeaderboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('rating');
  const [country, setCountry] = useState('all');

  const countryOptions = Object.entries(ALPHA2_COUNTRY_LIST)
    .filter(([code]) => code !== 'XX')
    .sort(([, a], [, b]) => a.localeCompare(b));

  useEffect(() => {
    document.title = t('title.leaderboard');
  }, [t]);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          flexWrap="wrap"
          gap={1}
        >
          <Box display="flex" alignItems="center">
            <EmojiEventsIcon color="secondary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={700}>
              {t('leaderboard.global')}
            </Typography>
          </Box>

          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel
                sx={{
                  color: 'grey.500',
                  '&.Mui-focused': { color: '#4C94FF' },
                  '&.MuiInputLabel-shrink': { color: '#4C94FF' },
                }}
              >
                {t('leaderboard.filter_sort')}
              </InputLabel>
              <Select
                value={sortBy}
                label={t('leaderboard.filter_sort')}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4C94FF',
                  },
                }}
              >
                <MenuItem value="rating">
                  {t('leaderboard.filter_sort_rating')}
                </MenuItem>
                <MenuItem value="win_rate">
                  {t('leaderboard.filter_sort_winrate')}
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel
                sx={{
                  color: 'grey.500',
                  '&.Mui-focused': { color: '#4C94FF' },
                  '&.MuiInputLabel-shrink': { color: '#4C94FF' },
                }}
              >
                {t('leaderboard.filter_country')}
              </InputLabel>
              <Select
                value={country}
                label={t('leaderboard.filter_country')}
                onChange={(e) => setCountry(e.target.value)}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4C94FF',
                  },
                }}
              >
                <MenuItem value="all">
                  {t('leaderboard.all_countries')}
                </MenuItem>
                {countryOptions.map(([code, name]) => (
                  <MenuItem key={code} value={code}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        component="img"
                        src={getFlagUrl(code)}
                        sx={{ height: 16 }}
                      />
                      {name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <GlobalLeaderboardPlayer
          isMobile={isMobile}
          onError={handleError}
          sortBy={sortBy}
          country={country === 'all' ? '' : country}
        />
      </CardSection>
    </Box>
  );
};
