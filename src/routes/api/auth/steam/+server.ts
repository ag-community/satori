import { redirect } from "@sveltejs/kit"
import { beginLogin } from "#lib/server/session.js"
import type { RequestHandler } from "./$types"

const STEAM_OPENID_ENDPOINT = "https://steamcommunity.com/openid/login"

export const GET: RequestHandler = ({ url, cookies }) => {
  const origin = url.origin
  const state = beginLogin(cookies, url.searchParams.get("redirect"), origin)

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": `${origin}/api/auth/steam/callback?state=${encodeURIComponent(state)}`,
    "openid.realm": `${origin}/`,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  })

  throw redirect(303, `${STEAM_OPENID_ENDPOINT}?${params.toString()}`, { external: true })
}
