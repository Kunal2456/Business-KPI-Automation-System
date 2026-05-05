import { useState } from 'react';
import { LandingNav } from './LandingNav';
import { Hero } from './Hero';
import { StatsSection } from './StatsSection';
import { ProblemSection } from './ProblemSection';
import { FeaturesSection } from './FeaturesSection';
import { PricingSection } from './PricingSection';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onNavigateToApp: () => void;
}

export function LandingPage({ onNavigateToApp }: LandingPageProps) {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (page: string) => {
    if (page === 'login' || page === 'signup') {
      onNavigateToApp();
    } else {
      setCurrentView(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <LandingNav onNavigate={handleNavigate} currentPage={currentView} />

      {currentView === 'home' && (
        <>
          <Hero onNavigate={handleNavigate} />

          {/* Logos Section */}
          <div className="py-8 border-y border-gray-200 bg-white">
            <div className="container max-w-7xl mx-auto px-6">
              <div className="text-xs font-semibold text-gray-400 tracking-wider uppercase text-center mb-6">
                Trusted by retail chains across India
              </div>
              <div className="flex items-center justify-center gap-12 flex-wrap">
                {['BIG BAZAAR', 'MORE RETAIL', 'RELIANCE FRESH', 'D-MART', 'SPENCERS'].map((logo) => (
                  <div
                    key={logo}
                    className="px-5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-400 tracking-wider"
                  >
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <StatsSection />
          <ProblemSection onNavigate={handleNavigate} />
          <FeaturesSection />
          <PricingSection onNavigate={handleNavigate} />
          <CTASection onNavigate={handleNavigate} />
        </>
      )}

      {currentView === 'features' && (
        <div className="pt-[148px] pb-20">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-extrabold tracking-[-2px] text-[#0A0E1A] mb-4">
                Powerful Features for Retail Success
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to automate your store analytics and grow your business.
              </p>
            </div>
            <FeaturesSection />
          </div>
        </div>
      )}

      {currentView === 'pricing' && (
        <div className="pt-[148px] pb-20">
          <div className="container max-w-7xl mx-auto px-6">
            <PricingSection onNavigate={handleNavigate} />
          </div>
        </div>
      )}

      {currentView === 'about' && (
        <div className="pt-[148px] pb-20">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-extrabold tracking-[-2px] text-[#0A0E1A] mb-4">About ShelfIQ</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're on a mission to help retail businesses make data-driven decisions.
              </p>
            </div>
            <div className="max-w-3xl mx-auto prose prose-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                ShelfIQ was built by retail professionals who understand the daily challenges store owners face. We saw
                firsthand how manual Excel tracking wastes hours every week and leads to missed opportunities.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our platform eliminates 90% of manual reporting work while providing real-time insights that help
                businesses grow. From inventory alerts to profit analytics, we've built everything a modern retail
                business needs.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, over 500 stores across India trust ShelfIQ to manage their operations. Join them and transform
                your retail business with data-driven insights.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentView === 'contact' && (
        <div className="pt-[148px] pb-20">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-extrabold tracking-[-2px] text-[#0A0E1A] mb-4">Get in Touch</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions? We'd love to hear from you.
              </p>
            </div>
            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Company</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-[0_8px_32px_rgba(79,70,229,0.25)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <LandingFooter onNavigate={handleNavigate} />
    </div>
  );
}