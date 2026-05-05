export type UserRole = 'admin' | 'manager' | 'analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string; // In production, this would be hashed
  storeLocation?: string; // Manager's assigned store
  businessId?: string; // Link to business
  branchIds?: string[]; // Access to specific branches
  phone?: string;
  avatar?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

export interface Business {
  id: string;
  ownerId: string; // User ID of the business owner
  businessName: string;
  legalName: string;
  displayName: string;
  businessType: 'GST_REGISTERED' | 'LOCAL_STORE' | 'COMPOSITION_SCHEME';
  industry: 'RETAIL' | 'WHOLESALE' | 'MANUFACTURING' | 'SERVICES' | 'FOOD_BEVERAGE' | 'PHARMACY' | 'ELECTRONICS' | 'FASHION' | 'GROCERY' | 'OTHER';
  
  // GST Details (if GST registered)
  gstin?: string;
  gstRegistrationDate?: Date;
  taxpayerType?: 'Regular' | 'Composition' | 'Casual' | 'SEZ';
  
  // Contact Information
  email: string;
  phone: string;
  website?: string;
  
  // Registered Address
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  country: string;
  
  // Business Details
  logo?: string;
  foundedYear?: number;
  employeeCount?: number;
  annualRevenue?: number;
  
  // Subscription
  subscriptionPlan: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  
  // Settings
  currency: string;
  timezone: string;
  dateFormat: string;
  fiscalYearStart: string; // 'APRIL' | 'JANUARY' etc
  
  // Status
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  businessId: string;
  branchName: string;
  branchCode: string; // Unique identifier
  isHeadquarters: boolean;
  
  // Location Details
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  country: string;
  
  // Contact
  phone?: string;
  email?: string;
  managerName?: string;
  managerId?: string; // User ID
  
  // GST Details (branch-specific GSTIN if applicable)
  gstin?: string;
  
  // Operational Details
  openingTime?: string;
  closingTime?: string;
  workingDays?: string[];
  
  // Status
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  businessId: string;
  branchId?: string; // If product is branch-specific
  name: string;
  sku?: string; // Stock Keeping Unit
  barcode?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  description?: string;
  
  // Pricing
  costPrice: number;
  sellingPrice: number;
  mrp?: number; // Maximum Retail Price
  
  // Stock Management
  currentStock: number;
  reorderLevel: number;
  maxStockLevel?: number;
  unit: string; // 'pcs', 'kg', 'litre', 'box', etc.
  
  // GST Details
  gstRate?: 0 | 5 | 12 | 18 | 28;
  hsnCode?: string;
  priceIncludesGST?: boolean;
  cessRate?: number;
  
  // Dates
  lastRestocked?: Date;
  nextRestockDate?: Date;
  expiryDate?: Date;
  manufacturingDate?: Date;
  
  // Supplier
  supplierId?: string;
  supplierName?: string;
  
  // Product Images
  images?: string[];
  
  // Status
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  customerType: 'B2B' | 'B2C' | 'RETAIL' | 'WHOLESALE';
  
  // Contact
  email?: string;
  phone?: string;
  alternatePhone?: string;
  
  // GST Details
  gstin?: string;
  state: string;
  stateCode?: string;
  
  // Address
  address?: string;
  billingAddress?: string;
  shippingAddress?: string;
  city?: string;
  pincode?: string;
  
  // Business Details (for B2B)
  companyName?: string;
  
  // Financial
  creditLimit?: number;
  outstandingBalance?: number;
  
  // Status
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  businessId: string;
  branchId?: string;
  invoiceNumber: string;
  
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  
  // Pricing
  costPrice: number;
  sellingPrice: number;
  mrp?: number;
  discount: number;
  discountType?: 'PERCENTAGE' | 'FIXED';
  totalAmount: number;
  
  // GST Details
  gstRate?: number;
  gstAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  cess?: number;
  
  // Customer
  customerId?: string;
  customerName?: string;
  customerGSTIN?: string;
  
  // Payment
  paymentMode?: 'CASH' | 'CARD' | 'UPI' | 'NETBANKING' | 'CREDIT';
  paymentStatus?: 'PAID' | 'PENDING' | 'PARTIAL';
  
  // Dates
  saleDate: Date;
  
  // Location & User
  storeLocation?: string;
  soldBy?: string; // User ID
  soldByName?: string;
  
  // Status
  status: 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Alert {
  id: string;
  businessId: string;
  branchId?: string;
  type: 'low-stock' | 'dead-stock' | 'restock-due' | 'expiry-warning' | 'payment-due' | 'system';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  productId: string;
  productName: string;
  message: string;
  date: Date;
  storeLocation?: string;
  read: boolean;
  actionUrl?: string;
  metadata?: any;
}

export interface KPIMetrics {
  // Sales KPIs
  totalSales: number;
  revenueGrowth: number;
  averageOrderValue: number;
  salesByCategory: { id: string; category: string; amount: number }[];
  salesByProduct: { id: string; productName: string; amount: number }[];
  
  // Inventory KPIs
  totalStockValue: number;
  deadStock: Product[];
  fastMovingItems: Product[];
  slowMovingItems: Product[];
  inventoryTurnover: number;
  lowStockAlerts: Product[];
  
  // Profitability KPIs
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  profitByProduct: { productName: string; profit: number }[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface OnboardingData {
  // Step 1: Business Type
  businessType: 'GST_REGISTERED' | 'LOCAL_STORE' | 'COMPOSITION_SCHEME';
  
  // Step 2: Business Details
  businessName: string;
  legalName: string;
  industry: string;
  gstin?: string;
  
  // Step 3: Contact & Address
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  
  // Step 4: Owner Details
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  
  // Step 5: Branches (optional)
  branches?: Partial<Branch>[];
  
  // Step 6: Subscription
  subscriptionPlan: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
}

export interface SupabaseSchema {
  businesses: Business;
  branches: Branch;
  users: User;
  products: Product;
  customers: Customer;
  sales: Sale;
  alerts: Alert;
  invoices: any; // To be defined
  gst_returns: any; // To be defined
  payments: any; // To be defined
  subscriptions: any; // To be defined
}