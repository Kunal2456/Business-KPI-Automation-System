import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { DashboardMockup } from './DashboardMockup';
import { useTranslation } from 'react-i18next';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { t } = useTranslation();
  return (
    <section className="pt-[148px] pb-20 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(79,70,229,0.06)_0%,transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'linear-gradient(#E8EBF4 1px, transparent 1px), linear-gradient(90deg, #E8EBF4 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      <div className="container max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-20 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[13px] font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
              Trusted by 500+ Indian Store Owners
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-[68px] font-extrabold leading-[1.05] tracking-[-2px] text-[#0A0E1A] mb-6">
              {t('landing.hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 leading-relaxed mb-9 max-w-[500px]">
              {t('landing.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3.5 mb-10">
              <button
                onClick={() => onNavigate('signup')}
                className="px-9 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-[17px] font-semibold shadow-[0_8px_32px_rgba(79,70,229,0.25)] hover:shadow-[0_16px_48px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 transition"
              >
                {t('landing.hero.ctaPrimary')} →
              </button>
              <button
                onClick={() => onNavigate('features')}
                className="px-9 py-4 bg-transparent border-[1.5px] border-gray-300 text-gray-900 rounded-full text-[17px] font-semibold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                ▶ {t('landing.hero.ctaSecondary')}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4">
              <TrustItem text="No credit card required" />
              <TrustItem text="Cancel anytime" />
              <TrustItem text="Setup in 15 minutes" />
            </div>
          </motion.div>

          {/* Right: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
      <Check className="w-3.5 h-3.5 text-green-600 stroke-[2.5]" />
      {text}
    </div>
  );
}