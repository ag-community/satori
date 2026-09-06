import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { LAYOUT_MAX_WIDTH } from '@/lib/theme';

export function Layout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        p: 2.5,
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: LAYOUT_MAX_WIDTH,
          mx: 'auto',
          px: { xs: 1.5, sm: 0 },
          py: 0,
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
