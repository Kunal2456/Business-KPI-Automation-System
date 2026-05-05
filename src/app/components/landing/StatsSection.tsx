import { useCountUp } from '../../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

export function StatsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <StatCard value={500} suffix="+" label={t('landing.stats.storesUsing')} />
          <StatCard value={12} suffix=" Cr+" label={t('landing.stats.revenueTracked')} />
          <StatCard value={90} suffix="%" label={t('landing.stats.timeSaved')} />
          <StatCard value={4.9} suffix="/5" label={t('landing.stats.avgRating')} decimal />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  suffix,
  label,
  decimal = false,
}: {
  value: number;
  suffix: string;
  label: string;
  decimal?: boolean;
}) {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <div className="p-10 text-center border-r border-gray-200 last:border-r-0">
      <div ref={ref} className="text-[44px] font-extrabold leading-none tracking-[-2px] text-[#0A0E1A] mb-2">
        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {decimal ? count.toFixed(1) : count.toLocaleString()}
          {suffix}
        </span>
      </div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}