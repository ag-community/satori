import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { PlayerHistory } from '../../adapters/shion/player';

export const PlayerRatingChart = ({
  playerRatingHistory,
}: {
  playerRatingHistory: PlayerHistory | null;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const getChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        y: {
          display: true,
          ticks: {
            precision: 0,
          },
        },
        x: {
          display: false,
        },
      },
      plugins: {
        tooltip: {
          intersect: false,
        },
        legend: {
          display: false,
        },
      },
    } as const;
  };

  if (!playerRatingHistory || playerRatingHistory.captures.length === 0) {
    return (
      <>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {t('player.rating_progression')}
        </Typography>
        <Paper
          sx={{
            background: theme.palette.primary.main,
            borderRadius: 2,
            boxShadow: 'none',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              height: 231,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography align="center">{t('player.no_rating_data')}</Typography>
          </Box>
        </Paper>
      </>
    );
  }

  const captures = playerRatingHistory.captures;
  let chartLabels = [];
  let chartRatings = [];

  if (captures.length === 1) {
    const capture = captures[0];
    const date = capture.capturedAt.toLocaleDateString();

    chartLabels = [date, date];
    chartRatings = [capture.rating, capture.rating];
  } else {
    chartLabels = captures.map((capture) =>
      capture.capturedAt.toLocaleDateString(),
    );
    chartRatings = captures.map((capture) => capture.rating);
  }

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: t('player.rating'),
        data: chartRatings,
        borderColor: '#ffffff',
        tension: 0.5,
        borderWidth: 3,
      },
    ],
  };

  return (
    <>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {t('player.rating_progression')}
      </Typography>
      <Paper
        sx={{
          background: theme.palette.primary.main,
          borderRadius: 2,
          boxShadow: 'none',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: '231px',
            width: '100%',
          }}
        >
          <Line data={chartData} options={getChartOptions()} />
        </Box>
      </Paper>
    </>
  );
};
