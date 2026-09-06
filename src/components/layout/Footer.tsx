import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { LAYOUT_MAX_WIDTH } from '@/lib/theme';
import { bevel } from '@/lib/vgui';

export function Footer() {
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        width: '100%',
        maxWidth: LAYOUT_MAX_WIDTH,
        mx: 'auto',
        mt: 2.5,
        px: 1.25,
        py: 1.25,
        backgroundColor: theme.vars.palette.surface,
        ...bevel(theme, 'raised'),
      })}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 0.75,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ m: 0, color: 'text.secondary' }}>
          {t('footer.made_by')} <b>7mochi</b>
        </Typography>
        <Typography variant="body2" sx={{ m: 0, color: 'text.secondary' }}>
          ·
        </Typography>
        <Typography variant="body2" sx={{ m: 0, color: 'text.secondary' }}>
          {t('footer.based_on')}{' '}
          <Box
            component="a"
            href="https://github.com/leonill007/vgui.css"
            target="_blank"
            rel="noreferrer"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            vgui.css
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
