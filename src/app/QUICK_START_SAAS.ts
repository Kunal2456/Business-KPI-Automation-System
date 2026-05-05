/**
 * 🚀 QUICK START - SAAS INTEGRATION
 * 
 * Copy and paste these code snippets into your App.tsx to enable SaaS features
 * 
 * STEP 1: Add imports at the top of App.tsx
 */

// Add these imports
import { EnhancedAuthPage } from './components/EnhancedAuthPage';
import { SignupWizard } from './components/SignupWizard';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { Toaster, toast } from 'sonner';
import { canAddProduct, canAddSale, getSubscriptionLimits, hasFeature } from './utils/subscriptionLimits';

/**
 * STEP 2: Add new state variables (add after existing useState declarations)
 */

const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
const [showSignupWizard, setShowSignupWizard] = useState(false);
const [subscriptionPlan, setSubscriptionPlan] = useState<string>('free');
const [organizationId, setOrganizationId] = useState<string>('');

/**
 * STEP 3: Add handler functions (add after existing handler functions)
 */

// Show signup wizard
const handleShowSignup = () => {
  setShowSubscriptionPlans(false);
  setShowSignupWizard(true);
};

// Show subscription plans
const handleShowPlans = () => {
  setShowSignupWizard(false);
  setShowSubscriptionPlans(true);
};

// Handle plan selection
const handleSelectPlan = (plan: 'free' | 'starter' | 'professional' | 'enterprise') => {
  setSubscriptionPlan(plan);
  setShowSubscriptionPlans(false);
  setShowSignupWizard(true);
  localStorage.setItem('selectedPlan', plan);
  toast.success(`${plan === 'free' ? 'Free Trial' : plan.charAt(0).toUpperCase() + plan.slice(1)} plan selected!`);
};

// Handle signup completion
const handleSignupComplete = (userData: {
  user: Omit<User, 'id'>;
  businessInfo: {
    name: string;
    industry: string;
    storeCount: number;
    phoneNumber: string;
    address: string;
  };
}) => {
  // Create organization ID
  const orgId = `ORG${Date.now()}`;
  setOrganizationId(orgId);
  
  // Get selected plan (default to free if not set)
  const selectedPlan = localStorage.getItem('selectedPlan') || 'free';
  
  // Calculate trial end date (14 days from now)
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);
  
  // Create user with proper role and subscription info
  const newUser: User = {
    id: `U${Date.now()}`,
    ...userData.user,
    role: 'admin', // First user is always admin
    subscriptionPlan: selectedPlan as any,
    subscriptionStatus: 'trial',
    trialEndsAt
  };
  
  // Save business info
  setBusinessName(userData.businessInfo.name);
  localStorage.setItem('businessName', userData.businessInfo.name);
  localStorage.setItem('organizationId', orgId);
  localStorage.setItem('businessInfo', JSON.stringify(userData.businessInfo));
  
  // Add user to users array
  const updatedUsers = [...users, newUser];
  setUsers(updatedUsers);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  // Auto-login the new user
  setCurrentUser(newUser);
  setShowSignupWizard(false);
  
  // Mark setup as completed
  localStorage.setItem('setupCompleted', 'true');
  
  // Show success message
  toast.success(`Welcome to Retail KPI System! Your 14-day free trial has started. 🎉`);
};

// Back from signup
const handleBackFromSignup = () => {
  setShowSignupWizard(false);
};

// Back from plans
const handleBackFromPlans = () => {
  setShowSubscriptionPlans(false);
};

/**
 * STEP 4: Update existing handlers to check limits
 */

// Update handleAddProduct (replace existing one)
const handleAddProduct = (product: Omit<Product, 'id'>) => {
  const userPlan = currentUser?.subscriptionPlan || 'free';
  const { allowed, limit, remaining } = canAddProduct(products.length, userPlan);
  
  if (!allowed) {
    toast.error(
      `Product limit reached (${limit} products). Upgrade your plan to add more.`,
      {
        action: {
          label: 'Upgrade',
          onClick: () => setShowSubscriptionPlans(true)
        }
      }
    );
    return;
  }
  
  const newProduct: Product = {
    ...product,
    id: `P${Date.now()}`
  };
  
  setProducts([...products, newProduct]);
  toast.success(`Product added successfully! (${remaining} slots remaining)`);
};

// Update handleAddSale (replace existing one)
const handleAddSale = (sale: Omit<Sale, 'id'>) => {
  const userPlan = currentUser?.subscriptionPlan || 'free';
  const { allowed, limit } = canAddSale(sales.length, userPlan);
  
  if (!allowed) {
    toast.error(
      `Sales record limit reached (${limit} records). Upgrade to unlimited.`,
      {
        action: {
          label: 'Upgrade',
          onClick: () => setShowSubscriptionPlans(true)
        }
      }
    );
    return;
  }
  
  const newSale: Sale = {
    ...sale,
    id: `S${Date.now()}`
  };
  
  // Update product stock
  const product = products.find(p => p.id === sale.productId);
  if (product && product.currentStock >= sale.quantity) {
    handleUpdateProduct(sale.productId, {
      currentStock: product.currentStock - sale.quantity
    });
    setSales([newSale, ...sales]);
    toast.success('Sale recorded successfully!');
  } else {
    toast.error('Insufficient stock!');
  }
};

