import { WHATSAPP_COUNTRY_CODE, WHATSAPP_NUMBER } from '../api/config';

// Zero-pads a user id to 6 digits, e.g. 123 -> "000123" — matches the
// "ID: 000123" format shown throughout the old Unity client.
export function padUserId(id: number): string {
  return String(id).padStart(6, '0');
}

// Message text is translated and interpolated by the caller (via i18next's
// `common:whatsapp.*` keys) — this module only knows how to turn a finished
// message string into a WhatsApp deep link.
export function buildWhatsAppUrl(message: string): string {
  const phone = `${WHATSAPP_COUNTRY_CODE}${WHATSAPP_NUMBER}`;
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string): void {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}
