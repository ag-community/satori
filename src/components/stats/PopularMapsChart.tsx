import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { PopularMap } from '../../adapters/shion/stats';

export const PopularMapsChart = ({ data }: { data: PopularMap[] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const chartData = {
    labels: data.map((m) => m.mapName),
    datasets: [
      {
        label: t('stats.matches'),
        data: data.map((m) => m.count),
        backgroundColor: theme.palette.secondary.main,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      y: {
        ticks: {
          color: theme.palette.text.secondary,
          autoSkip: false,
          font: { size: 11 },
        },
      },
      x: { ticks: { precision: 0 }, beginAtZero: true },
    },
    plugins: {
      tooltip: { intersect: true },
      legend: { display: false },
    },
  } as const;

  return (
    <Paper
      elevation={0}
      sx={{ background: theme.palette.background.paper, borderRadius: 2, p: 2 }}
    >
      <Typography variant="subtitle1" fontWeight={700} mb={1}>
        {t('stats.popular_maps')}
      </Typography>
      <Box
        sx={{
          position: 'relative',
          height: Math.max(200, data.length * 35),
          width: '100%',
        }}
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
