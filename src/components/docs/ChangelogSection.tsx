import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

const VERSIONS = ['v1', 'v2', 'v3'] as const;

export const ChangelogSection = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {t('docs.changelog.title')}
      </Typography>

      {VERSIONS.map((v) => (
        <Paper
          key={v}
          elevation={0}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: 2,
            p: 2,
            mb: 2,
            borderLeft: `4px solid ${
              v === VERSIONS[VERSIONS.length - 1]
                ? theme.palette.secondary.main
                : 'grey.700'
            }`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography fontWeight={700}>
              {t(`docs.changelog.${v}.title`)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'grey.500', fontFamily: 'monospace' }}
            >
              {t(`docs.changelog.${v}.date`)}
            </Typography>
          </Box>

          <Typography color="text.secondary">
            {t(`docs.changelog.${v}.desc`)}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};
