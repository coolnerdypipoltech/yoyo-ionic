import type { ResultObject } from '../api/types';

export type UnavailabilityReason = 'insufficientPoints' | 'outOfStock' | 'notAvailableYet';

// Checked in this exact order — when multiple conditions apply, the later
// check's reason wins (matches the old Unity client's RewardsInfoViewModel).
export function getUnavailabilityReason(
  item: ResultObject,
  userPoints: number,
): UnavailabilityReason | null {
  if (userPoints < item.cost) return 'insufficientPoints';
  if (item.stock <= 0) return 'outOfStock';

  const now = new Date();
  if (item.starts_on && now < new Date(item.starts_on)) return 'notAvailableYet';
  if (item.ends_on && now > new Date(item.ends_on)) return 'notAvailableYet';

  return null;
}

export function isItemAvailable(item: ResultObject, userPoints: number): boolean {
  return getUnavailabilityReason(item, userPoints) === null;
}
