import { useState } from 'react';
import { User } from '../types';
import { LayoutDashboard, Mail, Lock, AlertCircle, CheckCircle, Moon, Sun, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedAuthPageProps {
  onLogin: (user: User) => void;
  users: User[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowSignup: () => void;
  onShowPlans: () => void;
}

export function EnhancedAuthPage({ 
  onLogin, 
  users, 
  darkMode, 
  onToggleDarkMode,
  onShowSignup,
  onShowPlans 
}: EnhancedAuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { email: 'admin@retail.com', password: 'admin123', role: 'Admin', color: 'from-red-500 to-red-600' },
    { email: 'manager@retail.com', password: 'manager123', role: 'Manager', color: 'from-blue-500 to-blue-600' },
    { email: 'analyst@retail.com', password: 'analyst123', role: 'Analyst', color: 'from-green-500 to-green-600' }
  ];

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const user = users.find(u => u.email === demoEmail && u.password === demoPassword);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <motion.div
        className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-indigo-500' : 'bg-indigo-300'}`}
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
        className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-purple-500' : 'bg-purple-300'}`}
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
      <button
        onClick={onToggleDarkMode}
        className={`fixed top-4 right-4 p-3 rounded-full shadow-lg transition-all z-50 ${
          darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Branding */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${darkMode ? 'bg-indigo-500' : 'bg-indigo-600'}`}>
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Retail KPI System
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Business Intelligence & Analytics Platform
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div 
          className={`rounded-2xl shadow-xl p-8 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome Back
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{error}</p>
            </motion.div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className={`absolute inset-0 flex items-center`}>
              <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Button */}
          <motion.button
            onClick={onShowSignup}
            className={`w-full py-3 rounded-lg font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
              darkMode 
                ? 'border-gray-600 text-white hover:bg-gray-700' 
                : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* View Plans Link */}
          <div className="text-center mt-4">
            <button
              onClick={onShowPlans}
              className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              View pricing plans →
            </button>
          </div>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div 
          className={`mt-6 p-6 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200 backdrop-blur-sm'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Try Demo Accounts
            </p>
          </div>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account.email, account.password)}
                className={`w-full p-3 rounded-lg text-left transition-all border ${
                  darkMode 
                    ? 'bg-gray-700/50 hover:bg-gray-700 border-gray-600' 
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold text-white bg-gradient-to-r ${account.color}`}>
                        {account.role}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {account.email}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.p 
          className={`text-center mt-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          © 2026 ShelfIQ Analytics. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}