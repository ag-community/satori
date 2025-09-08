import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  debounce,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { type Player, searchPlayers } from '../adapters/shion/player';
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
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryOptions, setSearchQueryOptions] = useState<Player[] | null>(
    [],
  );
  const [searchQueryValue, setSearchQueryValue] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const searchForPlayers = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) return;

        setLoading(true);
        setError(null);

        try {
          const response = await searchPlayers({ query });
          setSearchQueryOptions(response);
        } catch (_err) {
          setError(t('navbar.search_error'));
          setSearchQueryOptions([]);
        } finally {
          setLoading(false);
        }
      }, 400),
    [t],
  );

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchQueryOptions([]);
      setLoading(false);
      return;
    }

    searchForPlayers(searchQuery);
  }, [searchQuery, searchForPlayers]);

  const id = useId();

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: Player,
  ) => (
    <li {...props}>
      <Box display="flex" alignItems="center" width="100%">
        <Box
          component="img"
          src={option.avatarURL}
          alt=""
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            mr: 1,
          }}
        />
        <Box>
          <Typography variant="body1">{option.steamName}</Typography>
        </Box>
      </Box>
    </li>
  );

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

        <Autocomplete
          id={id}
          sx={{ width: 225 }}
          filterOptions={(x) => x}
          value={searchQueryValue}
          options={searchQueryOptions ?? []}
          getOptionLabel={(option) => option.steamName}
          isOptionEqualToValue={(option, value) =>
            option.steamName === value.steamName ||
            option.steamID === value.steamID
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('navbar.search')}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                ),
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              helperText={error}
              error={!!error}
            />
          )}
          renderOption={renderOption}
          onInputChange={(_event, newInputValue: string) =>
            setSearchQuery(newInputValue)
          }
          onChange={(_event, newValue) => {
            if (newValue === null) return;
            setSearchQueryValue(newValue);
            setSearchQueryOptions([newValue]);
            navigate(`/player/${newValue.id}`);
          }}
          noOptionsText={
            searchQuery.length < 2
              ? t('navbar.type_more')
              : t('navbar.no_results')
          }
          loading={loading}
          loadingText={t('navbar.searching')}
        />

        <LanguageSelector />
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
