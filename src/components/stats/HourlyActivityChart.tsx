import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { HourlyActivity } from '../../adapters/shion/stats';

export const HourlyActivityChart = ({ data }: { data: HourlyActivity[] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: t('stats.matches'),
        data: Array.from({ length: 24 }, (_, i) => {
          const found = data.find((h) => h.hour === i);
          return found ? found.count : 0;
        }),
        backgroundColor: theme.palette.secondary.main,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { ticks: { precision: 0 }, beginAtZero: true },
      x: { ticks: { color: theme.palette.text.secondary } },
    },
    plugins: {
      tooltip: { intersect: true },
      legend: { display: false },
    },
  } as const;

  return (
    <Paper
      elevation={0}
      sx={{
        background: theme.palette.background.paper,
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} mb={1}>
        {t('stats.hourly_activity')}
      </Typography>
      <Box
        sx={{ position: 'relative', flex: 1, minHeight: 200, width: '100%' }}
      >
        {data.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography align="center">{t('common.loading')}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
