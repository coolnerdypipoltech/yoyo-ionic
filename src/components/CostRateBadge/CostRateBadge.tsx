import { getCostRateLevel } from '../../utils/format';
import './CostRateBadge.css';

interface CostRateBadgeProps {
  costRate: string | null;
}

export default function CostRateBadge({ costRate }: CostRateBadgeProps) {
  const level = getCostRateLevel(costRate);
  if (level === 0) return null;

  return (
    <span className="cost-rate-badge">
      {Array.from({ length: level }, (_, i) => (
        <span key={i} className="cost-rate-badge__symbol">$</span>
      ))}
    </span>
  );
}
