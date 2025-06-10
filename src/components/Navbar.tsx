import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";

const pages = [
  { label: "Home", icon: <HomeIcon />, path: "/" },
  { label: "Leaderboard", icon: <LeaderboardIcon />, path: "/leaderboard" },
];

export function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: theme.palette.primary.main,
        borderRadius: 0,
        mb: 3,
      }}
    >
      <Toolbar>
        {/* Logo or Title */}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            color: theme.palette.secondary.main,
            textDecoration: "none",
            fontWeight: 800,
            flexGrow: { xs: 1, sm: 0 },
            mr: 2,
          }}
        >
          Logo here
        </Typography>

        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: "flex" }}>
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
                      : "white",
                  fontWeight: location.pathname === page.path ? 700 : 500,
                  background:
                    location.pathname === page.path
                      ? theme.palette.secondary.main + "22"
                      : "transparent",
                  borderRadius: 2,
                  "&:hover": {
                    background: theme.palette.secondary.main + "22",
                  },
                  textTransform: "none",
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
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
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
    </AppBar>
  );
}