import { SHION_API_BASE_URL } from "$app/env/private"

interface ApiResponse<T> {
  status: string
  message: string | null
  data: T | null
}

export async function shion<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const base = SHION_API_BASE_URL.replace(/\/+$/, "")
  const url = new URL(`${base}${path}`)

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Shion API returned ${response.status} for ${path}`)
  }

  const body = (await response.json()) as ApiResponse<T>
  if (body.status !== "success" || body.data === null) {
    throw new Error(body.message ?? `Shion API error for ${path}`)
  }

  return body.data
}
