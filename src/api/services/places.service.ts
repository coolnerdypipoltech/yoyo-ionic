import { request, requestAbsolute } from '../httpClient';
import { NEXT_URL } from '../config';
import type { Paginated, Place } from '../types';

interface PlacesResponseRaw {
  results: Place[];
  prev: string | null;
  next: string | null;
  total: number;
}

function normalize(raw: PlacesResponseRaw): Paginated<Place> {
  return { results: raw.results, total: raw.total, next: raw.next, previous: raw.prev };
}

export async function getConsumptionCenters(limit: number, offset: number): Promise<Paginated<Place>> {
  const raw = await request<PlacesResponseRaw>(`/consumption-centers/${limit}/${offset}`, { method: 'GET' });
  return normalize(raw);
}

export async function getEvents(limit: number, offset: number): Promise<Paginated<Place>> {
  const raw = await request<PlacesResponseRaw>(`/events/${limit}/${offset}`, { method: 'GET' });
  return normalize(raw);
}

// `next` is a path like "/v1/consumption-centers/10/10" already returned by
// the backend — it must be appended to NEXT_URL (no extra /v1), not BASE_URL.
export async function getNextPlacesPage(next: string): Promise<Paginated<Place>> {
  const raw = await requestAbsolute<PlacesResponseRaw>(`${NEXT_URL}${next}`, { method: 'GET' });
  return normalize(raw);
}
