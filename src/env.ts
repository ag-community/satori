import { defineEnvVars } from "@sveltejs/kit/env"

export const variables = defineEnvVars({
  SHION_API_BASE_URL: {
    schema: (value: string | undefined) => value ?? "http://localhost:8080/api",
    description: "Base URL of the backend API.",
  },
  PUBLIC_APP_NAME: {
    public: true,
    schema: (value: string | undefined) => value ?? "Adrenaline Gamer Rating",
  },
  PUBLIC_REPO_URL: {
    public: true,
    schema: (value: string | undefined) => value ?? "",
  },
})
