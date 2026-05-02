import { Box, Paper, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

export function StatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        background: theme.palette.background.paper,
        borderRadius: 2,
        p: 2,
        textAlign: 'center',
      }}
    >
      <Box sx={{ mb: 0.5 }}>{icon}</Box>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
}
