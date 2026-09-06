import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { SortableSections } from '@/components/ui/SortableSections';
import { usePageTitle } from '@/lib/usePageTitle';

export function NotFoundPage() {
  const { t } = useTranslation();
  usePageTitle(t('title.not_found'));

  const body: ReactNode = (
    <>
      <Typography variant="body1" sx={{ m: 0, mb: 1.5 }}>
        {t('common.not_found')}
      </Typography>
      <Button component={Link} to="/" variant="contained">
        {t('common.back_home')}
      </Button>
    </>
  );

  return (
    <SortableSections
      sections={{ not_found: { title: '404', body } }}
      initialOrder={['not_found']}
    />
  );
}
