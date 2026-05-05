import { useState } from 'react';
import { User } from '../types';
import { LayoutDashboard, Mail, Lock, User as UserIcon, Building2, AlertCircle, CheckCircle, Moon, Sun, Wand2, TrendingUp, BarChart3, PieChart, Activity, DollarSign, ShoppingCart, Package, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface AuthPageProps {
  onLogin: (user: User) => void;
  users: User[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenWelcomeScreen?: () => void;
  onBackToLanding?: () => void;
}

type AuthView = 'signin' | 'signup' | 'forgot-password';

export function AuthPage({ onLogin, users, darkMode, onToggleDarkMode, onOpenWelcomeScreen, onBackToLanding }: AuthPageProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<AuthView>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'analyst'>('manager');
  const [storeLocation, setStoreLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError(t('auth.invalidEmailOrPassword'));
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError(t('auth.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    if (users.find(u => u.email === email)) {
      setError(t('auth.emailAlreadyExists'));
      return;
    }

    const newUser: User = {
      id: `U${Date.now()}`,
      name,
      email,
      password,
      role,
      storeLocation: role === 'manager' ? storeLocation : undefined
    };

    users.push(newUser);
    setSuccess(t('auth.accountCreatedSuccess'));

    setTimeout(() => {
      onLogin(newUser);
      if (onOpenWelcomeScreen) {
        onOpenWelcomeScreen();
      }
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError(t('auth.enterYourEmail'));
      return;
    }

    const user = users.find(u => u.email === email);

    if (user) {
      setSuccess(t('auth.passwordResetSent', { email }));
      setEmail('');
    } else {
      setError(t('auth.noAccountFound'));
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setRole('manager');
    setStoreLocation('');
    setError('');
    setSuccess('');
  };

  const switchView = (newView: AuthView) => {
    resetForm();
    setView(newView);
  };

  const inputClass = `w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
  }`;

  const selectClass = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
  }`;

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

      {/* Business Intelligence Decorative Elements - Left Side */}
      <motion.div
        className={`hidden lg:block absolute left-12 top-1/4 ${darkMode ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} rounded-2xl p-6 shadow-xl`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('auth.revenueGrowth')}</p>
            <p className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}>+24.5%</p>
          </div>
        </div>
        <div className="flex gap-1 h-16 items-end">
          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className={`hidden lg:block absolute left-12 bottom-1/4 ${darkMode ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} rounded-2xl p-6 shadow-xl`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('auth.totalSales')}</p>
            <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>15,847</p>
          </div>
        </div>
        <motion.div
          className="relative w-24 h-24 mx-auto"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={darkMode ? '#374151' : '#e5e7eb'}
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#gradient-blue)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 251.2' }}
              animate={{ strokeDasharray: '188.4 251.2' }}
              transition={{ duration: 1.5, delay: 1 }}
            />
            <defs>
              <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>75%</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Business Intelligence Decorative Elements - Right Side */}
      <motion.div
        className={`hidden lg:block absolute right-12 top-1/4 ${darkMode ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} rounded-2xl p-6 shadow-xl`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Package className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Inventory Status</p>
            <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>2,456 Items</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: 'In Stock', value: 85, color: 'from-green-500 to-emerald-500' },
            { label: 'Low Stock', value: 12, color: 'from-yellow-500 to-orange-500' },
            { label: 'Out of Stock', value: 3, color: 'from-red-500 to-rose-500' }
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.label}</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.value}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: 0.6 + i * 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={`hidden lg:block absolute right-12 bottom-1/4 ${darkMode ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} rounded-2xl p-6 shadow-xl`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <DollarSign className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profit Margin</p>
            <p className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>32.8%</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Q1', value: 28, height: 60 },
            { label: 'Q2', value: 32, height: 80 },
            { label: 'Q3', value: 35, height: 90 }
          ].map((quarter, i) => (
            <div key={i} className="text-center">
              <div className="h-16 flex items-end justify-center mb-2">
                <motion.div
                  className="w-8 bg-gradient-to-t from-orange-500 to-amber-400 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${quarter.height}%` }}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.2 }}
                />
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{quarter.label}</p>
              <p className={`text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>{quarter.value}%</p>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Dark Mode Toggle */}
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

      {/* Back to Homepage Button */}
      {onBackToLanding && (
        <motion.button
          onClick={onBackToLanding}
          className={`fixed top-4 left-4 px-4 py-2.5 rounded-full shadow-lg transition-all z-50 flex items-center gap-2 font-medium ${
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

      {/* Welcome Screen Button */}
      {onOpenWelcomeScreen && (
        <motion.button
          onClick={onOpenWelcomeScreen}
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-all ${
            darkMode 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          } text-white group`}
          title="Setup Wizard"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Wand2 className="w-6 h-6" />
          <span className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
          }`}>
            Setup Wizard
          </span>
        </motion.button>
      )}

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${
            darkMode ? 'bg-indigo-500' : 'bg-indigo-600'
          }`}>
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('auth.title')}</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('auth.subtitle')}</p>
        </div>

        {/* Auth Card */}
        <div className={`rounded-2xl shadow-xl p-8 border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          {/* View Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => switchView('signin')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                view === 'signin'
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('auth.signInTab')}
            </button>
            <button
              onClick={() => switchView('signup')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                view === 'signup'
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('auth.signUpTab')}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
              darkMode 
                ? 'bg-red-900/30 border border-red-800' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
              darkMode 
                ? 'bg-green-900/30 border border-green-800' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-800'}`}>{success}</p>
            </div>
          )}

          {/* Sign In Form */}
          {view === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder={t('auth.passwordPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchView('forgot-password')}
                  className="text-sm text-indigo-500 hover:text-indigo-600"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('auth.loginButton')}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('auth.fullName')}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder={t('auth.namePlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('auth.role')}</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'manager' | 'analyst')}
                  className={selectClass}
                >
                  <option value="manager">{t('auth.manager')}</option>
                  <option value="analyst">{t('auth.analyst')}</option>
                  <option value="admin">{t('auth.admin')}</option>
                </select>
              </div>

              {role === 'manager' && (
                <div>
                  <label htmlFor="store" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('auth.storeLocation')}</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="store"
                      type="text"
                      value={storeLocation}
                      onChange={(e) => setStoreLocation(e.target.value)}
                      className={inputClass}
                      placeholder={t('auth.storeLocationPlaceholder')}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="signup-password" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder={t('auth.passwordPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('auth.confirmPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    placeholder={t('auth.passwordPlaceholder')}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('auth.signupButton')}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {view === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-center mb-4">
                <h3 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('auth.resetPasswordTitle')}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('auth.resetPasswordSubtitle')}</p>
              </div>

              <div>
                <label htmlFor="forgot-email" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('auth.sendResetLink')}
              </button>

              <button
                type="button"
                onClick={() => switchView('signin')}
                className={`w-full py-3 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('auth.backToSignIn')}
              </button>
            </form>
          )}

          {/* Demo Credentials */}
          {view === 'signin' && (
            <div className={`mt-6 p-4 rounded-lg border ${
              darkMode
                ? 'bg-gray-700/50 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('auth.demoCredentials')}</p>
              <div className={`space-y-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>• Admin: admin@retail.com / admin123</p>
                <p>• Manager A: manager@retail.com / manager123</p>
                <p>• Manager B: managerb@retail.com / manager123</p>
                <p>• Analyst: analyst@retail.com / analyst123</p>
              </div>
            </div>
          )}
        </div>

        <p className={`text-center mt-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          {t('auth.copyright')}
        </p>
      </motion.div>
    </div>
  );
}