import { fetchGame } from "#lib/server/shion/games.js"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.gameId)
  const invalidId = !Number.isInteger(id) || id <= 0

  if (invalidId) {
    return { game: null, error: null, invalidId }
  }

  try {
    const game = await fetchGame(id)

    return { game, error: null, invalidId }
  } catch (error) {
    return {
      game: null,
      error: error instanceof Error ? error.message : "Failed to load match",
      invalidId,
    }
  }
}
