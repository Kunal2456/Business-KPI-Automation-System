import { useState } from 'react';
import { OnboardingData } from '../types';
import { 
  Store, Building2, MapPin, User, Mail, Phone, Lock, 
  ArrowRight, ArrowLeft, Check, CheckCircle2, AlertCircle,
  FileText, CreditCard, Briefcase, Home, Globe, Calendar,
  Hash, Shield, Sparkles, Search
} from 'lucide-react';
import { fetchGSTINDetails, validateGSTINFormat } from '../utils/gstinLookup';

interface BusinessOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onSkipToDemo?: () => void;
  darkMode?: boolean;
}

const INDIAN_STATES = [
  { code: '01', name: 'Jammu and Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' }
];

const INDUSTRIES = [
  { value: 'RETAIL', label: 'Retail Store', icon: '🛍️' },
  { value: 'WHOLESALE', label: 'Wholesale/Distribution', icon: '📦' },
  { value: 'MANUFACTURING', label: 'Manufacturing', icon: '🏭' },
  { value: 'SERVICES', label: 'Services', icon: '💼' },
  { value: 'FOOD_BEVERAGE', label: 'Food & Beverage', icon: '🍽️' },
  { value: 'PHARMACY', label: 'Pharmacy/Medical', icon: '💊' },
  { value: 'ELECTRONICS', label: 'Electronics', icon: '📱' },
  { value: 'FASHION', label: 'Fashion/Apparel', icon: '👕' },
  { value: 'GROCERY', label: 'Grocery/Supermarket', icon: '🛒' },
  { value: 'OTHER', label: 'Other', icon: '🏢' }
];

