import { shion } from "#lib/server/shion/client.js"
import type { AuthSessionDto, AuthUserDto } from "#lib/types.js"

export function fetchCurrentUser(token: string): Promise<AuthUserDto> {
  return shion<AuthUserDto>("/auth/me", { token })
}

export function verifySteam(params: Record<string, string>): Promise<AuthSessionDto> {
  return shion<AuthSessionDto>("/auth/steam/verify", { method: "POST", body: { params } })
}

export function logout(token: string): Promise<boolean> {
  return shion<boolean>("/auth/logout", { method: "POST", token })
}
