import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { insetPanel } from '@/lib/vgui';

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Box
      sx={(theme) => ({
        ...insetPanel(theme),
        borderRadius: theme.shape.borderRadius,
        m: 0,
        p: 1.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      })}
    >
      <Typography
        variant="body2"
        sx={{ m: 0, fontSize: 12, color: 'text.secondary' }}
      >
        {label}
      </Typography>
      <Typography variant="body1" sx={{ m: 0, fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}
