import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface ProblemSectionProps {
  onNavigate: (page: string) => void;
}

export function ProblemSection({ onNavigate }: ProblemSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-gradient-to-b from-white to-indigo-50/30">
      <div className="container max-w-7xl mx-auto px-6">
        {/* Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="inline-block px-4 py-1.5 bg-indigo-100/60 text-indigo-600 rounded-full text-sm font-semibold">
            {t('landing.problem.badge')}
          </span>
        </motion.div>

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-center tracking-[-1.5px] text-[#0A0E1A] mb-16"
        >
          {t('landing.problem.title')}
          <br />
          {t('landing.problem.titleLine2')}
        </motion.h2>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <ProblemCard
            icon="⏰"
            iconColor="bg-red-100"
            title={t('landing.problem.cards.wastingTime.title')}
            description={t('landing.problem.cards.wastingTime.description')}
            delay={0.2}
          />
          <ProblemCard
            icon="📦"
            iconColor="bg-orange-100"
            title={t('landing.problem.cards.missingStock.title')}
            description={t('landing.problem.cards.missingStock.description')}
            delay={0.3}
          />
          <ProblemCard
            icon="📊"
            iconColor="bg-yellow-100"
            title={t('landing.problem.cards.noInsights.title')}
            description={t('landing.problem.cards.noInsights.description')}
            delay={0.4}
          />
        </div>

        {/* Solution Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-10 md:p-12 text-white shadow-[0_20px_60px_rgba(79,70,229,0.3)]"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-[-1px]">
              {t('landing.problem.solution.title')}
            </h3>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              {t('landing.problem.solution.description')}
            </p>
            <button
              onClick={() => onNavigate('features')}
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {t('landing.problem.solution.buttonText')} →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemCard({
  icon,
  iconColor,
  title,
  description,
  delay
}: {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <div className={`w-16 h-16 ${iconColor} rounded-2xl flex items-center justify-center text-3xl mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}