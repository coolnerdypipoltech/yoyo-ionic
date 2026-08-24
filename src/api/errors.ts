// The backend returns exactly two error body shapes under the `message` key
// (see YoYo-API-Reference.md §8):
//  - business errors (400/401/403/404): message is a STRING business code
//  - 422 Laravel validation: message is an OBJECT keyed by field name
// ApiError models both as a discriminated union instead of sniffing raw text.

export type BusinessErrorCode =
  | 'api.error.already_exists'
  | 'api.error.unauthorized'
  | 'api.error.email_not_verified'
  | 'api.error.code_not_found'
  | 'api.error.code_already_redeemed'
  | 'api.error.invalid_password'
  | 'api.error.not_found';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly fieldErrors: Record<string, string[]> | null;

  constructor(
    status: number,
    code: string | null,
    fieldErrors: Record<string, string[]> | null = null,
  ) {
    super(code ?? 'api.error.unknown');
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }

  get isValidationError(): boolean {
    return this.fieldErrors !== null;
  }
}

export class NetworkError extends Error {
  constructor(cause?: unknown) {
    super('network_error');
    this.cause = cause;
  }
}

// Maps a business error code to an i18n key in the `errors` namespace.
// Falls back to a generic message for anything not in this table.
export const API_ERROR_I18N_KEY: Record<string, string> = {
  'api.error.already_exists': 'errors:alreadyExists',
  'api.error.unauthorized': 'errors:invalidCredentials',
  'api.error.email_not_verified': 'errors:emailNotVerified',
  'api.error.code_not_found': 'errors:codeNotFound',
  'api.error.code_already_redeemed': 'errors:codeAlreadyRedeemed',
  'api.error.invalid_password': 'errors:invalidPassword',
  'api.error.not_found': 'errors:notFound',
};

export function resolveErrorI18nKey(error: unknown): string {
  if (error instanceof ApiError && error.code) {
    return API_ERROR_I18N_KEY[error.code] ?? 'errors:generic';
  }
  if (error instanceof NetworkError) {
    return 'errors:network';
  }
  return 'errors:generic';
}
