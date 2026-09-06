import { env } from '@/lib/env';

class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type QueryParams = Record<string, string | number | boolean | undefined>;

async function request<T>(path: string, params?: QueryParams): Promise<T> {
  const url = new URL(`${env.apiBaseUrl}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const body = (await response.json().catch(() => null)) as {
    status?: string;
    message?: string;
    data?: T;
  } | null;

  if (!response.ok || body?.status !== 'success' || body.data === undefined) {
    const fallback =
      response.status === 404
        ? 'Not found'
        : `Request failed (${response.status})`;
    throw new ApiError(body?.message ?? fallback, response.status);
  }

  return body.data;
}

export function apiGet<T>(path: string, params?: QueryParams): Promise<T> {
  return request<T>(path, params);
}
