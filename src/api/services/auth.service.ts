import { request } from '../httpClient';
import type { Gallery, LoginResponse, SignUpRequest, UpdateTastesRequest, User } from '../types';

export function verifyAccessCode(code: string): Promise<void> {
  return request<void>('/auth/access-codes/verification', {
    method: 'POST',
    body: { code },
    auth: false,
  });
}

export async function signUp(payload: SignUpRequest): Promise<User> {
  const res = await request<{ user: User }>('/auth/signin', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  return res.user;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export function requestPasswordReset(email: string): Promise<void> {
  return request<void>('/auth/passwords/reset', {
    method: 'POST',
    body: { email },
    auth: false,
  });
}

export async function getInfo(): Promise<User> {
  const res = await request<{ user: User }>('/auth/info', { method: 'GET' });
  return res.user;
}

// Deliberate simplification vs. the old Unity client, which sent this as
// query-string params with an empty PUT body (a Laravel `$request->all()`
// quirk). A normal JSON body is sent instead — smoke-test against the real
// backend before shipping (see plan notes).
export async function updateTastes(payload: UpdateTastesRequest): Promise<User> {
  const res = await request<{ user: User }>('/auth/info', {
    method: 'PUT',
    body: payload,
  });
  return res.user;
}

export function getPoints(): Promise<{ points: number; total_points: number }> {
  return request('/auth/points', { method: 'GET' });
}

// Pass an empty string to remove the current avatar.
export async function uploadAvatar(base64Image: string): Promise<Gallery> {
  const res = await request<{ image: Gallery }>('/auth/image', {
    method: 'POST',
    body: { image: base64Image },
  });
  return res.image;
}

export function deleteAccount(password: string): Promise<void> {
  return request<void>('/auth', {
    method: 'DELETE',
    body: { password },
  });
}
