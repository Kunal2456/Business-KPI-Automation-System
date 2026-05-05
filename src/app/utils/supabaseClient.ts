import { createClient } from '@supabase/supabase-js';
import { 
  Business, Branch, User, Product, Customer, Sale, Alert,
  OnboardingData, SupabaseSchema 
} from '../types';

// Import Supabase credentials
// In production, these should come from environment variables
// For now, they'll be set in /utils/supabase/info.tsx
import { projectId, publicAnonKey } from './supabase/info';

// Create Supabase client
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// AUTHENTICATION
// ============================================

export const authService = {
  // Sign up new user with business
  async signUpWithBusiness(onboardingData: OnboardingData) {
    try {
      // 1. Create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: onboardingData.ownerEmail,
        password: onboardingData.password,
        options: {
          data: {
            name: onboardingData.ownerName,
            phone: onboardingData.ownerPhone
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // 2. Create business record
      const businessData: Partial<Business> = {
        owner_id: authData.user.id,
        business_name: onboardingData.businessName,
        legal_name: onboardingData.legalName,
        display_name: onboardingData.businessName,
        business_type: onboardingData.businessType,
        industry: onboardingData.industry as any,
        gstin: onboardingData.gstin,
        email: onboardingData.email,
        phone: onboardingData.phone,
        address: onboardingData.address,
        city: onboardingData.city,
        state: onboardingData.state,
        state_code: onboardingData.stateCode,
        pincode: onboardingData.pincode,
        country: 'India',
        subscription_plan: onboardingData.subscriptionPlan,
        subscription_status: 'TRIAL',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        date_format: 'DD/MM/YYYY',
        fiscal_year_start: 'APRIL',
        is_active: true,
        is_verified: false
      };

      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert([businessData])
        .select()
        .single();

      if (businessError) throw businessError;

      // 3. Create user record in users table
      const userData: Partial<User> = {
        auth_uid: authData.user.id,
        name: onboardingData.ownerName,
        email: onboardingData.ownerEmail,
        phone: onboardingData.ownerPhone,
        role: 'admin',
        business_id: business.id,
        is_active: true
      };

      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (userError) throw userError;

      // 4. Create headquarters branch
      const branchData: Partial<Branch> = {
        business_id: business.id,
        branch_name: `${onboardingData.businessName} - HQ`,
        branch_code: 'HQ',
        is_headquarters: true,
        address: onboardingData.address,
        city: onboardingData.city,
        state: onboardingData.state,
        state_code: onboardingData.stateCode,
        pincode: onboardingData.pincode,
        country: 'India',
        phone: onboardingData.phone,
        email: onboardingData.email,
        manager_id: user.id,
        manager_name: onboardingData.ownerName,
        gstin: onboardingData.gstin,
        is_active: true
      };

      const { data: branch, error: branchError } = await supabase
        .from('branches')
        .insert([branchData])
        .select()
        .single();

      if (branchError) throw branchError;

      return {
        success: true,
        user: authData.user,
        business,
        branch,
        userData: user
      };

    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create account'
      };
    }
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Get user details from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, businesses(*), branches(*)')
        .eq('auth_uid', data.user.id)
        .single();

      if (userError) throw userError;

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);

      return {
        success: true,
        user: data.user,
        userData,
        session: data.session
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to sign in'
      };
    }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { success: !error, error: error?.message };
  },

  // Get current session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

// ============================================
// BUSINESS OPERATIONS
// ============================================

export const businessService = {
  async getBusiness(businessId: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    return { data, error };
  },

  async updateBusiness(businessId: string, updates: Partial<Business>) {
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', businessId)
      .select()
      .single();

    return { data, error };
  }
};

// ============================================
// BRANCH OPERATIONS
// ============================================

export const branchService = {
  async getBranches(businessId: string) {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('business_id', businessId)
      .order('is_headquarters', { ascending: false });

    return { data, error };
  },

  async createBranch(branchData: Partial<Branch>) {
    const { data, error } = await supabase
      .from('branches')
      .insert([branchData])
      .select()
      .single();

    return { data, error };
  },

  async updateBranch(branchId: string, updates: Partial<Branch>) {
    const { data, error } = await supabase
      .from('branches')
      .update(updates)
      .eq('id', branchId)
      .select()
      .single();

    return { data, error };
  },

  async deleteBranch(branchId: string) {
    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('id', branchId);

    return { success: !error, error };
  }
};

// ============================================
// PRODUCT OPERATIONS
// ============================================

