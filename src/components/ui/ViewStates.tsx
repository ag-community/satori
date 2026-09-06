import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/Card';

export function LoadingState({ label }: { label?: string }) {
  const { t } = useTranslation();
  const text = label ?? t('common.loading');
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1 }}>
      <CircularProgress size={18} />
      <Typography variant="body2" sx={{ m: 0 }}>
        {text}
      </Typography>
    </Box>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Card variant="inset">
      <Typography variant="body2" sx={{ m: 0, color: 'error.main' }}>
        {message}
      </Typography>
    </Card>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <Card variant="inset">
      <Typography variant="body2" sx={{ m: 0 }}>
        {label}
      </Typography>
    </Card>
  );
}
