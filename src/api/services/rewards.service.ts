import { request, requestAbsolute } from '../httpClient';
import { NEXT_URL } from '../config';
import type { Paginated, ResultObject } from '../types';

interface RootRaw {
  results: ResultObject[];
  total: number;
  next: string | null;
  previous: string | null;
}

function normalize(raw: RootRaw): Paginated<ResultObject> {
  return { results: raw.results, total: raw.total, next: raw.next, previous: raw.previous };
}

export async function getRewards(limit: number, offset: number): Promise<Paginated<ResultObject>> {
  const raw = await request<RootRaw>(`/rewards/${limit}/${offset}`, { method: 'GET' });
  return normalize(raw);
}

export async function getPartners(limit: number, offset: number): Promise<Paginated<ResultObject>> {
  const raw = await request<RootRaw>(`/partners/${limit}/${offset}`, { method: 'GET' });
  return normalize(raw);
}

export async function getNextRewardsPage(next: string): Promise<Paginated<ResultObject>> {
  const raw = await requestAbsolute<RootRaw>(`${NEXT_URL}${next}`, { method: 'GET' });
  return normalize(raw);
}
