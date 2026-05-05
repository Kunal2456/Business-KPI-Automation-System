import { useState } from 'react';
import { User } from '../types';
import { ArrowRight, ArrowLeft, Building2, User as UserIcon, Mail, Lock, Store, Phone, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SignupWizardProps {
  onComplete: (userData: {
    user: Omit<User, 'id'>;
    businessInfo: {
      name: string;
      industry: string;
      storeCount: number;
      phoneNumber: string;
      address: string;
    };
  }) => void;
  onBack: () => void;
  darkMode: boolean;
}

export function SignupWizard({ onComplete, onBack, darkMode }: SignupWizardProps) {
  const [step, setStep] = useState(1);
  
  // User Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Business Info
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [storeCount, setStoreCount] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  
  // Store Info (for first store)
  const [storeName, setStoreName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const industries = [
    'Retail',
    'Grocery',
    'Fashion & Apparel',
    'Electronics',
    'Pharmacy',
    'Restaurant',
    'Jewelry',
    'Home & Garden',
    'Sports & Fitness',
    'Automotive',
    'Other'
  ];

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!industry) newErrors.industry = 'Please select an industry';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(phoneNumber.replace(/\D/g, ''))) newErrors.phoneNumber = 'Invalid phone number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!storeName.trim()) newErrors.storeName = 'Store name is required';
    if (!storeLocation.trim()) newErrors.storeLocation = 'Store location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handleComplete = () => {
    onComplete({
      user: {
        name: fullName,
        email,
        password, // In production, this should be hashed
        role: 'admin'
      },
      businessInfo: {
        name: businessName,
        industry,
        storeCount: parseInt(storeCount),
        phoneNumber,
        address
      }
    });
  };

  const inputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const errorClass = 'text-red-500 text-sm mt-1';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} flex items-center justify-center p-4`}>
      <motion.div 
        className={`w-full max-w-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 mb-4 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Create Your Account
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Get started with your retail business management
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {[1, 2, 3, 4].map((stepNum, idx) => (
              <div key={stepNum} className="flex flex-col items-center relative z-10" style={{ width: '25%' }}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= stepNum
                    ? 'bg-indigo-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNum ? <CheckCircle className="w-6 h-6" /> : stepNum}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  step >= stepNum
                    ? darkMode ? 'text-white' : 'text-gray-900'
                    : darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {stepNum === 1 ? 'Account' : stepNum === 2 ? 'Business' : stepNum === 3 ? 'Store' : 'Review'}
                </span>
                {idx < 3 && (
                  <div className={`absolute top-5 left-1/2 h-0.5 w-full ${
                    step > stepNum ? 'bg-indigo-600' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: User Account */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <UserIcon className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                placeholder="John Doe"
              />
              {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="john@example.com"
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Lock className="w-4 h-4 inline mr-2" />
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Minimum 8 characters"
              />
              {errors.password && <p className={errorClass}>{errors.password}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Lock className="w-4 h-4 inline mr-2" />
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
            </div>
          </motion.div>
        )}

        {/* Step 2: Business Information */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Building2 className="w-4 h-4 inline mr-2" />
                Business Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={inputClass}
                placeholder="Your Business Name"
              />
              {errors.businessName && <p className={errorClass}>{errors.businessName}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Briefcase className="w-4 h-4 inline mr-2" />
                Industry *
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className={inputClass}
              >
                <option value="">Select your industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              {errors.industry && <p className={errorClass}>{errors.industry}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Store className="w-4 h-4 inline mr-2" />
                Number of Stores
              </label>
              <select
                value={storeCount}
                onChange={(e) => setStoreCount(e.target.value)}
                className={inputClass}
              >
                <option value="1">1 Store</option>
                <option value="2">2-5 Stores</option>
                <option value="6">6-10 Stores</option>
                <option value="11">11+ Stores</option>
              </select>
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={inputClass}
                placeholder="+91 98765 43210"
              />
              {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <MapPin className="w-4 h-4 inline mr-2" />
                Business Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
                rows={3}
                placeholder="Full business address"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Store Setup */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-indigo-900/30 border border-indigo-800' : 'bg-indigo-50 border border-indigo-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                💡 Set up your first store location. You can add more stores later from the dashboard.
              </p>
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Store className="w-4 h-4 inline mr-2" />
                Store Name *
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className={inputClass}
                placeholder="Main Branch / Store A"
              />
              {errors.storeName && <p className={errorClass}>{errors.storeName}</p>}
            </div>

            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <MapPin className="w-4 h-4 inline mr-2" />
                Store Location *
              </label>
              <input
                type="text"
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
                className={inputClass}
                placeholder="Mumbai Central / Bangalore HSR"
              />
              {errors.storeLocation && <p className={errorClass}>{errors.storeLocation}</p>}
            </div>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Almost Done!
              </h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Review your information before continuing
              </p>
            </div>

            <div className={`rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 space-y-4`}>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account</p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fullName}</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{email}</p>
              </div>

              <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-4`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Business</p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{businessName}</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{industry} • {storeCount} store(s)</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{phoneNumber}</p>
              </div>

              <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-4`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>First Store</p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{storeName}</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{storeLocation}</p>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1" required />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <motion.button
              onClick={() => setStep(step - 1)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </motion.button>
          )}

          <motion.button
            onClick={step === 4 ? handleComplete : handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {step === 4 ? 'Create Account' : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
