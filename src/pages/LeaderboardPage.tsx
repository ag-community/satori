import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  useTheme,
  TablePagination,
} from "@mui/material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import { CardSection } from "../components/CardSection"
import { useTranslation } from "react-i18next"
import {
  fetchLeaderboard,
  LeaderboardPlayer,
} from "../adapters/agmmr-api/leaderboard"
import { useEffect, useState } from "react"

export const LeaderboardPage = () => {
  const theme = useTheme()
  const { t } = useTranslation()

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(50)
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardPlayer[] | null
  >(null)

  useEffect(() => {
    ;(async () => {
      try {
        const leaderboardResponse = await fetchLeaderboard(page + 1, pageSize)
        setLeaderboardData(leaderboardResponse)
        console.log("Leaderboard data fetched successfully:", leaderboardResponse)
      } catch (error) {
        console.error("Failed to fetch data from server: ", error)
        return
      }
    })()
  }, [page, pageSize])

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        py: 4,
        px: 2,
      }}
    >
      <CardSection>
        <Box display="flex" alignItems="center" mb={2}>
          <EmojiEventsIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700}>
            {t("leaderboard.global")}
          </Typography>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            background: theme.palette.primary.main,
            borderRadius: 2,
            boxShadow: "none",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  {t("leaderboard.rank")}
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  {t("leaderboard.player")}
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  {t("leaderboard.steam_id")}
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  {t("leaderboard.rating")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData?.map((row, idx) => (
                <TableRow
                  key={row.player + idx}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    background: theme.palette.primary.main,
                  }}
                >
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    #{page * pageSize + idx + 1}
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", display: "flex", alignItems: "center" }}
                  >
                    <Avatar
                      src={row.avatarURL}
                      alt={row.player}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    {row.player}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {row.steamID}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    {row.rating}
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
