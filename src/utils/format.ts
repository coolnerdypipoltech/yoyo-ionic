const MONTH_ABBREVIATIONS = [
  'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
  'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.',
];

// "5 Jan. 2026 - 12 Feb. 2026" — matches the old Unity client's format.
export function formatDateRange(startsOn: string | null, endsOn: string | null): string {
  if (!startsOn || !endsOn) return '';
  const start = new Date(startsOn);
  const end = new Date(endsOn);
  const part = (d: Date) => `${d.getDate()} ${MONTH_ABBREVIATIONS[d.getMonth()]} ${d.getFullYear()}`;
  return `${part(start)} - ${part(end)}`;
}

// cost_rate is a string like "$$$" — render one icon per character.
export function getCostRateLevel(costRate: string | null): number {
  return costRate?.length ?? 0;
}

export function dresscodeMatches(dresscode: string | null, keyword: 'formal' | 'casual'): boolean {
  return !!dresscode && dresscode.toLowerCase().includes(keyword);
}

export function paymentOptionMatches(paymentOptions: string | null, keyword: 'cash' | 'card'): boolean {
  return !!paymentOptions && paymentOptions.toLowerCase().includes(keyword);
}

export function truncate(text: string | null, maxLength = 30): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
