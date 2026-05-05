import { Check, X } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

interface PricingSectionProps {
  onNavigate: (page: string) => void;
}

export function PricingSection({ onNavigate }: PricingSectionProps) {
  const { t } = useTranslation();
  const ref = useScrollReveal();

  return (
    <section className="py-24">
      <div className="container max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider uppercase mb-5">
            {t('landing.pricing.badge')}
          </span>
          <h2 className="text-4xl lg:text-[52px] font-extrabold leading-tight tracking-[-1.5px] text-[#0A0E1A] mb-4">
            {t('landing.pricing.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-[560px] mx-auto">
            {t('landing.pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          <PricingCard
            name={t('landing.pricing.freeTrial.name')}
            price={t('landing.pricing.freeTrial.price')}
            period={t('landing.pricing.freeTrial.period')}
            description={t('landing.pricing.freeTrial.description')}
            features={[
              { text: t('landing.pricing.freeTrial.features.0'), included: true },
              { text: t('landing.pricing.freeTrial.features.1'), included: true },
              { text: t('landing.pricing.freeTrial.features.2'), included: true },
              { text: t('landing.pricing.freeTrial.features.3'), included: true },
              { text: t('landing.pricing.freeTrial.features.4'), included: true },
              { text: t('landing.pricing.freeTrial.features.5'), included: true },
              { text: t('landing.pricing.freeTrial.features.6'), included: false },
              { text: t('landing.pricing.freeTrial.features.7'), included: false },
            ]}
            buttonText={t('landing.pricing.freeTrial.buttonText')}
            onNavigate={onNavigate}
          />
          <PricingCard
            name={t('landing.pricing.starter.name')}
            price={t('landing.pricing.starter.price')}
            period={t('landing.pricing.starter.period')}
            description={t('landing.pricing.starter.description')}
            features={[
              { text: t('landing.pricing.starter.features.0'), included: true },
              { text: t('landing.pricing.starter.features.1'), included: true },
              { text: t('landing.pricing.starter.features.2'), included: true },
              { text: t('landing.pricing.starter.features.3'), included: true },
              { text: t('landing.pricing.starter.features.4'), included: true },
              { text: t('landing.pricing.starter.features.5'), included: true },
              { text: t('landing.pricing.starter.features.6'), included: true },
              { text: t('landing.pricing.starter.features.7'), included: true },
            ]}
            buttonText={t('landing.pricing.starter.buttonText')}
            popular
            onNavigate={onNavigate}
          />
          <PricingCard
            name={t('landing.pricing.professional.name')}
            price={t('landing.pricing.professional.price')}
            period={t('landing.pricing.professional.period')}
            description={t('landing.pricing.professional.description')}
            features={[
              { text: t('landing.pricing.professional.features.0'), included: true },
              { text: t('landing.pricing.professional.features.1'), included: true },
              { text: t('landing.pricing.professional.features.2'), included: true },
              { text: t('landing.pricing.professional.features.3'), included: true },
              { text: t('landing.pricing.professional.features.4'), included: true },
              { text: t('landing.pricing.professional.features.5'), included: true },
              { text: t('landing.pricing.professional.features.6'), included: true },
              { text: t('landing.pricing.professional.features.7'), included: true },
            ]}
            buttonText={t('landing.pricing.professional.buttonText')}
            onNavigate={onNavigate}
          />
        </div>

        {/* Enterprise CTA */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            {t('landing.pricing.enterpriseCta')}{' '}
            <button onClick={() => onNavigate('contact')} className="text-indigo-600 font-semibold hover:underline">
              {t('landing.pricing.contactSales')} →
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  popular = false,
  onNavigate,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  popular?: boolean;
  onNavigate: (page: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`bg-white border rounded-2xl p-8 transition hover:shadow-md hover:-translate-y-1 relative ${
        popular ? 'border-indigo-600 bg-gradient-to-b from-indigo-50/50 to-white' : 'border-gray-200'
      }`}
    >
      {popular && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold px-4 py-1 rounded-b-lg tracking-wider">
          {t('landing.pricing.mostPopular')}
        </div>
      )}
      <div className="text-[13px] font-bold text-gray-500 tracking-wider uppercase mb-4">{name}</div>
      <div className="mb-1">
        <span className="text-[44px] font-extrabold text-[#0A0E1A] tracking-[-2px]">{price}</span>
      </div>
      <div className="text-[13px] text-gray-600 mb-6">{period}</div>
      <p className="text-sm text-gray-600 mb-6">{description}</p>

      <div className="h-px bg-gray-200 mb-6" />

      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px]">
            {feature.included ? (
              <Check className="w-4 h-4 text-green-600 stroke-[2.5] mt-0.5 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-red-600 stroke-[2.5] mt-0.5 flex-shrink-0 opacity-50" />
            )}
            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>{feature.text}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onNavigate('signup')}
        className={`w-full py-3 rounded-full font-semibold transition ${
          popular
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_8px_32px_rgba(79,70,229,0.25)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.35)]'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
