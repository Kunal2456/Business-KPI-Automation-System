# Complete Prompt for Cursor/Windsurf IDE

Copy and paste this entire prompt into Cursor or Windsurf IDE to build the Business KPI Automation & Reporting System.

---

## STEP 1: Project Setup

Create a new React + TypeScript project with Vite:

```bash
npm create vite@latest retail-kpi-system -- --template react-ts
cd retail-kpi-system
npm install
npm install recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## STEP 2: Configure Tailwind CSS

Create/Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## STEP 3: Update `src/index.css`

Replace the entire content with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 2rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.75rem;
}

p, label {
  font-size: 0.875rem;
}
```

---

## STEP 4: Create File Structure

Create these folders and files in the `src` directory:

```
src/
├── types/
│   └── index.ts
├── utils/
│   ├── mockData.ts
│   └── kpiCalculations.ts
├── components/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── SalesManagement.tsx
│   ├── ProductManagement.tsx
│   ├── Reports.tsx
│   ├── DataImport.tsx
│   └── SetupWizard.tsx
├── App.tsx
├── main.tsx
└── index.css
```

---

## STEP 5: Create Type Definitions

**File: `src/types/index.ts`**

```typescript
export type UserRole = 'admin' | 'manager' | 'analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  reorderLevel: number;
  lastRestocked?: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  saleDate: Date;
  costPrice: number;
  sellingPrice: number;
  discount: number;
  totalAmount: number;
  storeLocation?: string;
}

export interface KPIMetrics {
  totalSales: number;
  revenueGrowth: number;
  averageOrderValue: number;
  salesByCategory: { category: string; amount: number }[];
  salesByProduct: { productName: string; amount: number }[];
  totalStockValue: number;
  deadStock: Product[];
  fastMovingItems: Product[];
  slowMovingItems: Product[];
  inventoryTurnover: number;
  lowStockAlerts: Product[];
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  profitByProduct: { productName: string; profit: number }[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
```

---

## STEP 6: NOW ASK YOUR AI ASSISTANT

After creating the structure above, copy this prompt into your Cursor/Windsurf AI chat:

---

### 🤖 AI ASSISTANT PROMPT

I've set up a React + TypeScript project with the file structure ready. Please create a comprehensive Business KPI Automation & Reporting System for retail sales with these requirements:

#### PROJECT OVERVIEW
Build a full-stack retail analytics platform with:
- Role-based authentication (Admin, Manager, Analyst)
- Real-time dashboard with interactive charts
- Sales transaction management
- Product and inventory tracking
- Automated KPI calculations
- CSV import/export capabilities
- Setup wizard for first-time users
- Data management module

#### FEATURES TO IMPLEMENT

**1. Authentication System (`src/components/Login.tsx`)**
- Email and password login
- Mock users: admin@retail.com/admin123, manager@retail.com/manager123, analyst@retail.com/analyst123
- Quick login buttons for demo
- Role-based access control

**2. Setup Wizard (`src/components/SetupWizard.tsx`)**
- 3-step wizard: Welcome → Business Info → Add Products
- Business name input
- Product table for initial data entry
- Skip option to use demo data
- Progress indicator

**3. Dashboard (`src/components/Dashboard.tsx`)**
- Time range selector: 7 days, 30 days, All time
- KPI cards: Total Sales (with growth %), Gross Profit, Stock Value, Low Stock Alerts
- Charts using Recharts:
  * Daily Sales Trend (Area chart with gradient)
  * Sales by Category (Pie chart)
  * Monthly Sales & Profit (Bar chart)
  * Top Products by Revenue (Horizontal bar chart)
- Low stock alerts section
- Fast-moving items list

**4. Sales Management (`src/components/SalesManagement.tsx`)**
- Sales table with: Sale ID, Product, Quantity, Price, Discount, Total, Date, Store
- "Add Sale" modal with:
  * Product dropdown (with current stock shown)
  * Quantity input
  * Discount percentage
  * Store location selector
  * Auto-calculate total
- Search by product name or sale ID
- Filter by category
- Export to CSV button
- Automatic stock deduction
- Validation for insufficient stock

**5. Product Management (`src/components/ProductManagement.tsx`)**
- Product grid cards showing:
  * Name, Category
  * Cost Price, Selling Price, Margin %
  * Current Stock, Reorder Level
  * Low stock warning (orange highlight)
- "Add Product" form
- Edit product functionality
- Quick stock adjustment: -1, +10, +50 buttons
- Filter by category
- Low stock alert banner at top

**6. Reports (`src/components/Reports.tsx`)**
- Report period selector: Daily, Weekly, Monthly, Custom date range
- KPI summary cards with gradient backgrounds
- Export buttons for:
  * Sales Report
  * Inventory Report
  * KPI Summary
  * Product Performance Report
- Tables: Sales by Category, Top 10 Products by Profit
- All exports in CSV format

**7. Data Import (`src/components/DataImport.tsx`)**
- CSV upload for Products and Sales
- Download CSV templates
- File validation and error messages
- Success/error feedback
- Current data stats display
- "Clear All Data" button with confirmation
- Instructions and best practices section

