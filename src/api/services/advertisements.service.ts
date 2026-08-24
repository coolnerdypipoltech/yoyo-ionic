import { request } from '../httpClient';
import type { AdResult, AdvertisementResponse } from '../types';

// Not paginated — the backend returns every active ad in one call.
export async function getAdvertisements(): Promise<AdResult[]> {
  const raw = await request<AdvertisementResponse>('/advertisements', { method: 'GET' });
  return raw.results;
}
