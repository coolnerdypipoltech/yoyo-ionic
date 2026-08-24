export const BASE_URL = 'https://admin.yoyotheclub.com/api/v1';

// Pagination `next`/`previous` links returned by the backend already embed
// `/v1/...` in the string, so the continuation URL is built on the API root
// without `/v1`, not on BASE_URL (see YoYo-API-Reference.md §7).
export const NEXT_URL = 'https://admin.yoyotheclub.com/api';

// TODO: replace with the real Privacy Policy URL before shipping.
export const PRIVACY_POLICY_URL = 'https://example.com/privacy-policy';

// TODO: replace with the real Terms & Conditions URL before shipping.
export const TERMS_URL = 'https://example.com/terms';

// WhatsApp Business number used for reservations/redemptions (Mexico).
export const WHATSAPP_COUNTRY_CODE = '52';
export const WHATSAPP_NUMBER = '8331021023';
