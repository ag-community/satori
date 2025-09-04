import { Alert, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { fetchMatch, type Match } from '../adapters/shion/match';
import { CardSection } from '../components/CardSection';
import { MatchBanner } from '../components/match/MatchBanner';
import { MatchTeamCards } from '../components/match/MatchTeamCards';
import { MatchTeamHeader } from '../components/match/MatchTeamHeader';
import { MatchTeamTable } from '../components/match/MatchTeamTable';

const getMatchIdFromQueryParams = (identifier?: string): number => {
  let matchId = parseInt(identifier || '', 10);
  if (Number.isNaN(matchId)) {
    // TODO: do API lookup
    matchId = 0;
  }
  return matchId;
};

export const MatchPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryParams = useParams();
  const matchId = getMatchIdFromQueryParams(queryParams.matchId);
  const [matchData, setMatchData] = useState<Match | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = t('title.match', { matchId });
  }, [t, matchId]);

  useEffect(() => {
    (async () => {
      if (!matchId) return;
      try {
        const matchResponse = await fetchMatch(matchId);
        setMatchData(matchResponse);
        setError('');
      } catch (_error) {
        setError('Failed to fetch match data from server.');
      }
    })();
  }, [matchId]);

  if (!matchId) {
    return (
      <Typography variant="h2">Must provide a match id in the path.</Typography>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Something went wrong while loading the page: {error}
      </Alert>
    );
  }

  if (!matchData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Loading match data...
        </Typography>
      </Box>
    );
  }

  const bluePlayers = matchData.matchDetails.filter((p) => p.model === 'blue');
  const redPlayers = matchData.matchDetails.filter((p) => p.model === 'red');

  const matchType = `${bluePlayers.length}vs${redPlayers.length}`;

  const blueFrags = bluePlayers.reduce((sum, p) => sum + p.frags, 0);
  const blueDeaths = bluePlayers.reduce((sum, p) => sum + p.deaths, 0);
  const redFrags = redPlayers.reduce((sum, p) => sum + p.frags, 0);
  const redDeaths = redPlayers.reduce((sum, p) => sum + p.deaths, 0);

  const blueIsWinner = blueFrags > redFrags;
  const redIsWinner = redFrags > blueFrags;

  const bluePlayersSorted = [...bluePlayers].sort((a, b) => b.frags - a.frags);
  const redPlayersSorted = [...redPlayers].sort((a, b) => b.frags - a.frags);

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        py: 4,
        px: 2,
      }}
    >
      <MatchBanner matchData={matchData} matchType={matchType} />

      <CardSection>
        <MatchTeamHeader
          teamName={t('match.blue_team')}
          isWinner={blueIsWinner}
          teamColor={theme.palette.success.main}
          totalFrags={blueFrags}
          totalDeaths={blueDeaths}
          isMobile={isMobile}
        />
        {isMobile ? (
          <MatchTeamCards players={bluePlayersSorted} />
        ) : (
          <MatchTeamTable players={bluePlayersSorted} />
        )}

        <MatchTeamHeader
          teamName={t('match.red_team')}
          isWinner={redIsWinner}
          teamColor={theme.palette.error.main}
          totalFrags={redFrags}
          totalDeaths={redDeaths}
          isMobile={isMobile}
        />
        {isMobile ? (
          <MatchTeamCards players={redPlayersSorted} />
        ) : (
          <MatchTeamTable players={redPlayersSorted} />
        )}
      </CardSection>
    </Box>
  );
};
