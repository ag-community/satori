import { shion } from "#lib/server/shion/client.js"
import type { SeasonDto } from "#lib/types.js"

export function fetchSeasons(): Promise<SeasonDto[]> {
  return shion<SeasonDto[]>("/seasons")
}
