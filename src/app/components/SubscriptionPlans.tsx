import { Check, X, Sparkles, TrendingUp, Building2, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionPlansProps {
  onSelectPlan: (plan: 'free' | 'starter' | 'professional' | 'enterprise') => void;
  darkMode: boolean;
}

export function SubscriptionPlans({ onSelectPlan, darkMode }: SubscriptionPlansProps) {
  const plans = [
    {
      id: 'free' as const,
      name: 'Free Trial',
      price: '₹0',
      period: '14 days',
      description: 'Perfect for trying out the platform',
      icon: Sparkles,
      color: 'from-gray-600 to-gray-700',
      features: [
        { text: 'Up to 50 products', included: true },
        { text: 'Up to 100 sales records', included: true },
        { text: '1 store location', included: true },
        { text: '1 user account', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Email support', included: true },
        { text: 'Advanced reports', included: false },
        { text: 'Multi-store', included: false },
        { text: 'API access', included: false },
      ],
      buttonText: 'Start Free Trial',
      popular: false
    },
    {
      id: 'starter' as const,
      name: 'Starter',
      price: '₹999',
      period: '/month',
      description: 'For small businesses getting started',
      icon: TrendingUp,
      color: 'from-indigo-600 to-indigo-700',
      features: [
        { text: 'Up to 500 products', included: true },
        { text: 'Unlimited sales records', included: true },
        { text: 'Up to 2 store locations', included: true },
        { text: 'Up to 3 users', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Custom reports', included: true },
        { text: 'Data export', included: true },
        { text: 'API access', included: false },
      ],
      buttonText: 'Get Started',
      popular: true
    },
    {
      id: 'professional' as const,
      name: 'Professional',
      price: '₹2,999',
      period: '/month',
      description: 'For growing businesses',
      icon: Building2,
      color: 'from-purple-600 to-purple-700',
      features: [
        { text: 'Unlimited products', included: true },
        { text: 'Unlimited sales records', included: true },
        { text: 'Up to 10 store locations', included: true },
        { text: 'Up to 10 users', included: true },
        { text: 'Advanced analytics & forecasting', included: true },
        { text: '24/7 priority support', included: true },
        { text: 'Custom reports & dashboards', included: true },
        { text: 'Data export & backup', included: true },
        { text: 'API access', included: true },
        { text: 'Inventory optimization', included: true },
        { text: 'WhatsApp alerts', included: true },
      ],
      buttonText: 'Upgrade Now',
      popular: false
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large businesses',
      icon: Crown,
      color: 'from-amber-600 to-amber-700',
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Unlimited stores & users', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'On-premise deployment option', included: true },
        { text: 'White-label solution', included: true },
        { text: 'Custom training', included: true },
        { text: 'SLA guarantee', included: true },
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} py-12 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Choose Your Plan
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Start with a free trial. Upgrade anytime.
          </p>
          <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'}`}>
            <Check className="w-5 h-5" />
            <span className="font-medium">No credit card required for trial</span>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`h-full rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 ${plan.popular ? 'border-indigo-500 shadow-xl' : ''} overflow-hidden`}>
                  {/* Header */}
                  <div className={`p-6 bg-gradient-to-r ${plan.color} text-white`}>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-8 h-8" />
                      {plan.popular && (
                        <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                          BEST VALUE
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-sm opacity-90">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${feature.included ? (darkMode ? 'text-gray-300' : 'text-gray-700') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      onClick={() => onSelectPlan(plan.id)}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg'
                          : darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {plan.buttonText}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Questions about pricing? {' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Contact our sales team
            </a>
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              ✓ Cancel anytime
            </div>
            <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              ✓ 14-day money-back guarantee
            </div>
            <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              ✓ Secure payments
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Trusted by 1,000+ businesses across India
          </p>
          <div className="flex justify-center gap-8 opacity-50">
            <div className={`text-2xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Razorpay</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Stripe</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>PayPal</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
