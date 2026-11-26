import { fetchLeaderboard } from "#lib/server/shion/players.js"
import type { PlayerDto } from "#lib/types.js"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  try {
    const top = await fetchLeaderboard({ size: 5, sortBy: "Points" })
    return { topPlayers: top.records, error: null }
  } catch (error) {
    return {
      topPlayers: [] as PlayerDto[],
      error: error instanceof Error ? error.message : "Failed to load leaderboard",
    }
  }
}
