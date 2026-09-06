/// <reference types="@rsbuild/core/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    PUBLIC_APP_NAME?: string;
    PUBLIC_APP_SHION_API_BASE_URL?: string;
    PUBLIC_REPO_URL?: string;
  }
}
