import { json } from "@sveltejs/kit"
import type { PlayerDto } from "#lib/api/types.js"
import { shion } from "#lib/server/shion.js"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = async ({ url }) => {
  const value = url.searchParams.get("value")?.trim() ?? ""
  if (value.length < 2) return json([])

  try {
    const players = await shion<PlayerDto[]>("/players/search", { params: { value, limit: 8 } })
    return json(players)
  } catch {
    return json([])
  }
}
