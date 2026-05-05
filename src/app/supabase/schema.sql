-- ShelfIQ Production Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BUSINESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL CHECK (business_type IN ('GST_REGISTERED', 'LOCAL_STORE', 'COMPOSITION_SCHEME')),
    industry VARCHAR(50) NOT NULL CHECK (industry IN ('RETAIL', 'WHOLESALE', 'MANUFACTURING', 'SERVICES', 'FOOD_BEVERAGE', 'PHARMACY', 'ELECTRONICS', 'FASHION', 'GROCERY', 'OTHER')),
    
    -- GST Details
    gstin VARCHAR(15) UNIQUE,
    gst_registration_date DATE,
    taxpayer_type VARCHAR(20) CHECK (taxpayer_type IN ('Regular', 'Composition', 'Casual', 'SEZ')),
    
    -- Contact Information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    website VARCHAR(255),
    
    -- Registered Address
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    
    -- Business Details
    logo TEXT,
    founded_year INTEGER,
    employee_count INTEGER,
    annual_revenue DECIMAL(15, 2),
    
    -- Subscription
    subscription_plan VARCHAR(20) DEFAULT 'FREE' CHECK (subscription_plan IN ('FREE', 'BASIC', 'PRO', 'ENTERPRISE')),
    subscription_status VARCHAR(20) DEFAULT 'TRIAL' CHECK (subscription_status IN ('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Settings
    currency VARCHAR(3) DEFAULT 'INR',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    fiscal_year_start VARCHAR(20) DEFAULT 'APRIL',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for businesses
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_businesses_gstin ON businesses(gstin);
CREATE INDEX idx_businesses_email ON businesses(email);
CREATE INDEX idx_businesses_subscription_status ON businesses(subscription_status);

-- ============================================
-- BRANCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50) NOT NULL,
    is_headquarters BOOLEAN DEFAULT false,
    
    -- Location Details
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    
    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    manager_name VARCHAR(255),
    manager_id UUID,
    
    -- GST Details
    gstin VARCHAR(15),
    
    -- Operational Details
    opening_time TIME,
    closing_time TIME,
    working_days TEXT[], -- Array of day names
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(business_id, branch_code)
);

-- Indexes for branches
CREATE INDEX idx_branches_business_id ON branches(business_id);
CREATE INDEX idx_branches_manager_id ON branches(manager_id);
CREATE INDEX idx_branches_branch_code ON branches(branch_code);

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_uid UUID UNIQUE, -- Link to Supabase auth.users
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager', 'analyst')),
    
    -- Business & Branch Access
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    branch_ids UUID[], -- Array of branch IDs user has access to
    store_location VARCHAR(255), -- Legacy field
    
    -- Profile
    avatar TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX idx_users_auth_uid ON users(auth_uid);
CREATE INDEX idx_users_business_id ON users(business_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    description TEXT,
    
    -- Pricing
    cost_price DECIMAL(15, 2) NOT NULL,
    selling_price DECIMAL(15, 2) NOT NULL,
    mrp DECIMAL(15, 2),
    
    -- Stock Management
    current_stock INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 10,
    max_stock_level INTEGER,
    unit VARCHAR(20) DEFAULT 'pcs',
    
    -- GST Details
    gst_rate INTEGER CHECK (gst_rate IN (0, 5, 12, 18, 28)),
    hsn_code VARCHAR(8),
    price_includes_gst BOOLEAN DEFAULT false,
    cess_rate DECIMAL(5, 2),
    
    -- Dates
    last_restocked TIMESTAMP WITH TIME ZONE,
    next_restock_date DATE,
    expiry_date DATE,
    manufacturing_date DATE,
    
    -- Supplier
    supplier_id UUID,
    supplier_name VARCHAR(255),
    
    -- Product Images
    images TEXT[], -- Array of image URLs
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for products
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_products_branch_id ON products(branch_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_current_stock ON products(current_stock);

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(20) DEFAULT 'B2C' CHECK (customer_type IN ('B2B', 'B2C', 'RETAIL', 'WHOLESALE')),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    
    -- GST Details
    gstin VARCHAR(15),
    state VARCHAR(100) NOT NULL,
    state_code VARCHAR(2),
    
    -- Address
    address TEXT,
    billing_address TEXT,
    shipping_address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(10),
    
    -- Business Details
    company_name VARCHAR(255),
    
    -- Financial
    credit_limit DECIMAL(15, 2),
    outstanding_balance DECIMAL(15, 2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for customers
CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_gstin ON customers(gstin);

-- ============================================
-- SALES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) NOT NULL,
    
    -- Product Details
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit VARCHAR(20) DEFAULT 'pcs',
    
    -- Pricing
    cost_price DECIMAL(15, 2) NOT NULL,
    selling_price DECIMAL(15, 2) NOT NULL,
    mrp DECIMAL(15, 2),
    discount DECIMAL(15, 2) DEFAULT 0,
    discount_type VARCHAR(20) CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    total_amount DECIMAL(15, 2) NOT NULL,
    
    -- GST Details
    gst_rate DECIMAL(5, 2),
    gst_amount DECIMAL(15, 2),
    cgst DECIMAL(15, 2),
    sgst DECIMAL(15, 2),
    igst DECIMAL(15, 2),
    cess DECIMAL(15, 2),
    
    -- Customer
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255),
    customer_gstin VARCHAR(15),
    
    -- Payment
    payment_mode VARCHAR(20) CHECK (payment_mode IN ('CASH', 'CARD', 'UPI', 'NETBANKING', 'CREDIT')),
    payment_status VARCHAR(20) DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'PENDING', 'PARTIAL')),
    
    -- Dates
    sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Location & User
    store_location VARCHAR(255),
    sold_by UUID REFERENCES users(id) ON DELETE SET NULL,
    sold_by_name VARCHAR(255),
    
    -- Status
    status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'CANCELLED', 'RETURNED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(business_id, invoice_number)
);

