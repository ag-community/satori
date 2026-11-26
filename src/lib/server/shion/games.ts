import { shion } from "#lib/server/shion/client.js"
import type { GameDto } from "#lib/types.js"

export function fetchGame(id: number): Promise<GameDto> {
  return shion<GameDto>(`/games/${id}`)
}
