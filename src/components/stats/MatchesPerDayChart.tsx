import { Box, Paper, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { MatchesPerDay } from '../../adapters/shion/stats';

export const MatchesPerDayChart = ({ data }: { data: MatchesPerDay[] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const chartData = {
    labels: data.map((d) => moment(d.date).format('MMM D')),
    datasets: [
      {
        label: t('stats.matches'),
        data: data.map((d) => d.count),
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main + '1A',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { point: { radius: 0 } },
    scales: {
      y: { ticks: { precision: 0 }, beginAtZero: true },
      x: {
        display: true,
        ticks: { color: theme.palette.text.secondary, maxTicksLimit: 8 },
      },
    },
    plugins: {
      tooltip: { intersect: false, mode: 'index' },
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
        {t('stats.matches_per_day')}
      </Typography>
      <Box
        sx={{ position: 'relative', flex: 1, minHeight: 200, width: '100%' }}
      >
        {data.length > 0 ? (
          <Line data={chartData} options={options} />
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
