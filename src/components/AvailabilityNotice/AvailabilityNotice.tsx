import { useTranslation } from 'react-i18next';
import type { UnavailabilityReason } from '../../utils/availability';
import './AvailabilityNotice.css';

interface AvailabilityNoticeProps {
  reason: UnavailabilityReason | null;
  isFromRewards: boolean;
}

export default function AvailabilityNotice({ reason, isFromRewards }: AvailabilityNoticeProps) {
  const { t } = useTranslation('main');
  if (!reason) return null;

  const suffix = isFromRewards ? 'Reward' : 'Partner';
  return <p className="availability-notice">{t(`availability.${reason}${suffix}`)}</p>;
}
