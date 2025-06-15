import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchPlayer, Player, Match } from "../adapters/agmmr-api/player"
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
} from "@mui/material"
import { CardSection } from "../components/CardSection"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import IconButton from "@mui/material/IconButton"

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
  const queryParams = useParams()
  const profilePlayerId = getPlayerIdFromQueryParams(queryParams["playerId"])
  const [playerProfile, setPlayerProfile] = useState<Player | null>(null)
  const [error, setError] = useState("")

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
                label={`MMR: ${playerProfile.mmr}`}
                color="secondary"
                sx={{ fontWeight: 700, fontSize: 16 }}
              />
            </Box>
          </Box>
        </Box>
      </CardSection>

      <CardSection sx={{ mt: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Match History
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
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Map</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Frags</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Deaths</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>MMR Δ</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>MMR After</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="center"></TableCell> {/* Nueva columna para el icono */}
              </TableRow>
            </TableHead>
            <TableBody>
              {playerProfile.matchHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ color: "white", textAlign: "center" }}>
                    No matches found.
                  </TableCell>
                </TableRow>
              )}
              {playerProfile.matchHistory.map((match: Match) => (
                <TableRow key={match.matchId}>
                  <TableCell sx={{ color: "white" }}>
                    {new Date(match.matchDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{match.mapName}</TableCell>
                  <TableCell sx={{ color: "white" }}>{match.stats.frags}</TableCell>
                  <TableCell sx={{ color: "white" }}>{match.stats.deaths}</TableCell>
                  <TableCell
                    sx={{
                      color: match.mmrDelta >= 0 ? "#4CFF4C" : "#FF4C4C",
                      fontWeight: 700,
                    }}
                  >
                    {match.mmrDelta >= 0 ? "+" : ""}
                    {match.mmrDelta}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{match.mmrAfterMatch}</TableCell>
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
        </TableContainer>
      </CardSection>
    </Box>
  )
}