**8. Mock Data (`src/utils/mockData.ts`)**
Create mock data with:
- 3 users (admin, manager, analyst)
- 15 products across 7 categories: Groceries, Beverages, Dairy, Bakery, Snacks, Household, Personal Care
- Products: Rice, Wheat Flour, Cooking Oil, Sugar, Tea, Coffee, Milk, Butter, Bread, Biscuits, Chips, Soft Drinks, Detergent, Soap, Shampoo
- Generate 30 days of sales (5-15 sales per day)
- Random quantities (1-10), discounts (0-10%), store locations (Store A, B, C)
- Some products below reorder level for alerts

**9. KPI Calculations (`src/utils/kpiCalculations.ts`)**
Implement functions for:
- **Sales KPIs**: Total sales, revenue growth %, AOV, sales by category/product
- **Inventory KPIs**: Stock value, inventory turnover, dead stock (no sales in 30 days), fast/slow moving items, low stock alerts
- **Profitability KPIs**: Gross profit, net profit (gross * 0.9), profit margin %, profit by product
- **Utility functions**: formatCurrency (₹ INR), formatPercentage, exportToCSV

**10. Main App (`src/App.tsx`)**
- State management for: currentUser, products, sales, currentPage
- LocalStorage persistence (save/load products and sales)
- Setup wizard logic (show only if no data exists)
- Navigation: Desktop sidebar + Mobile hamburger menu
- User profile display
- Page routing: dashboard, sales, products, reports, data-import
- Role-based page access
- CRUD operations for products and sales

#### UI/UX REQUIREMENTS

**Color Scheme:**
- Primary: Indigo (#6366f1)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Danger: Red (#ef4444)
- Background: Gray-50

**Layout:**
- Desktop: Sidebar (left) + Main content (right)
- Mobile: Top header with hamburger menu
- Responsive design with Tailwind CSS

**Components:**
- Rounded cards with shadows
- Gradient backgrounds for report cards
- Hover effects on buttons
- Color-coded metrics (green for positive, red for negative)
- Icons from lucide-react
- Loading states and empty states

**Charts (Recharts):**
- Responsive containers
- Consistent color palette: COLORS array
- Tooltips with formatted currency
- Legends for multi-series data
- Grid lines for readability

#### DATA FLOW

1. First visit → Show Setup Wizard (if no data)
2. User can setup or skip to use demo data
3. After login → Dashboard with KPIs
4. All data auto-saves to localStorage
5. Users can:
   - Add products/sales manually
   - Import CSV bulk data
   - Export reports
   - Clear all data to start fresh

#### VALIDATION & ERROR HANDLING

- Form validation for required fields
- Number inputs with min/max constraints
- Prevent negative stock
- Alert if insufficient stock during sale
- CSV import validation with helpful error messages
- Confirmation dialogs for destructive actions

#### TECHNICAL REQUIREMENTS

- Use TypeScript for all files
- Functional components with hooks
- useMemo for expensive calculations
- Proper prop types and interfaces
- Indian Rupee (₹) currency formatting
- Date formatting: toLocaleDateString()
- CSV export with proper headers
- Mobile-responsive tables (horizontal scroll if needed)

#### SPECIFIC IMPLEMENTATIONS

**Dashboard Charts:**
```typescript
// Daily Sales Trend
<AreaChart data={dailySalesData}>
  <defs>
    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#colorSales)" />
</AreaChart>
```

**CSV Template Format:**

Products:
```
Product ID,Product Name,Category,Cost Price,Selling Price,Current Stock,Reorder Level
P001,Rice 1kg,Groceries,40,60,500,100
```

Sales:
```
Sale ID,Product ID,Product Name,Quantity,Sale Date,Cost Price,Selling Price,Discount %,Total Amount,Store Location
S001,P001,Rice 1kg,5,2024-12-16,40,60,0,300,Store A
```

**Role-Based Access:**
- Admin: All pages
- Manager: Dashboard, Sales, Products, Reports, Data Import
- Analyst: Dashboard, Reports only

#### OUTPUT EXPECTATIONS

Please create COMPLETE, PRODUCTION-READY code for all files with:
- Full TypeScript type safety
- Proper error handling
- Beautiful, responsive UI
- All calculations accurate
- Professional styling
- Comments for complex logic
- No placeholder code - everything functional

Make it look like a real SaaS product that I can deploy and use immediately!

---

### ADDITIONAL CONTEXT

The types/index.ts file is already created above. Please implement:

1. All utility functions in mockData.ts and kpiCalculations.ts
2. All 7 React components (Login, Dashboard, SalesManagement, ProductManagement, Reports, DataImport, SetupWizard)
3. Main App.tsx with routing and state management
4. Ensure localStorage persistence works correctly
5. Make sure all charts render properly with Recharts
6. Implement CSV parsing and export correctly

Start with the utility files, then components, then App.tsx. Test that everything works together!

