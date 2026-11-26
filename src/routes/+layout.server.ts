import { getSessionUser } from "#lib/server/session.js"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ cookies }) => {
  return { user: await getSessionUser(cookies) }
}
