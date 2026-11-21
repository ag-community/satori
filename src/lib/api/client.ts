import type { PlayerDto } from "./types.js"

export async function searchPlayers(value: string, signal?: AbortSignal): Promise<PlayerDto[]> {
  const params = new URLSearchParams({ value })
  const response = await fetch(`/api/search?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error(`Search request failed (${response.status})`)
  }

  return (await response.json()) as PlayerDto[]
}