export function BusinessOnboarding({ onComplete, onSkipToDemo, darkMode = false }: BusinessOnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    businessType: undefined,
    currency: 'INR',
    country: 'India',
    subscriptionPlan: 'FREE'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gstinLoading, setGstinLoading] = useState(false);
  const [gstinFetched, setGstinFetched] = useState(false);

  const totalSteps = formData.businessType === 'GST_REGISTERED' ? 6 : 5;

  // Update form field
  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Fetch GSTIN details
  const handleGSTINLookup = async () => {
    const gstin = formData.gstin?.trim();
    
    if (!gstin) {
      setErrors(prev => ({ ...prev, gstin: 'Please enter GSTIN' }));
      return;
    }

    if (!validateGSTINFormat(gstin)) {
      setErrors(prev => ({ ...prev, gstin: 'Invalid GSTIN format' }));
      return;
    }

    setGstinLoading(true);
    try {
      const details = await fetchGSTINDetails(gstin);
      
      if (details) {
        // Auto-fill business details from GSTIN
        setFormData(prev => ({
          ...prev,
          legalName: details.legalName,
          businessName: details.tradeName || details.legalName,
          address: details.address,
          state: details.state,
          stateCode: details.stateCode
        }));
        setGstinFetched(true);
      } else {
        setErrors(prev => ({ ...prev, gstin: 'GSTIN not found or invalid' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, gstin: 'Error fetching GSTIN details' }));
    } finally {
      setGstinLoading(false);
    }
  };

  // Validate current step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Business Type
        if (!formData.businessType) {
          newErrors.businessType = 'Please select your business type';
        }
        break;

      case 2: // Business Details
        if (!formData.businessName?.trim()) {
          newErrors.businessName = 'Business name is required';
        }
        if (!formData.legalName?.trim()) {
          newErrors.legalName = 'Legal name is required';
        }
        if (!formData.industry) {
          newErrors.industry = 'Please select an industry';
        }
        if (formData.businessType === 'GST_REGISTERED') {
          if (!formData.gstin?.trim()) {
            newErrors.gstin = 'GSTIN is required for GST registered businesses';
          } else if (!validateGSTINFormat(formData.gstin)) {
            newErrors.gstin = 'Invalid GSTIN format (e.g., 27AAAAA0000A1Z5)';
          }
        }
        break;

      case 3: // Address & Contact
        if (!formData.address?.trim()) {
          newErrors.address = 'Address is required';
        }
        if (!formData.city?.trim()) {
          newErrors.city = 'City is required';
        }
        if (!formData.state) {
          newErrors.state = 'State is required';
        }
        if (!formData.pincode?.trim()) {
          newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
          newErrors.pincode = 'Invalid pincode (6 digits)';
        }
        if (!formData.email?.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.phone?.trim()) {
          newErrors.phone = 'Phone is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
          newErrors.phone = 'Invalid Indian phone number';
        }
        break;

      case 4: // Owner Details
        if (!formData.ownerName?.trim()) {
          newErrors.ownerName = 'Owner name is required';
        }
        if (!formData.ownerEmail?.trim()) {
          newErrors.ownerEmail = 'Owner email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
          newErrors.ownerEmail = 'Invalid email format';
        }
        if (!formData.ownerPhone?.trim()) {
          newErrors.ownerPhone = 'Owner phone is required';
        }
        if (!formData.password?.trim()) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    if (validateStep()) {
      onComplete(formData as OnboardingData);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      {/* Demo Mode Floating Button */}
      {onSkipToDemo && (
        <button
          onClick={onSkipToDemo}
          className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-all hover:scale-110 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white group"
        >
          <Sparkles className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gray-900 text-white">
            Explore Demo
          </span>
        </button>
      )}

      <div className={`w-full max-w-4xl ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
        {/* Progress Header */}
        <div className={`p-6 ${darkMode ? 'bg-gray-900 border-b border-gray-700' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome to ShelfIQ</h1>
              <p className="text-indigo-100">Let's set up your business in minutes</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-indigo-100">Step {step} of {totalSteps}</div>
              <div className="text-xs text-indigo-200">~3 minutes</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-indigo-800 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  i + 1 < step 
                    ? 'bg-green-500 text-white' 
                    : i + 1 === step 
                    ? 'bg-white text-indigo-600' 
                    : 'bg-indigo-800 text-indigo-300'
                }`}>
                  {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <div className={`text-xs mt-1 ${
                  i + 1 === step ? 'text-white font-medium' : 'text-indigo-200'
                }`}>
                  {i === 0 && 'Type'}
                  {i === 1 && 'Business'}
                  {i === 2 && 'Address'}
                  {i === 3 && 'Owner'}
                  {i === 4 && 'Branches'}
                  {i === 5 && 'Plan'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {/* Step 1: Business Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  What type of business do you have?
                </h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  This helps us customize ShelfIQ for your needs
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* GST Registered */}
                <button
                  onClick={() => updateField('businessType', 'GST_REGISTERED')}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    formData.businessType === 'GST_REGISTERED'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : darkMode 
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      formData.businessType === 'GST_REGISTERED'
                        ? 'bg-indigo-600 text-white'
                        : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          GST Registered Business
                        </h3>
                        {formData.businessType === 'GST_REGISTERED' && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        I have a valid GSTIN and need GST-compliant invoices & reports
                      </p>
                      <div className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        ✓ Full GST features • Invoice generation • GSTR-1/3B reports
                      </div>
                    </div>
                  </div>
                </button>

                {/* Local Store */}
                <button
                  onClick={() => updateField('businessType', 'LOCAL_STORE')}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    formData.businessType === 'LOCAL_STORE'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : darkMode 
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      formData.businessType === 'LOCAL_STORE'
                        ? 'bg-indigo-600 text-white'
                        : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Store className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Local Store (No GST)
                        </h3>
                        {formData.businessType === 'LOCAL_STORE' && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        I'm a small business without GST registration
                      </p>
                      <div className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        ✓ Simple invoicing • Inventory management • Sales tracking
                      </div>
                    </div>
                  </div>
                </button>

                {/* Composition Scheme */}
                <button
                  onClick={() => updateField('businessType', 'COMPOSITION_SCHEME')}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    formData.businessType === 'COMPOSITION_SCHEME'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : darkMode 
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      formData.businessType === 'COMPOSITION_SCHEME'
                        ? 'bg-indigo-600 text-white'
                        : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Composition Scheme
                        </h3>
                        {formData.businessType === 'COMPOSITION_SCHEME' && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        I'm registered under GST Composition Scheme
                      </p>
                      <div className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        ✓ Simplified GST • Lower tax rates • Basic compliance
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {errors.businessType && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.businessType}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Building2 className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tell us about your business
                </h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Basic information we need to get started
                </p>
              </div>

              <div className="space-y-4">
                {/* GSTIN (only for GST registered) */}
                {formData.businessType === 'GST_REGISTERED' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      GSTIN Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.gstin || ''}
                        onChange={(e) => updateField('gstin', e.target.value.toUpperCase())}
                        placeholder="27AAAAA0000A1Z5"
                        maxLength={15}
                        className={`flex-1 px-4 py-3 rounded-lg border ${
                          errors.gstin 
                            ? 'border-red-500' 
                            : darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                      <button
                        onClick={handleGSTINLookup}
                        disabled={gstinLoading || !formData.gstin}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                      >
                        <Search className="w-4 h-4" />
                        {gstinLoading ? 'Fetching...' : 'Auto-Fill'}
                      </button>
                    </div>
                    {errors.gstin && (
                      <p className="text-red-500 text-sm mt-1">{errors.gstin}</p>
                    )}
                    {gstinFetched && (
                      <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Details fetched successfully from GSTIN
                      </p>
                    )}
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Click Auto-Fill to fetch business details from GST portal
                    </p>
                  </div>
                )}

                {/* Business Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessName || ''}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    placeholder="My Super Store"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.businessName 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                {/* Legal Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.legalName || ''}
                    onChange={(e) => updateField('legalName', e.target.value)}
                    placeholder="My Super Store Pvt Ltd"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.legalName 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.legalName && (
                    <p className="text-red-500 text-sm mt-1">{errors.legalName}</p>
                  )}
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    As registered with government authorities
                  </p>
                </div>

                {/* Industry */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind.value}
                        onClick={() => updateField('industry', ind.value)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.industry === ind.value
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                            : darkMode 
                            ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{ind.icon}</span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {ind.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.industry && (
                    <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address & Contact */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <MapPin className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Where is your business located?
                </h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Your registered business address
                </p>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Shop No. 123, MG Road"
                    rows={2}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.address 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* City & Pincode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Mumbai"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.city 
                          ? 'border-red-500' 
                          : darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.pincode || ''}
                      onChange={(e) => updateField('pincode', e.target.value)}
                      placeholder="400001"
                      maxLength={6}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.pincode 
                          ? 'border-red-500' 
                          : darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                {/* State */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state || ''}
                    onChange={(e) => {
                      const state = INDIAN_STATES.find(s => s.name === e.target.value);
                      updateField('state', e.target.value);
                      if (state) {
                        updateField('stateCode', state.code);
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.state 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state.code} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="contact@mybusiness.com"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Business Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Owner Details */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <User className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Create your account
                </h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  You'll use these credentials to log in
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName || ''}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.ownerName 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.ownerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail || ''}
                    onChange={(e) => updateField('ownerEmail', e.target.value)}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.ownerEmail 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.ownerEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.ownerPhone || ''}
                    onChange={(e) => updateField('ownerPhone', e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.ownerPhone 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.ownerPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.ownerPhone}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Create Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Min. 8 characters"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.password 
                        ? 'border-red-500' 
                        : darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Use at least 8 characters with a mix of letters and numbers
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  darkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 ml-auto"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2 ml-auto"
              >
                <Check className="w-4 h-4" />
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
