import { redirect } from "@sveltejs/kit"
import { completeLogin, setSession } from "#lib/server/session.js"
import { verifySteam } from "#lib/server/shion/auth.js"
import type { RequestHandler } from "./$types"

const FAILURE_REDIRECT = "/settings?auth=failed"

export const GET: RequestHandler = async ({ url, cookies }) => {
  const params: Record<string, string> = {}
  for (const [key, value] of url.searchParams) {
    if (key.startsWith("openid.")) params[key] = value
  }

  const target = completeLogin(cookies, url.searchParams.get("state"), url.origin)
  if (params["openid.mode"] !== "id_res" || target === null) {
    throw redirect(303, FAILURE_REDIRECT)
  }

  try {
    const session = await verifySteam(params)
    setSession(cookies, session.token, session.expires_at)
  } catch {
    throw redirect(303, FAILURE_REDIRECT)
  }

  throw redirect(303, target)
}
