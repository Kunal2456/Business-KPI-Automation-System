import { LayoutDashboard, Wand2, Database, FileSpreadsheet, ArrowRight, Moon, Sun, Package, TrendingUp, ShoppingCart, FileText, Sparkles, ArrowLeft, Sparkle, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  onStartSetupWizard: () => void;
  onLoadDemoData: () => void;
  onStartFresh: () => void;
  darkMode: boolean;
  onToggleDarkMode?: () => void;
  onBack?: () => void; // Optional back navigation
  onBackToLanding?: () => void; // Optional back to landing page
}

export function WelcomeScreen({ onStartSetupWizard, onLoadDemoData, onStartFresh, darkMode, onToggleDarkMode, onBack, onBackToLanding }: WelcomeScreenProps) {
  const { t } = useTranslation();
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  const gradientVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Floating Background Elements */}
      <motion.div
        className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-indigo-500' : 'bg-indigo-300'
        }`}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-purple-500' : 'bg-purple-300'
        }`}
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Dark Mode Toggle */}
      {onToggleDarkMode && (
        <motion.button
          onClick={onToggleDarkMode}
          className={`fixed top-4 right-4 p-3 rounded-full shadow-lg transition-all z-50 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
          }`}
          aria-label="Toggle dark mode"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      )}

      {/* Back Button (shown when accessed from within app) */}
      {onBack && (
        <button
          onClick={onBack}
          className={`fixed top-4 left-4 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all z-50 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      )}

      {/* Back to Homepage Button */}
      {onBackToLanding && (
        <motion.button
          onClick={onBackToLanding}
          className={`fixed bottom-6 left-6 px-4 py-3 rounded-full shadow-lg transition-all z-50 flex items-center gap-2 font-medium ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-indigo-400' 
              : 'bg-white hover:bg-gray-50 text-indigo-600 border border-gray-200'
          }`}
          aria-label="Back to homepage"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-4 h-4" />
          <span className="text-sm">Homepage</span>
        </motion.button>
      )}

      <motion.div 
        className="w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          {/* Star Icon in Circle */}
          <motion.div 
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg ${
              darkMode ? 'bg-indigo-500/20 backdrop-blur-sm' : 'bg-gradient-to-br from-indigo-100 to-purple-100'
            }`}
            variants={iconVariants}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkle className={`w-10 h-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </motion.div>
          
          {/* Gradient Title */}
          <motion.h1 
            className={`text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}
            style={{ 
              fontWeight: 800,
              backgroundSize: '200% auto'
            }}
            animate={{
              backgroundPosition: ['0% center', '100% center', '0% center']
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {t('welcome.title')}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className={`text-lg md:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            variants={itemVariants}
          >
            {t('welcome.subtitle')}
          </motion.p>
          <motion.p
            className={`mt-4 text-base ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}
            variants={itemVariants}
          >
            {t('welcome.chooseOption')}
          </motion.p>
        </motion.div>

        {/* Options Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {/* Setup Wizard */}
          <motion.div
            className={`rounded-2xl shadow-xl p-8 border cursor-pointer ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 hover:border-indigo-500' 
                : 'bg-white border-gray-100 hover:border-indigo-500'
            }`}
            onClick={onStartSetupWizard}
            variants={cardVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <motion.div 
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                  darkMode ? 'bg-indigo-500/20' : 'bg-indigo-50'
                }`}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Wand2 className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </motion.div>
              <h3 className={`text-xl mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('welcome.setupWizard')}
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('welcome.setupWizardDesc')}
              </p>
              <motion.button
                onClick={onStartSetupWizard}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('welcome.startWizard')} <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                ✓ Business setup<br />
                ✓ CSV/Excel import<br />
                ✓ Data validation<br />
                ✓ Ready in 3 steps
              </p>
            </div>
          </motion.div>

          {/* Demo Data */}
          <motion.div
            className={`rounded-2xl shadow-xl p-8 border cursor-pointer ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 hover:border-green-500' 
                : 'bg-white border-gray-100 hover:border-green-500'
            }`}
            onClick={onLoadDemoData}
            variants={cardVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <motion.div 
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                  darkMode ? 'bg-green-500/20' : 'bg-green-50'
                }`}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Database className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </motion.div>
              <h3 className={`text-xl mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('welcome.loadDemo')}
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('welcome.loadDemoDesc')}
              </p>
              <motion.button
                onClick={onLoadDemoData}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('welcome.loadDemoButton')} <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                ✓ 50+ products<br />
                ✓ 100+ sales records<br />
                ✓ 3 store locations<br />
                ✓ Instant preview
              </p>
            </div>
          </motion.div>

          {/* Start Fresh */}
          <motion.div
            className={`rounded-2xl shadow-xl p-8 border cursor-pointer ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 hover:border-purple-500' 
                : 'bg-white border-gray-100 hover:border-purple-500'
            }`}
            onClick={onStartFresh}
            variants={cardVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <motion.div 
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                  darkMode ? 'bg-purple-500/20' : 'bg-purple-50'
                }`}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <FileSpreadsheet className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </motion.div>
              <h3 className={`text-xl mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('welcome.startFresh')}
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('welcome.startFreshDesc')}
              </p>
              <motion.button
                onClick={onStartFresh}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('welcome.startFreshButton')} <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                ✓ Empty dashboard<br />
                ✓ Manual entry<br />
                ✓ Import anytime<br />
                ✓ Full control
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* What you can do with this system */}
        <motion.div 
          className={`mb-8 p-8 rounded-2xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          } shadow-lg`}
          variants={itemVariants}
        >
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              <Sparkles className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </motion.div>
            <h2 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('welcome.whatYouCanDo')}
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {/* Product Management */}
            <motion.div 
              className="flex items-start gap-4"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className={`p-3 rounded-lg ${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Package className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </motion.div>
              <div className="flex-1">
                <h3 className={`text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('welcome.productManagement')}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('welcome.productManagementDesc')}
                </p>
              </div>
            </motion.div>

            {/* Sales Tracking */}
            <motion.div 
              className="flex items-start gap-4"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className={`p-3 rounded-lg ${darkMode ? 'bg-green-500/20' : 'bg-green-50'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <ShoppingCart className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </motion.div>
              <div className="flex-1">
                <h3 className={`text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('welcome.salesTracking')}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('welcome.salesTrackingDesc')}
                </p>
              </div>
            </motion.div>

            {/* Real-time KPIs */}
            <motion.div 
              className="flex items-start gap-4"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className={`p-3 rounded-lg ${darkMode ? 'bg-purple-500/20' : 'bg-purple-50'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </motion.div>
              <div className="flex-1">
                <h3 className={`text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('welcome.realtimeKPIs')}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('welcome.realtimeKPIsDesc')}
                </p>
              </div>
            </motion.div>

            {/* Automated Reports */}
            <motion.div 
              className="flex items-start gap-4"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className={`p-3 rounded-lg ${darkMode ? 'bg-orange-500/20' : 'bg-orange-50'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <FileText className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              </motion.div>
              <div className="flex-1">
                <h3 className={`text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('welcome.automatedReports')}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('welcome.automatedReportsDesc')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          className={`text-center p-6 rounded-xl ${
            darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'
          }`}
          variants={itemVariants}
        >
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            💡 <strong>Tip:</strong> You can always access the Setup Wizard later from the Data Import page, 
            or load demo data anytime to explore features.
          </p>
        </motion.div>

        <motion.p 
          className={`text-center mt-8 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}
          variants={itemVariants}
        >
          © 2026 ShelfIQ Analytics. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}