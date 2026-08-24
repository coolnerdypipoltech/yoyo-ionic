// Literal values sent to the API — never translated, only their displayed
// label is (see i18n setup notes in the plan).
export const GENDER_OPTIONS = ['Women', 'Men', 'I prefer not to say it'] as const;
export type Gender = (typeof GENDER_OPTIONS)[number];

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export const MIN_PASSWORD_LENGTH = 8;

export function isValidPassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}

export const MIN_AGE = 18;

// Guards against non-numeric input — the old Unity client crashed with an
// unhandled FormatException on int.Parse(ageInput.text); this returns null
// instead so the caller can show a validation error.
export function parseAge(raw: string): number | null {
  if (!/^\d+$/.test(raw.trim())) return null;
  return Number(raw);
}

export function isValidAge(age: number | null): age is number {
  return age !== null && age >= MIN_AGE;
}

export function isValidAccessCode(code: string): boolean {
  return /^[a-zA-Z0-9]{6}$/.test(code);
}

export function assemblePhone(countryCode: string, nationalNumber: string): string {
  return `${countryCode} ${nationalNumber}`.trim();
}
