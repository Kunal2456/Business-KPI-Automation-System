import { useState } from 'react';
import { User } from '../types';
import { LayoutDashboard, Mail, Lock, User as UserIcon, Building2, AlertCircle, CheckCircle, Moon, Sun } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: User) => void;
  users: User[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type AuthView = 'signin' | 'signup' | 'forgot-password';

export function AuthPage({ onLogin, users, darkMode, onToggleDarkMode }: AuthPageProps) {
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
      setError('Invalid email or password');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (users.find(u => u.email === email)) {
      setError('Email already exists');
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
    setSuccess('Account created successfully! Signing you in...');
    
    setTimeout(() => {
      onLogin(newUser);
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    const user = users.find(u => u.email === email);
    
    if (user) {
      setSuccess(`Password reset link sent to ${email}. Please check your inbox.`);
      setEmail('');
    } else {
      setError('No account found with this email');
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
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} flex items-center justify-center p-4 relative`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={onToggleDarkMode}
        className={`fixed top-4 right-4 p-3 rounded-full shadow-lg transition-all z-50 ${
          darkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${
            darkMode ? 'bg-indigo-500' : 'bg-indigo-600'
          }`}>
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Retail KPI System</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Business Intelligence & Analytics Platform</p>
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
              Sign In
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
              Sign Up
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
                <label htmlFor="email" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
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
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'manager' | 'analyst')}
                  className={selectClass}
                >
                  <option value="manager">Manager</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {role === 'manager' && (
                <div>
                  <label htmlFor="store" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Store Location</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="store"
                      type="text"
                      value={storeLocation}
                      onChange={(e) => setStoreLocation(e.target.value)}
                      className={inputClass}
                      placeholder="Store A"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="signup-password" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Account
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {view === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-center mb-4">
                <h3 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reset Password</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Enter your email to receive a reset link</p>
              </div>

              <div>
                <label htmlFor="forgot-email" className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Send Reset Link
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
                Back to Sign In
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
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Demo Credentials:</p>
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
          © 2026 ShelfIQ Analytics. All rights reserved.
        </p>
      </div>
    </div>
  );
}