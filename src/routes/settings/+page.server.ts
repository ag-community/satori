import { fail } from "@sveltejs/kit"
import { requireSession } from "#lib/server/session.js"
import { ShionError } from "#lib/server/shion/errors.js"
import { fetchPlayer, updateProfile } from "#lib/server/shion/players.js"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ url, parent }) => {
  const { user } = await parent()
  const authFailed = !user && url.searchParams.get("auth") === "failed"

  if (!user) return { user: null, player: null, authFailed, error: null }

  try {
    const player = await fetchPlayer(user.id)
    return { user, player, authFailed, error: null }
  } catch (error) {
    return {
      user,
      player: null,
      authFailed,
      error: error instanceof Error ? error.message : "Failed to load profile",
    }
  }
}

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim()
}

function optionalText(form: FormData, key: string): string | null {
  const value = text(form, key)
  return value.length === 0 ? null : value
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const { token, user } = await requireSession(cookies)
    const form = await request.formData()

    const body = {
      bio: text(form, "bio"),
      twitter_handle: optionalText(form, "twitter_handle"),
      twitch_handle: optionalText(form, "twitch_handle"),
      youtube_handle: optionalText(form, "youtube_handle"),
      discord_handle: optionalText(form, "discord_handle"),
      website_url: optionalText(form, "website_url"),
    }

    try {
      await updateProfile(user.id, body, token)
      return { success: true, message: null }
    } catch (error) {
      return fail(400, {
        success: false,
        message: error instanceof ShionError ? error.message : "Failed to update profile",
      })
    }
  },
}
