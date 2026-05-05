import { Crown, ArrowRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlanName } from '../utils/subscriptionLimits';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: string;
  currentPlan: string;
  recommendedPlan?: string;
  darkMode: boolean;
}

export function UpgradePrompt({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  feature, 
  currentPlan,
  recommendedPlan = 'professional',
  darkMode 
}: UpgradePromptProps) {
  
  const benefits = [
    'Unlimited products and sales',
    'Advanced analytics & forecasting',
    'Custom reports & dashboards',
    'Priority support',
    'API access',
    'Multi-store management',
    'Data export & backup',
    'WhatsApp alerts'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 p-8 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Upgrade Required</h2>
                  <p className="text-amber-100 text-sm">Unlock premium features</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Message */}
              <div className={`mb-6 p-4 rounded-lg ${
                darkMode ? 'bg-amber-900/20 border border-amber-800' : 'bg-amber-50 border border-amber-200'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                  <strong>{feature}</strong> is not available on the <strong>{getPlanName(currentPlan)}</strong> plan.
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Upgrade to unlock:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Highlight */}
              <div className={`p-4 rounded-lg mb-6 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Recommended Plan
                    </p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {getPlanName(recommendedPlan)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {recommendedPlan === 'starter' ? '₹999' : 
                       recommendedPlan === 'professional' ? '₹2,999' : 
                       'Custom'}
                    </p>
                    {recommendedPlan !== 'enterprise' && (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        per month
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Maybe Later
                </motion.button>
                
                <motion.button
                  onClick={onUpgrade}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upgrade Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Money-back guarantee */}
              <div className="mt-4 text-center">
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  💰 14-day money-back guarantee • Cancel anytime
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
