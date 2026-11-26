import { searchPlayers } from "#lib/server/shion/players.js"
import { query } from "$app/server"

export const search = query("unchecked", async (value: string) => {
  const trimmed = value.trim()
  if (trimmed.length < 2) return []

  return searchPlayers(trimmed, 8)
})
