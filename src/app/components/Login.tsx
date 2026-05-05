import { useState } from 'react';
import { User } from '../types';
import { LogIn, KeyRound } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

export function Login({ onLogin, users }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
  };

  const quickLogin = (role: 'admin' | 'manager' | 'analyst') => {
    const user = users.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">ShelfIQ</h1>
          <p className="text-gray-600">Smart Inventory Intelligence Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5" />
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-center mb-4">Quick Login (Demo)</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickLogin('admin')}
              className="px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => quickLogin('manager')}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Manager
            </button>
            <button
              onClick={() => quickLogin('analyst')}
              className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              Analyst
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-center">
            Demo Credentials:
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-gray-700">Admin: admin@retail.com / admin123</p>
            <p className="text-gray-700">Manager: manager@retail.com / manager123</p>
            <p className="text-gray-700">Analyst: analyst@retail.com / analyst123</p>
          </div>
        </div>
      </div>
    </div>
  );
}