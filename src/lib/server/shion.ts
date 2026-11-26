import { SHION_API_BASE_URL } from "$app/env/private"

interface ApiResponse<T> {
  status: string
  message: string | null
  data: T | null
}

export class ShionError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "ShionError"
  }
}

interface ShionOptions {
  params?: Record<string, string | number | boolean | undefined>
  method?: "GET" | "POST" | "PUT"
  body?: unknown
  token?: string | null
}

function buildUrl(path: string, params: Record<string, string | number | boolean | undefined>) {
  const base = SHION_API_BASE_URL.replace(/\/+$/, "")
  const url = new URL(`${base}${path}`)

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  return url
}

async function errorMessage(response: Response, path: string): Promise<string> {
  try {
    const body = (await response.json()) as ApiResponse<unknown>
    if (typeof body.message === "string" && body.message.length > 0) return body.message
  } catch {
    // A malformed body shouldn't hide the HTTP status.
  }

  return `Shion API returned ${response.status} for ${path}`
}

export async function shion<T>(path: string, options: ShionOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" }

  if (options.body !== undefined) headers["Content-Type"] = "application/json"
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  const response = await fetch(buildUrl(path, options.params ?? {}), {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (!response.ok) throw new ShionError(await errorMessage(response, path), response.status)

  const body = (await response.json()) as ApiResponse<T>
  if (body.status !== "success" || body.data === null) {
    throw new ShionError(body.message ?? `Shion API error for ${path}`, response.status)
  }

  return body.data
}
