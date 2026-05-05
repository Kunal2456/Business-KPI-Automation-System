export interface SubscriptionLimits {
  maxProducts: number;
  maxSales: number | null; // null = unlimited
  maxStores: number;
  maxUsers: number;
  features: {
    advancedAnalytics: boolean;
    customReports: boolean;
    apiAccess: boolean;
    multiStore: boolean;
    dataExport: boolean;
    prioritySupport: boolean;
    whatsappAlerts: boolean;
    deadStockAlerts: boolean;
    inventoryForecasting: boolean;
  };
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    maxProducts: 50,
    maxSales: 100,
    maxStores: 1,
    maxUsers: 1,
    features: {
      advancedAnalytics: false,
      customReports: false,
      apiAccess: false,
      multiStore: false,
      dataExport: false,
      prioritySupport: false,
      whatsappAlerts: false,
      deadStockAlerts: true,
      inventoryForecasting: false
    }
  },
  starter: {
    maxProducts: 500,
    maxSales: null, // unlimited
    maxStores: 2,
    maxUsers: 3,
    features: {
      advancedAnalytics: true,
      customReports: true,
      apiAccess: false,
      multiStore: true,
      dataExport: true,
      prioritySupport: false,
      whatsappAlerts: false,
      deadStockAlerts: true,
      inventoryForecasting: false
    }
  },
  professional: {
    maxProducts: 999999, // effectively unlimited
    maxSales: null,
    maxStores: 10,
    maxUsers: 10,
    features: {
      advancedAnalytics: true,
      customReports: true,
      apiAccess: true,
      multiStore: true,
      dataExport: true,
      prioritySupport: true,
      whatsappAlerts: true,
      deadStockAlerts: true,
      inventoryForecasting: true
    }
  },
  enterprise: {
    maxProducts: 999999,
    maxSales: null,
    maxStores: 999999,
    maxUsers: 999999,
    features: {
      advancedAnalytics: true,
      customReports: true,
      apiAccess: true,
      multiStore: true,
      dataExport: true,
      prioritySupport: true,
      whatsappAlerts: true,
      deadStockAlerts: true,
      inventoryForecasting: true
    }
  }
};

export function getSubscriptionLimits(plan: string): SubscriptionLimits {
  return SUBSCRIPTION_LIMITS[plan] || SUBSCRIPTION_LIMITS.free;
}

export function canAddProduct(currentCount: number, plan: string): {
  allowed: boolean;
  limit: number;
  remaining: number;
} {
  const limits = getSubscriptionLimits(plan);
  const allowed = currentCount < limits.maxProducts;
  return {
    allowed,
    limit: limits.maxProducts,
    remaining: Math.max(0, limits.maxProducts - currentCount)
  };
}

export function canAddSale(currentCount: number, plan: string): {
  allowed: boolean;
  limit: number | null;
  remaining: number | null;
} {
  const limits = getSubscriptionLimits(plan);
  
  if (limits.maxSales === null) {
    return {
      allowed: true,
      limit: null,
      remaining: null
    };
  }
  
  const allowed = currentCount < limits.maxSales;
  return {
    allowed,
    limit: limits.maxSales,
    remaining: Math.max(0, limits.maxSales - currentCount)
  };
}

export function canAddStore(currentCount: number, plan: string): {
  allowed: boolean;
  limit: number;
  remaining: number;
} {
  const limits = getSubscriptionLimits(plan);
  const allowed = currentCount < limits.maxStores;
  return {
    allowed,
    limit: limits.maxStores,
    remaining: Math.max(0, limits.maxStores - currentCount)
  };
}

export function canAddUser(currentCount: number, plan: string): {
  allowed: boolean;
  limit: number;
  remaining: number;
} {
  const limits = getSubscriptionLimits(plan);
  const allowed = currentCount < limits.maxUsers;
  return {
    allowed,
    limit: limits.maxUsers,
    remaining: Math.max(0, limits.maxUsers - currentCount)
  };
}

export function hasFeature(plan: string, feature: keyof SubscriptionLimits['features']): boolean {
  const limits = getSubscriptionLimits(plan);
  return limits.features[feature];
}

export function getPlanName(plan: string): string {
  const names: Record<string, string> = {
    free: 'Free Trial',
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise'
  };
  return names[plan] || 'Free Trial';
}

export function getPlanPrice(plan: string): string {
  const prices: Record<string, string> = {
    free: '₹0',
    starter: '₹999/mo',
    professional: '₹2,999/mo',
    enterprise: 'Custom'
  };
  return prices[plan] || '₹0';
}

export function isTrialExpired(trialEndsAt?: Date): boolean {
  if (!trialEndsAt) return false;
  return new Date() > new Date(trialEndsAt);
}

export function getDaysUntilTrialExpiry(trialEndsAt?: Date): number {
  if (!trialEndsAt) return 0;
  const now = new Date();
  const end = new Date(trialEndsAt);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getRecommendedPlan(
  productCount: number,
  salesCount: number,
  storeCount: number,
  userCount: number
): string {
  // If exceeds professional limits, recommend enterprise
  if (storeCount > 10 || userCount > 10) {
    return 'enterprise';
  }
  
  // If exceeds starter limits, recommend professional
  if (productCount > 500 || storeCount > 2 || userCount > 3) {
    return 'professional';
  }
  
  // If exceeds free limits, recommend starter
  if (productCount > 50 || salesCount > 100 || storeCount > 1 || userCount > 1) {
    return 'starter';
  }
  
  return 'free';
}