export const productService = {
  async getProducts(businessId: string, branchId?: string) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true);

    if (branchId) {
      query = query.or(`branch_id.eq.${branchId},branch_id.is.null`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    return { data, error };
  },

  async createProduct(productData: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...productData, is_active: true }])
      .select()
      .single();

    return { data, error };
  },

  async updateProduct(productId: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    return { data, error };
  },

  async deleteProduct(productId: string) {
    // Soft delete
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', productId);

    return { success: !error, error };
  },

  async bulkImportProducts(products: Partial<Product>[]) {
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();

    return { data, error };
  }
};

// ============================================
// CUSTOMER OPERATIONS
// ============================================

export const customerService = {
  async getCustomers(businessId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async createCustomer(customerData: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ ...customerData, is_active: true }])
      .select()
      .single();

    return { data, error };
  },

  async updateCustomer(customerId: string, updates: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', customerId)
      .select()
      .single();

    return { data, error };
  }
};

// ============================================
// SALES OPERATIONS
// ============================================

export const salesService = {
  async getSales(businessId: string, filters?: {
    branchId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) {
    let query = supabase
      .from('sales')
      .select('*, products(*), customers(*)')
      .eq('business_id', businessId);

    if (filters?.branchId) {
      query = query.eq('branch_id', filters.branchId);
    }

    if (filters?.startDate) {
      query = query.gte('sale_date', filters.startDate.toISOString());
    }

    if (filters?.endDate) {
      query = query.lte('sale_date', filters.endDate.toISOString());
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('sale_date', { ascending: false });

    return { data, error };
  },

  async createSale(saleData: Partial<Sale>) {
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const { data, error } = await supabase
      .from('sales')
      .insert([{ 
        ...saleData, 
        invoice_number: invoiceNumber,
        status: 'COMPLETED' 
      }])
      .select()
      .single();

    if (!error && data) {
      // Update product stock
      if (saleData.product_id) {
        await supabase.rpc('decrease_product_stock', {
          product_id: saleData.product_id,
          quantity: saleData.quantity
        });
      }
    }

    return { data, error };
  },

  async updateSale(saleId: string, updates: Partial<Sale>) {
    const { data, error } = await supabase
      .from('sales')
      .update(updates)
      .eq('id', saleId)
      .select()
      .single();

    return { data, error };
  },

  async cancelSale(saleId: string) {
    const { data, error } = await supabase
      .from('sales')
      .update({ status: 'CANCELLED' })
      .eq('id', saleId)
      .select()
      .single();

    if (!error && data) {
      // Restore product stock
      await supabase.rpc('increase_product_stock', {
        product_id: data.product_id,
        quantity: data.quantity
      });
    }

    return { data, error };
  }
};

// ============================================
// ALERTS OPERATIONS
// ============================================

export const alertService = {
  async getAlerts(businessId: string, unreadOnly = false) {
    let query = supabase
      .from('alerts')
      .select('*')
      .eq('business_id', businessId);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query.order('date', { ascending: false });

    return { data, error };
  },

  async markAsRead(alertId: string) {
    const { error } = await supabase
      .from('alerts')
      .update({ read: true })
      .eq('id', alertId);

    return { success: !error, error };
  },

  async markAllAsRead(businessId: string) {
    const { error } = await supabase
      .from('alerts')
      .update({ read: true })
      .eq('business_id', businessId)
      .eq('read', false);

    return { success: !error, error };
  }
};

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

export const subscriptionService = {
  async getSubscription(businessId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return { data, error };
  },

  async upgradeSubscription(businessId: string, plan: string, amount: number) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        business_id: businessId,
        plan,
        amount,
        status: 'ACTIVE',
        start_date: new Date().toISOString(),
        billing_cycle: 'MONTHLY',
        auto_renew: true
      }])
      .select()
      .single();

    // Update business subscription
    if (!error) {
      await businessService.updateBusiness(businessId, {
        subscription_plan: plan as any,
        subscription_status: 'ACTIVE'
      });
    }

    return { data, error };
  }
};

// ============================================
// ANALYTICS & REPORTS
// ============================================

export const analyticsService = {
  async getDashboardStats(businessId: string, branchId?: string) {
    // Get total sales
    let salesQuery = supabase
      .from('sales')
      .select('total_amount', { count: 'exact' })
      .eq('business_id', businessId)
      .eq('status', 'COMPLETED');

    if (branchId) {
      salesQuery = salesQuery.eq('branch_id', branchId);
    }

    const { data: salesData, count: salesCount } = await salesQuery;

    const totalRevenue = salesData?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;

    // Get product count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('is_active', true);

    // Get customer count
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('is_active', true);

    // Get low stock count
    const { count: lowStockCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .lte('current_stock', 'reorder_level');

    return {
      totalRevenue,
      totalSales: salesCount || 0,
      totalProducts: productCount || 0,
      totalCustomers: customerCount || 0,
      lowStockItems: lowStockCount || 0
    };
  }
};

export default supabase;
