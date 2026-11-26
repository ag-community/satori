import { redirect } from "@sveltejs/kit"
import { clearSession, getSessionToken } from "#lib/server/session.js"
import { shion } from "#lib/server/shion.js"
import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ cookies }) => {
  const token = getSessionToken(cookies)

  if (token) {
    try {
      await shion<boolean>("/auth/logout", { method: "POST", token })
    } catch {
      // The cookie is cleared regardless of the backend response.
    }
  }

  clearSession(cookies)
  throw redirect(303, "/")
}
