import { Check, Shield, CreditCard, CheckCircle, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CTASectionProps {
  onNavigate: (page: string) => void;
}

export function CTASection({ onNavigate }: CTASectionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#0A0E1A] text-white relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(79,70,229,0.2)_0%,transparent_70%)]" />

      <div className="container max-w-5xl mx-auto px-6 text-center relative">
        <h2 className="text-4xl lg:text-[52px] font-extrabold leading-tight tracking-[-1.5px] mb-4">
          {t('landing.cta.title')}
        </h2>
        <p className="text-lg text-white/50 mb-10">
          {t('landing.cta.subtitle')}
        </p>

        <button
          onClick={() => onNavigate('signup')}
          className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-[0_8px_32px_rgba(79,70,229,0.25)] hover:shadow-[0_16px_48px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 transition inline-flex items-center gap-2"
        >
          {t('landing.cta.buttonText')} →
        </button>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
          <TrustBadge icon={<Shield className="w-4 h-4" />} text={t('landing.cta.trustBadges.security')} />
          <TrustBadge icon={<CreditCard className="w-4 h-4" />} text={t('landing.cta.trustBadges.noCard')} />
          <TrustBadge icon={<CheckCircle className="w-4 h-4" />} text={t('landing.cta.trustBadges.cancel')} />
          <TrustBadge icon={<Headphones className="w-4 h-4" />} text={t('landing.cta.trustBadges.support')} />
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/50">
      <div className="text-green-500">{icon}</div>
      {text}
    </div>
  );
}
