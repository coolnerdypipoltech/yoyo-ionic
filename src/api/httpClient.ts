import { BASE_URL } from './config';
import { ApiError, NetworkError } from './errors';
import * as storage from '../services/storage';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

async function parseErrorBody(res: Response): Promise<never> {
  let body: { message?: unknown } | null = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  const message = body?.message;
  if (message && typeof message === 'object') {
    throw new ApiError(res.status, null, message as Record<string, string[]>);
  }
  throw new ApiError(res.status, typeof message === 'string' ? message : null);
}

async function execute<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await storage.getToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    throw new NetworkError(cause);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    return parseErrorBody(res);
  }

  const contentLength = res.headers.get('content-length');
  if (contentLength === '0') {
    return undefined as T;
  }

  try {
    return (await res.json()) as T;
  } catch {
    return undefined as T;
  }
}

// Request against BASE_API_URL (/api/v1/...) — used by all "business" endpoints.
export function request<T>(path: string, options?: RequestOptions): Promise<T> {
  return execute<T>(`${BASE_URL}${path}`, options);
}

// Request against an absolute URL — used for pagination `next` links, which
// the backend returns already-prefixed with `/v1` on the API root (no
// `/v1` should be re-added here, see api/config.ts NEXT_URL).
export function requestAbsolute<T>(url: string, options?: RequestOptions): Promise<T> {
  return execute<T>(url, options);
}
