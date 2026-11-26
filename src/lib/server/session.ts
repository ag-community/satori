import { randomBytes } from "node:crypto"
import type { Cookies } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
import type { AuthUserDto } from "#lib/api/types.js"
import { ShionError, shion } from "#lib/server/shion.js"

export const SESSION_COOKIE = "satori_session"
export const LOGIN_FLOW_COOKIE = "satori_login_flow"

const LOGIN_FLOW_TTL_SECONDS = 600

interface LoginFlow {
  state: string
  returnPath: string
}

export function getSessionToken(cookies: Cookies): string | null {
  return cookies.get(SESSION_COOKIE) ?? null
}

function resolveReturnPath(target: string | null | undefined, origin: string): string | null {
  if (!target) return null

  let url: URL
  try {
    url = new URL(target, origin)
  } catch {
    return null
  }

  if (url.origin !== origin) return null

  return `${url.pathname}${url.search}${url.hash}`
}

export function beginLogin(
  cookies: Cookies,
  target: string | null | undefined,
  origin: string
): string {
  const state = randomBytes(16).toString("base64url")
  const returnPath = resolveReturnPath(target, origin) ?? "/settings"
  const flow: LoginFlow = { state, returnPath }

  cookies.set(LOGIN_FLOW_COOKIE, JSON.stringify(flow), {
    path: "/",
    sameSite: "lax",
    maxAge: LOGIN_FLOW_TTL_SECONDS,
  })

  return state
}

export function completeLogin(
  cookies: Cookies,
  state: string | null | undefined,
  origin: string
): string | null {
  const raw = cookies.get(LOGIN_FLOW_COOKIE)
  cookies.delete(LOGIN_FLOW_COOKIE, { path: "/" })

  if (!raw || !state) return null

  let flow: LoginFlow
  try {
    flow = JSON.parse(raw) as LoginFlow
  } catch {
    return null
  }

  if (typeof flow.state !== "string" || typeof flow.returnPath !== "string") return null
  if (flow.state !== state) return null

  return resolveReturnPath(flow.returnPath, origin)
}

export function setSession(cookies: Cookies, token: string, expiresAt: string): void {
  const expires = new Date(expiresAt).getTime()
  const maxAge = Number.isFinite(expires)
    ? Math.max(Math.floor((expires - Date.now()) / 1000), 0)
    : undefined

  cookies.set(SESSION_COOKIE, token, { path: "/", sameSite: "lax", maxAge })
}

export function clearSession(cookies: Cookies): void {
  cookies.delete(SESSION_COOKIE, { path: "/" })
}

export async function getSessionUser(cookies: Cookies): Promise<AuthUserDto | null> {
  const token = getSessionToken(cookies)
  if (!token) return null

  try {
    return await shion<AuthUserDto>("/auth/me", { token })
  } catch (error) {
    if (error instanceof ShionError && (error.status === 401 || error.status === 404)) {
      clearSession(cookies)
    }
    return null
  }
}

export async function requireSession(
  cookies: Cookies
): Promise<{ token: string; user: AuthUserDto }> {
  const token = getSessionToken(cookies)
  const user = token ? await getSessionUser(cookies) : null

  if (!token || !user) {
    clearSession(cookies)
    throw redirect(303, "/settings")
  }

  return { token, user }
}
