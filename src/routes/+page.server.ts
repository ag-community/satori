import type { PageResult, PlayerDto } from "#lib/api/types.js"
import { shion } from "#lib/server/shion.js"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  try {
    const top = await shion<PageResult<PlayerDto>>("/players/leaderboard", {
      size: 5,
      sort_by: "Points",
    })
    return { topPlayers: top.records, error: null }
  } catch (error) {
    return {
      topPlayers: [] as PlayerDto[],
      error: error instanceof Error ? error.message : "Failed to load leaderboard",
    }
  }
}
