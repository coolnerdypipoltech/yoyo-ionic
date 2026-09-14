import { WHATSAPP_COUNTRY_CODE, WHATSAPP_NUMBER } from '../api/config';
import type { PRs } from '../api/types';

// Zero-pads a user id to 6 digits, e.g. 123 -> "000123" — matches the
// "ID: 000123" format shown throughout the old Unity client.
export function padUserId(id: number): string {
  return String(id).padStart(6, '0');
}

// Message text is translated and interpolated by the caller (via i18next's
// `common:whatsapp.*` keys) — this module only knows how to turn a finished
// message string into a WhatsApp deep link. `phone` overrides the app's own
// default number (e.g. a place/reward's dedicated PR) — stripped down to
// digits since it comes from the backend already formatted for display
// (e.g. "+52 6667777777"), not as the bare digit string the wa.me-style
// `phone` query param needs.
export function buildWhatsAppUrl(message: string, phone?: string): string {
  const digits = phone ? phone.replace(/\D/g, '') : `${WHATSAPP_COUNTRY_CODE}${WHATSAPP_NUMBER}`;
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string, phone?: string): void {
  window.open(buildWhatsAppUrl(message, phone), '_blank', 'noopener,noreferrer');
}

interface ContactSource {
  pr: PRs | null;
  contact_link: string | null;
}

// Places, rewards, partners and events can each override how their
// "reserve"/"redeem" button gets in touch: a dedicated PR (WhatsApp, via
// their own number) takes priority, then a plain contact link (opened
// as-is, no WhatsApp message involved), falling back to this app's own
// default WhatsApp number when neither is set.
export function contactFor(source: ContactSource, message: string): void {
  if (source.pr?.phone) {
    openWhatsApp(message, source.pr.phone);
  } else if (source.contact_link) {
    window.open(source.contact_link, '_blank', 'noopener,noreferrer');
  } else {
    openWhatsApp(message);
  }
}