/**
 * STEP 5: Update rendering logic (replace existing auth checks)
 */

// Add before the existing return statement:

// Show Subscription Plans
if (showSubscriptionPlans) {
  return (
    <SubscriptionPlans
      onSelectPlan={handleSelectPlan}
      darkMode={darkMode}
    />
  );
}

// Show Signup Wizard
if (showSignupWizard) {
  return (
    <SignupWizard
      onComplete={handleSignupComplete}
      onBack={handleBackFromSignup}
      darkMode={darkMode}
    />
  );
}

// Show Login (replace existing AuthPage component)
if (!currentUser) {
  return (
    <EnhancedAuthPage
      onLogin={handleLogin}
      users={users}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
      onShowSignup={handleShowSignup}
      onShowPlans={handleShowPlans}
    />
  );
}

/**
 * STEP 6: Add Toaster to main return (add as first child in return)
 */

return (
  <>
    <Toaster 
      position="top-right" 
      theme={darkMode ? 'dark' : 'light'}
      richColors
      closeButton
    />
    
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* ... rest of your existing JSX */}
    </div>
  </>
);

/**
 * STEP 7: Update types/index.ts - Add these to User interface
 */

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'analyst';
  storeLocation?: string;
  // Add these new fields:
  subscriptionPlan?: 'free' | 'starter' | 'professional' | 'enterprise';
  subscriptionStatus?: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt?: Date;
}

/**
 * STEP 8: Install required dependency
 */

// Run in terminal:
// npm install sonner

/**
 * STEP 9: Test the new flow
 */

// 1. Clear localStorage to test fresh signup
// 2. Refresh the page
// 3. Click "Create Free Account"
// 4. Complete the signup wizard
// 5. Try adding products and check limits
// 6. Click "Upgrade" when limit is reached
// 7. See subscription plans

/**
 * STEP 10: Optional - Add subscription info to sidebar
 */

// Add this inside the desktop sidebar (after user info):

{currentUser && currentUser.subscriptionPlan && (
  <div className={`mb-4 p-3 rounded-lg border ${
    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'
  }`}>
    <div className="flex items-center justify-between mb-2">
      <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Current Plan
      </span>
      <span className={`text-xs px-2 py-1 rounded-full ${
        currentUser.subscriptionPlan === 'professional' 
          ? 'bg-purple-600 text-white'
          : currentUser.subscriptionPlan === 'starter'
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-500 text-white'
      }`}>
        {currentUser.subscriptionPlan === 'free' ? 'Free Trial' : 
         currentUser.subscriptionPlan.charAt(0).toUpperCase() + currentUser.subscriptionPlan.slice(1)}
      </span>
    </div>
    {currentUser.subscriptionStatus === 'trial' && currentUser.trialEndsAt && (
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Trial ends in {Math.ceil((new Date(currentUser.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
      </p>
    )}
    <button
      onClick={() => setShowSubscriptionPlans(true)}
      className="w-full mt-2 text-xs py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded font-medium"
    >
      Upgrade Plan
    </button>
  </div>
)}

/**
 * STEP 11: Optional - Add usage stats
 */

// Add this helper function:
const getUsageStats = () => {
  const plan = currentUser?.subscriptionPlan || 'free';
  const limits = getSubscriptionLimits(plan);
  
  return {
    products: {
      current: products.length,
      max: limits.maxProducts,
      percentage: Math.min(100, (products.length / limits.maxProducts) * 100)
    },
    sales: {
      current: sales.length,
      max: limits.maxSales,
      percentage: limits.maxSales ? Math.min(100, (sales.length / limits.maxSales) * 100) : 0
    }
  };
};

// Display in sidebar:
const usageStats = getUsageStats();

<div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
  <div>
    <div className="flex justify-between mb-1">
      <span>Products</span>
      <span>{usageStats.products.current} / {usageStats.products.max}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div 
        className={`h-1.5 rounded-full ${
          usageStats.products.percentage > 80 ? 'bg-red-500' : 
          usageStats.products.percentage > 60 ? 'bg-yellow-500' : 
          'bg-green-500'
        }`}
        style={{ width: `${usageStats.products.percentage}%` }}
      />
    </div>
  </div>
</div>

/**
 * ✅ DONE! Your SaaS transformation is complete!
 * 
 * What you get:
 * - Professional signup flow with 4-step wizard
 * - Subscription plans with pricing tiers
 * - Automatic limit enforcement
 * - Upgrade prompts with smooth UX
 * - Trial period tracking
 * - Demo accounts for testing
 * - Dark mode support
 * - Toast notifications
 * 
 * Next steps:
 * 1. Test the complete flow
 * 2. Add payment integration (Razorpay/Stripe)
 * 3. Set up backend (Supabase recommended)
 * 4. Configure email service
 * 5. Deploy to production
 */
