import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { type MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { PlayerSearch } from '@/components/layout/PlayerSearch';
import { ThemeSelector } from '@/components/layout/ThemeSelector';
import { CONTROL_HEIGHT, LAYOUT_MAX_WIDTH } from '@/lib/theme';
import { bevel } from '@/lib/vgui';

const NAV_LINKS = [
  { to: '/', labelKey: 'navbar.home', end: true },
  { to: '/leaderboard', labelKey: 'navbar.leaderboard', end: false },
  { to: '/docs', labelKey: 'navbar.docs', end: false },
];

export function Navbar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box
      component="nav"
      sx={(th) => ({
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 0.5,
        p: 0,
        mb: 2.5,
        width: '100%',
        maxWidth: LAYOUT_MAX_WIDTH,
        mx: 'auto',
        backgroundColor: th.vars.palette.surface,
        ...bevel(th, 'raised'),
      })}
    >
      <Box
        component={Link}
        to="/"
        sx={{ display: 'flex', alignItems: 'center', px: 1.25 }}
      >
        <Box
          component="img"
          src='/images/ag_logo_blue.png'
          alt="Adrenaline Gamer Logo"
          sx={{ height: 26, width: 'auto', display: 'block' }}
        />
      </Box>

      {!isMobile && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {NAV_LINKS.map((link) => (
            <Typography
              key={link.to}
              component={NavLink}
              to={link.to}
              end={link.end}
              sx={{
                display: 'block',
                px: 1.5,
                py: 0.75,
                lineHeight: '21px',
                color: 'text.secondary',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  color: 'secondary.main',
                  backgroundColor: 'surfaceLighter',
                },
                '&.active': {
                  color: 'primary.main',
                  fontWeight: 700,
                },
              }}
            >
              {t(link.labelKey)}
            </Typography>
          ))}
        </Box>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 0.5,
          height: CONTROL_HEIGHT,
        }}
      >
        <PlayerSearch />
        <LanguageSelector />
        <ThemeSelector />
      </Box>

      {isMobile && (
        <>
          <IconButton
            size="small"
            aria-label="menu"
            aria-controls={anchorElNav ? 'navbar-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorElNav ? 'true' : undefined}
            onClick={handleOpenNavMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="navbar-menu"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {NAV_LINKS.map((link) => (
              <MenuItem
                key={link.to}
                component={NavLink}
                to={link.to}
                end={link.end}
                onClick={handleCloseNavMenu}
              >
                {t(link.labelKey)}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
}
