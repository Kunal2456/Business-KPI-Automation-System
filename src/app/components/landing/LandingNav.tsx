import { useState, useEffect } from 'react';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface LandingNavProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function LandingNav({ onNavigate, currentPage }: LandingNavProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[68px] px-6 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b transition-shadow ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 font-extrabold text-xl text-[#0A0E1A]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          ShelfIQ
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onNavigate('features')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
              currentPage === 'features'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {t('landing.footer.features')}
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
              currentPage === 'pricing'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {t('landing.footer.pricing')}
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
              currentPage === 'about'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {t('landing.footer.about')}
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
              currentPage === 'contact'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {t('landing.footer.contact')}
          </button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <LanguageSwitcher />
          <button
            onClick={() => onNavigate('login')}
            className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            {t('auth.login')}
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-[0_8px_32px_rgba(79,70,229,0.25)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition"
          >
            {t('landing.hero.ctaPrimary')}
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[68px] left-0 right-0 bg-white border-b shadow-lg z-40 md:hidden">
          <div className="flex flex-col p-4 gap-1">
            <button
              onClick={() => {
                onNavigate('features');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-3 text-left rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
            >
              {t('landing.footer.features')}
            </button>
            <button
              onClick={() => {
                onNavigate('pricing');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-3 text-left rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
            >
              {t('landing.footer.pricing')}
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-3 text-left rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
            >
              {t('landing.footer.about')}
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-3 text-left rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
            >
              {t('landing.footer.contact')}
            </button>
            <button
              onClick={() => {
                onNavigate('login');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-3 text-left rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
            >
              {t('auth.login')}
            </button>
            <div className="pt-2">
              <button
                onClick={() => {
                  onNavigate('signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-[0_8px_32px_rgba(79,70,229,0.25)]"
              >
                {t('landing.hero.ctaPrimary')} →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}