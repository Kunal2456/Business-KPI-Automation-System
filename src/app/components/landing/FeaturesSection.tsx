import { BarChart3, Bell, Building2, Users, FileText, Upload } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

export function FeaturesSection() {
  const { t } = useTranslation();
  const ref = useScrollReveal();

  return (
    <section className="py-24 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider uppercase mb-5">
            {t('landing.features.badge')}
          </span>
          <h2 className="text-4xl lg:text-[52px] font-extrabold leading-tight tracking-[-1.5px] text-[#0A0E1A] mb-4">
            {t('landing.features.title')}{' '}
            <em className="font-['Instrument_Serif'] italic text-indigo-600">{t('landing.features.titleHighlight')}</em> {t('landing.features.titleSuffix')}
          </h2>
          <p className="text-lg text-gray-600 max-w-[560px] mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        {/* Feature Cards */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={<BarChart3 className="w-5 h-5 text-indigo-600" />}
            title={t('landing.features.realTimeDashboards')}
            description={t('landing.features.realTimeDashboardsDesc')}
            tag={t('landing.features.coreFeature')}
          />
          <FeatureCard
            icon={<Bell className="w-5 h-5 text-indigo-600" />}
            title={t('landing.features.intelligentAlerts')}
            description={t('landing.features.intelligentAlertsDesc')}
            tag={t('landing.features.smartAutomation')}
          />
          <FeatureCard
            icon={<Building2 className="w-5 h-5 text-indigo-600" />}
            title={t('landing.features.multiStore')}
            description={t('landing.features.multiStoreDesc')}
            tag={t('landing.features.scaleReady')}
          />
          <FeatureCard
            icon={<Users className="w-5 h-5 text-indigo-600" />}
            title={t('landing.features.roleBasedAccess')}
            description={t('landing.features.roleBasedAccessDesc')}
            tag={t('landing.features.teamCollaboration')}
          />
          <FeatureCard
            icon={<FileText className="w-5 h-5 text-indigo-600" />}
            title={t('landing.features.automatedReports')}
            description={t('landing.features.automatedReportsDesc')}
            tag={t('landing.features.timeSaver')}
          />
          <FeatureCard
            icon={<Upload className="w-5 h-5 text-indigo-600" />}
            title={t('landing.features.bulkImport')}
            description={t('landing.features.bulkImportDesc')}
            tag={t('landing.features.easySetup')}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  tag,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-7 transition hover:shadow-md hover:-translate-y-1 hover:border-indigo-600 cursor-default">
      <div className="w-12 h-12 rounded-[14px] bg-indigo-50 flex items-center justify-center mb-5">{icon}</div>
      <h3 className="text-[17px] font-bold text-[#0A0E1A] mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-3.5">{description}</p>
      <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
        {tag}
      </span>
    </div>
  );
}
