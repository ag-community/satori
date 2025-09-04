import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSelector } from './LanguageSelector';

const pages = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Leaderboard', icon: <LeaderboardIcon />, path: '/leaderboard' },
];

export const BANNER_HEIGHT = 35;

export function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const id = useId();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: theme.palette.primary.main,
        borderRadius: 0,
        mb: 3,
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'flex-start', sm: 'center' },
            flexGrow: { xs: 1, sm: 0 },
            mr: 2,
            textDecoration: 'none',
          }}
        >
          <Box
            component="img"
            src={`${process.env.ASSET_PREFIX}/images/ag_logo_blue.png`}
            alt="Adrenaline Gamer Logo"
            sx={{
              height: 40,
              width: 'auto',
            }}
          />
        </Box>

        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={Link}
                to={page.path}
                startIcon={page.icon}
                sx={{
                  my: 1,
                  mx: 1,
                  color:
                    location.pathname === page.path
                      ? theme.palette.secondary.main
                      : 'white',
                  fontWeight: location.pathname === page.path ? 700 : 500,
                  background:
                    location.pathname === page.path
                      ? `${theme.palette.secondary.main}22`
                      : 'transparent',
                  borderRadius: 2,
                  '&:hover': {
                    background: `${theme.palette.secondary.main}22`,
                  },
                  textTransform: 'none',
                }}
              >
                {t(`navbar.${page.label.toLowerCase()}`) || page.label}
              </Button>
            ))}
          </Box>
        )}

        <LanguageSelector />

        {/* Mobile Menu */}
        {isMobile && (
          <>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id={id}
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.label}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  selected={location.pathname === page.path}
                >
                  <Box mr={1}>{page.icon}</Box>
                  {t(`navbar.${page.label.toLowerCase()}`) || page.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Toolbar>
      {/* Dev Warning Banner */}
      <Box
        sx={{
          width: '100%',
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.common.white,
          textAlign: 'center',
          fontWeight: 700,
          letterSpacing: 0.5,
          fontSize: { xs: 14, sm: 16 },
          height: `${BANNER_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {t('banner.dev_warning')}
      </Box>
    </AppBar>
  );
}
