export const env = {
  appName: process.env.PUBLIC_APP_NAME ?? 'Shion',
  apiBaseUrl: process.env.PUBLIC_APP_SHION_API_BASE_URL ?? '/api',
  repoUrl: process.env.PUBLIC_REPO_URL ?? '',
} as const;
