import Box from '@mui/material/Box';
import { type Theme, useColorScheme, useTheme } from '@mui/material/styles';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import type { RatingHistoryDto } from '@/lib/api/types';
import { formatShortDate } from '@/lib/format';
import { cssColor } from '@/lib/vgui';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface PointsChartProps {
  history: RatingHistoryDto[];
}

interface ChartColors {
  text: string;
  grid: string;
  line: string;
  fill: string;
}

function resolveColors(theme: Theme): ChartColors {
  const text = cssColor(
    '--mui-palette-text-primary',
    theme.palette.text.primary,
  );
  const grid = cssColor('--mui-palette-divider', theme.palette.divider);
  const line = cssColor(
    '--mui-palette-primary-main',
    theme.palette.primary.main,
  );
  const fallbackChannel = theme.palette.primary.mainChannel ?? '196 181 80';
  const channel = cssColor(
    '--mui-palette-primary-mainChannel',
    fallbackChannel,
  );
  return { text, grid, line, fill: `rgba(${channel} / 0.25)` };
}

export function PointsChart({ history }: PointsChartProps) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  const [colors, setColors] = useState<ChartColors>(() => resolveColors(theme));

  // biome-ignore lint/correctness/useExhaustiveDependencies: colors re-resolve on skin change via cssColor (DOM)
  useEffect(() => {
    setColors(resolveColors(theme));
  }, [colorScheme, theme]);

  if (history.length === 0) {
    return <p>{t('player.no_points_data')}</p>;
  }

  let chartLabels: string[];
  let chartRatings: number[];

  if (history.length === 1) {
    const capture = history[0];
    const date = formatShortDate(capture.captured_at);
    chartLabels = [date, date];
    chartRatings = [capture.points, capture.points];
  } else {
    chartLabels = history.map((capture) =>
      formatShortDate(capture.captured_at),
    );
    chartRatings = history.map((capture) => capture.points);
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: colors.text,
          maxTicksLimit: 8,
        },
        grid: {
          color: colors.grid,
        },
      },
      y: {
        display: true,
        ticks: {
          color: colors.text,
          precision: 0,
        },
        grid: {
          color: colors.grid,
        },
      },
    },
    plugins: {
      tooltip: {
        intersect: false,
        mode: 'index' as const,
      },
      legend: {
        display: false,
      },
    },
  };

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: t('player.points'),
        data: chartRatings,
        borderColor: colors.line,
        backgroundColor: colors.fill,
        fill: true,
        tension: 0.5,
        borderWidth: 3,
      },
    ],
  };

  return (
    <Box sx={{ position: 'relative', height: 231, width: '100%' }}>
      <Line data={chartData} options={options} />
    </Box>
  );
}