-- Indexes for sales
CREATE INDEX idx_sales_business_id ON sales(business_id);
CREATE INDEX idx_sales_branch_id ON sales(branch_id);
CREATE INDEX idx_sales_product_id ON sales(product_id);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);
CREATE INDEX idx_sales_invoice_number ON sales(invoice_number);
CREATE INDEX idx_sales_status ON sales(status);

-- ============================================
-- ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL CHECK (type IN ('low-stock', 'dead-stock', 'restock-due', 'expiry-warning', 'payment-due', 'system')),
    severity VARCHAR(20) DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    store_location VARCHAR(255),
    
    read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for alerts
CREATE INDEX idx_alerts_business_id ON alerts(business_id);
CREATE INDEX idx_alerts_branch_id ON alerts(branch_id);
CREATE INDEX idx_alerts_product_id ON alerts(product_id);
CREATE INDEX idx_alerts_read ON alerts(read);
CREATE INDEX idx_alerts_type ON alerts(type);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    
    -- Customer
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_gstin VARCHAR(15),
    customer_address TEXT,
    customer_state VARCHAR(100),
    customer_state_code VARCHAR(2),
    
    -- Items (stored as JSONB array)
    items JSONB NOT NULL,
    
    -- Totals
    subtotal DECIMAL(15, 2) NOT NULL,
    discount DECIMAL(15, 2) DEFAULT 0,
    taxable_amount DECIMAL(15, 2) NOT NULL,
    cgst_amount DECIMAL(15, 2),
    sgst_amount DECIMAL(15, 2),
    igst_amount DECIMAL(15, 2),
    cess_amount DECIMAL(15, 2),
    total_amount DECIMAL(15, 2) NOT NULL,
    
    -- Payment
    payment_mode VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'UNPAID' CHECK (payment_status IN ('PAID', 'UNPAID', 'PARTIAL', 'OVERDUE')),
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    
    -- Notes
    notes TEXT,
    terms TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(business_id, invoice_number)
);

-- Indexes for invoices
CREATE INDEX idx_invoices_business_id ON invoices(business_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_status ON invoices(status);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('FREE', 'BASIC', 'PRO', 'ENTERPRISE')),
    status VARCHAR(20) DEFAULT 'TRIAL' CHECK (status IN ('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'PAYMENT_FAILED')),
    
    -- Pricing
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    billing_cycle VARCHAR(20) DEFAULT 'MONTHLY' CHECK (billing_cycle IN ('MONTHLY', 'QUARTERLY', 'YEARLY')),
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    next_billing_date DATE,
    
    -- Payment Gateway
    payment_gateway VARCHAR(50), -- 'razorpay', 'stripe', etc.
    subscription_id VARCHAR(255), -- Gateway subscription ID
    customer_id VARCHAR(255), -- Gateway customer ID
    
    -- Auto-renewal
    auto_renew BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscriptions
CREATE INDEX idx_subscriptions_business_id ON subscriptions(business_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    
    -- Payment Gateway
    payment_gateway VARCHAR(50) NOT NULL,
    gateway_payment_id VARCHAR(255) UNIQUE,
    gateway_order_id VARCHAR(255),
    
    -- Status
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    
    -- Payment Details
    payment_method VARCHAR(50),
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Response
    gateway_response JSONB,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX idx_payments_business_id ON payments(business_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Businesses: Users can only see their own business
CREATE POLICY "Users can view their own business" ON businesses
    FOR SELECT USING (
        owner_id = auth.uid() OR
        id IN (SELECT business_id FROM users WHERE auth_uid = auth.uid())
    );

-- Branches: Users can only see branches of their business
CREATE POLICY "Users can view branches of their business" ON branches
    FOR SELECT USING (
        business_id IN (SELECT business_id FROM users WHERE auth_uid = auth.uid())
    );

-- Products: Users can only see products of their business
CREATE POLICY "Users can view products of their business" ON products
    FOR SELECT USING (
        business_id IN (SELECT business_id FROM users WHERE auth_uid = auth.uid())
    );

-- Sales: Users can only see sales of their business
CREATE POLICY "Users can view sales of their business" ON sales
    FOR SELECT USING (
        business_id IN (SELECT business_id FROM users WHERE auth_uid = auth.uid())
    );

-- Similar policies for other tables...
-- (Add more RLS policies as needed for INSERT, UPDATE, DELETE)

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA / SEED DATA
-- ============================================

-- You can add seed data here if needed
-- For example, default subscription plans, GST rates, etc.

COMMENT ON TABLE businesses IS 'Stores business/company information';
COMMENT ON TABLE branches IS 'Stores branch/store location information';
COMMENT ON TABLE users IS 'Application users linked to businesses';
COMMENT ON TABLE products IS 'Product catalog with pricing and inventory';
COMMENT ON TABLE customers IS 'Customer/client information';
COMMENT ON TABLE sales IS 'Sales transactions';
COMMENT ON TABLE alerts IS 'System alerts and notifications';
COMMENT ON TABLE invoices IS 'Invoice records';
COMMENT ON TABLE subscriptions IS 'Subscription management';
COMMENT ON TABLE payments IS 'Payment transaction records';
