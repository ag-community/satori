import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchPlayer, Player, Match, fetchPlayerMatches } from "../adapters/shion/player"
import {
  Alert,
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Divider,
  useTheme,
  TablePagination,
} from "@mui/material"
import { CardSection } from "../components/CardSection"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import IconButton from "@mui/material/IconButton"
import { useTranslation } from "react-i18next"

const getPlayerIdFromQueryParams = (identifier?: string): number => {
  let userId = parseInt(identifier || "")
  if (isNaN(userId)) {
    // TODO: do API lookup
    userId = 0
  }
  return userId
}

export const PlayerPage = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const queryParams = useParams()
  const profilePlayerId = getPlayerIdFromQueryParams(queryParams["playerId"])
  const [playerProfile, setPlayerProfile] = useState<Player | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    ;(async () => {
      if (!profilePlayerId) return
      try {
        const playerResponse = await fetchPlayer(profilePlayerId)
        setPlayerProfile(playerResponse)
        setError("")
      } catch (e: any) {
        setError("Failed to fetch user profile data from server")
      }
    })()
  }, [profilePlayerId])

  useEffect(() => {
    ;(async () => {
      if (!profilePlayerId) return
      try {
        const matchesResponse = await fetchPlayerMatches(profilePlayerId, page + 1, pageSize)
        setMatches(matchesResponse)
      } catch (e: any) {
        setError("Failed to fetch player match history")
      }
    })()
  }, [profilePlayerId, page, pageSize])

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (!profilePlayerId) {
    return (
      <Typography variant="h2">
        Must provide an account id in the path.
      </Typography>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Something went wrong while loading the page: {error}
      </Alert>
    )
  }

  if (!playerProfile) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Loading player data...
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        py: 4,
        px: 2,
      }}
    >
      <CardSection>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={playerProfile.avatarURL}
            alt={playerProfile.steamName}
            sx={{ width: 64, height: 64, mr: 2, border: "2px solid #4C94FF" }}
          />
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {playerProfile.steamName}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 16 }}>
              SteamID: <b>{playerProfile.steamID}</b>
            </Typography>
            <Box mt={1}>
              <Chip
                icon={<EmojiEventsIcon color="secondary" />}
                label={`${t("leaderboard.rating")}: ${playerProfile.rating}`}
                color="secondary"
                sx={{ fontWeight: 700, fontSize: 16 }}
              />
            </Box>
          </Box>
        </Box>
      </CardSection>

      <CardSection sx={{ mt: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {t("player.match_history")}
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            background: theme.palette.primary.main,
            borderRadius: 2,
            boxShadow: "none",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>{t("player.date")}</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>{t("player.map")}</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>{t("match.frags")}</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>{t("match.deaths")}</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  {t("player.rating_gained")}
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  {t("player.rating")}
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ color: "white", textAlign: "center" }}>
                    {t("player.no_matches")}
                  </TableCell>
                </TableRow>
              )}
              {matches.map((match: Match) => (
                <TableRow key={match.matchId}>
                  <TableCell sx={{ color: "white" }}>
                    {new Date(match.matchDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{match.mapName}</TableCell>
                  <TableCell sx={{ color: "white" }}>{match.frags}</TableCell>
                  <TableCell sx={{ color: "white" }}>{match.deaths}</TableCell>
                  <TableCell
                    sx={{
                      color: match.ratingDelta >= 0 ? "#4CFF4C" : "#FF4C4C",
                      fontWeight: 700,
                    }}
                  >
                    {match.ratingDelta >= 0 ? "+" : ""}
                    {match.ratingDelta}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{match.ratingAfterMatch}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      component={Link}
                      to={`/match/${match.matchId}`}
                      size="small"
                      sx={{ color: "#4C94FF" }}
                    >
                      <InfoOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={-1}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{
              color: "white",
              ".MuiTablePagination-toolbar": { color: "white" },
              ".MuiTablePagination-selectIcon": { color: "white" },
              ".MuiTablePagination-actions": { color: "white" },
            }}
          />
        </TableContainer>
      </CardSection>
    </Box>
  )
}
