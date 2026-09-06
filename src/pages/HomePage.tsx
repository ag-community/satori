import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PlayerLink } from '@/components/PlayerLink';
import { Flag } from '@/components/ui/Flag';
import { SortableSections } from '@/components/ui/SortableSections';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/ViewStates';
import { api } from '@/lib/api/client';
import { env } from '@/lib/env';
import { usePageTitle } from '@/lib/usePageTitle';
import { insetPanel } from '@/lib/vgui';

interface ActionBox {
  titleKey: string;
  descKey: string;
  to?: string;
}

const ACTION_BOXES: ActionBox[] = [
  {
    titleKey: 'home.view_rankings',
    descKey: 'home.view_rankings_desc',
    to: '/leaderboard',
  },
  { titleKey: 'home.browse_matches', descKey: 'home.browse_matches_desc' },
  { titleKey: 'home.read_docs', descKey: 'home.read_docs_desc', to: '/docs' },
];

const SECTION_ORDER = [
  'welcome',
  'top_players',
  'stats',
  'open_source',
] as const;
type SectionId = (typeof SECTION_ORDER)[number];

export function HomePage() {
  const { t } = useTranslation();
  usePageTitle(t('title.home'));

  const { data, isLoading, error } = useQuery({
    queryKey: ['home-top-players'],
    queryFn: () => api.fetchLeaderboard({ size: 5, sortBy: 'Rating' }),
  });

  const statsItems = t('home.stats_items', { returnObjects: true }) as string[];

  const sections: Record<SectionId, { title: string; body: React.ReactNode }> =
    {
      welcome: {
        title: t('home.welcome'),
        body: (
          <>
            <Typography sx={{ mb: 1.5 }}>{t('home.subtitle')}</Typography>
            <Grid container spacing={1.5}>
              {ACTION_BOXES.map((box) => (
                <Grid key={box.titleKey} size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={(theme) => ({
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      px: 1.25,
                      py: 1.25,
                      ...insetPanel(theme),
                      borderRadius: theme.shape.borderRadius,
                    })}
                  >
                    {box.to ? (
                      <Typography
                        variant="h6"
                        component={Link}
                        to={box.to}
                        sx={{
                          mb: 1.5,
                          fontWeight: 700,
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': {
                            color: 'secondary.main',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {t(box.titleKey)}
                      </Typography>
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{ mb: 1.5, fontWeight: 700 }}
                      >
                        {t(box.titleKey)}
                      </Typography>
                    )}
                    <Typography color="text.secondary">
                      {t(box.descKey)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        ),
      },
      top_players: {
        title: t('home.top_players'),
        body: (
          <>
            {isLoading && <LoadingState />}
            {error && <ErrorState message={error.message} />}
            {data && data.records.length === 0 && (
              <EmptyState label={t('leaderboard.no_data')} />
            )}
            {data && data.records.length > 0 && (
              <Box
                sx={(theme) => ({
                  ...insetPanel(theme),
                  borderRadius: theme.shape.borderRadius,
                })}
              >
                {data.records.map((player, idx) => (
                  <Box
                    key={player.id}
                    sx={(theme) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 1.25,
                      py: 0.75,
                      borderTop:
                        idx > 0
                          ? `1px solid ${theme.vars.palette.divider}`
                          : 'none',
                    })}
                  >
                    <Typography sx={{ minWidth: 24, fontWeight: 700 }}>
                      #{idx + 1}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <PlayerLink
                        playerId={player.id}
                        name={player.steam_name}
                        avatarUrl={player.steam_avatar_url}
                      >
                        <Flag countryCode={player.country} />
                      </PlayerLink>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </>
        ),
      },
      stats: {
        title: t('home.stats_title'),
        body: (
          <>
            <Typography sx={{ mb: 1 }}>{t('home.stats_desc')}</Typography>
            <List dense disablePadding>
              {statsItems.map((item) => (
                <ListItem key={item} disableGutters sx={{ py: 0.25 }}>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ),
      },
      open_source: {
        title: t('home.open_source_title'),
        body: (
          <>
            <Typography sx={{ mb: 1 }}>{t('home.open_source_desc')}</Typography>
            {env.repoUrl && (
              <Typography>
                <Box
                  component="a"
                  href={env.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {t('home.open_source_github')}
                </Box>
              </Typography>
            )}
          </>
        ),
      },
    };

  return <SortableSections sections={sections} initialOrder={SECTION_ORDER} />;
}
