import { LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LandingFooterProps {
  onNavigate: (page: string) => void;
}

export function LandingFooter({ onNavigate }: LandingFooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#1C2340] text-white/60 py-16">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 font-extrabold text-xl text-white mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              ShelfIQ
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              {t('landing.footer.tagline')}
            </p>
            <div className="flex gap-2.5">
              {['𝕏', 'in', '▶', '📷'].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-sm hover:bg-indigo-600/30 hover:border-indigo-600/50 transition"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[13px] font-bold text-white tracking-wider uppercase mb-4">{t('landing.footer.product')}</h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('features')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.features')}
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.pricing')}
              </button>
              <button
                onClick={() => onNavigate('demo')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.demo')}
              </button>
              <button
                onClick={() => onNavigate('case-studies')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.caseStudies')}
              </button>
              <button
                onClick={() => onNavigate('integrations')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.integrations')}
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[13px] font-bold text-white tracking-wider uppercase mb-4">{t('landing.footer.company')}</h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('about')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.about')}
              </button>
              <button
                onClick={() => onNavigate('careers')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.careers')}
              </button>
              <button
                onClick={() => onNavigate('blog')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.blog')}
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.contact')}
              </button>
              <button
                onClick={() => onNavigate('press-kit')}
                className="block text-sm text-white/40 hover:text-white/80 transition"
              >
                {t('landing.footer.pressKit')}
              </button>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[13px] font-bold text-white tracking-wider uppercase mb-4">{t('landing.footer.legal')}</h4>
            <div className="space-y-2">
              <button className="block text-sm text-white/40 hover:text-white/80 transition">
                {t('landing.footer.privacy')}
              </button>
              <button className="block text-sm text-white/40 hover:text-white/80 transition">
                {t('landing.footer.terms')}
              </button>
              <button className="block text-sm text-white/40 hover:text-white/80 transition">
                {t('landing.footer.refund')}
              </button>
              <button className="block text-sm text-white/40 hover:text-white/80 transition">
                {t('landing.footer.cookies')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px]">{t('landing.footer.copyright')}</p>
          <p className="text-[13px] text-white/30">{t('landing.footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}