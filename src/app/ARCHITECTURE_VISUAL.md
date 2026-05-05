# 🎨 Visual Architecture Diagrams

## **Business KPI System - Visual Architecture**

---

## 📐 **High-Level System Architecture**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BROWSER (CLIENT-SIDE)                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
┌───────────────────────────────────▼─────────────────────────────────────┐
│                           REACT APPLICATION                             │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                         App.tsx (Root)                         │   │
│  │                                                                 │   │
│  │  • State Management (useState)                                 │   │
│  │  • Routing Logic                                               │   │
│  │  • Authentication Flow                                         │   │
│  │  • Data Persistence (localStorage)                             │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────┬──────────────────┬─────────────────────────┐    │
│  │   Components     │    Utilities     │    Types/Interfaces     │    │
│  ├──────────────────┼──────────────────┼─────────────────────────┤    │
│  │ • AuthPage       │ • kpiCalculations│ • User                  │    │
│  │ • Dashboard      │ • mockData       │ • Product               │    │
│  │ • Sales Mgmt     │                  │ • Sale                  │    │
│  │ • Product Mgmt   │                  │ • Alert                 │    │
│  │ • Reports        │                  │ • KPI                   │    │
│  │ • Data Import    │                  │                         │    │
│  │ • User Mgmt      │                  │                         │    │
│  │ • 40+ UI Comps   │                  │                         │    │
│  └──────────────────┴──────────────────┴─────────────────────────┘    │
└───────────────────────────────────────┬──────────────────────────────┘
                                        │
                                        │
┌───────────────────────────────────────▼──────────────────────────────┐
│                         BROWSER LOCALSTORAGE                          │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Key: "users"        Value: [User[], User[], ...]           │    │
│  │  Key: "products"     Value: [Product[], Product[], ...]     │    │
│  │  Key: "sales"        Value: [Sale[], Sale[], ...]           │    │
│  │  Key: "businessName" Value: "My Store"                      │    │
│  │  Key: "darkMode"     Value: "true"                          │    │
│  │  Key: "setupCompleted" Value: "true"                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Application State Flow**

```
                    ┌──────────────────────────┐
                    │   USER INTERACTION       │
                    │  (Click, Type, Upload)   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   EVENT HANDLER          │
                    │  (handleAddSale, etc.)   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   STATE UPDATE           │
                    │  setSales([...sales])    │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴─────────────┐
                    │                          │
                    ▼                          ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │   USEEFFECT HOOK    │   │   REACT RE-RENDER   │
        │   Auto-triggers     │   │   UI Updates        │
        └──────────┬──────────┘   └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │   LOCALSTORAGE      │
        │   Data Persisted    │
        └─────────────────────┘
```

---

## 🏗️ **Component Tree Structure**

```
App.tsx (Root Component)
│
├── [Not Authenticated]
│   │
│   ├── AuthPage
│   │   ├── Login Form
│   │   │   ├── Input (Email)
│   │   │   ├── Input (Password)
│   │   │   └── Button (Login)
│   │   └── Toggle (Dark Mode)
│   │
│   ├── WelcomeScreen
│   │   ├── Card (Hero)
│   │   ├── Card (Setup Wizard)
│   │   ├── Card (Demo Data)
│   │   └── Card (Start Fresh)
│   │
│   └── SetupWizard
│       ├── Step 1: Business Info
│       ├── Step 2: Import Data
│       └── Step 3: Review
│
└── [Authenticated]
    │
    ├── Sidebar (Desktop)
    │   ├── Logo & Title
    │   ├── User Profile Card
    │   │   ├── Avatar
    │   │   ├── Name
    │   │   ├── Role Badge
    │   │   └── Store Location
    │   ├── Store Filter Select
    │   ├── Navigation Menu
    │   │   ├── Dashboard
    │   │   ├── Sales
    │   │   ├── Products
    │   │   ├── Reports
    │   │   ├── Data Import
    │   │   └── User Management (Admin only)
    │   └── Settings Section
    │       ├── Alerts (with badge)
    │       ├── Setup Wizard
    │       ├── Dark Mode Toggle
    │       └── Logout
    │
    ├── Mobile Header
    │   ├── Logo
    │   ├── Alerts Button (with badge)
    │   ├── Dark Mode Toggle
    │   └── Menu Button (Hamburger)
    │
    ├── Mobile Menu (Drawer)
    │   ├── User Profile
    │   ├── Store Filter
    │   ├── Navigation
    │   └── Logout
    │
    ├── Alerts Panel (Dropdown)
    │   ├── Alert List
    │   │   ├── Low Stock Alert
    │   │   ├── Restock Alert
    │   │   └── Dead Stock Alert
    │   └── Mark Read Button
    │
    └── Main Content (Router)
        │
        ├── [Page: Dashboard]
        │   ├── KPI Cards (4x)
        │   │   ├── Total Sales
        │   │   ├── Total Products
        │   │   ├── Avg Order Value
        │   │   └── Transactions
        │   ├── Charts Section
        │   │   ├── Line Chart (Sales Trend)
        │   │   ├── Bar Chart (Product Sales)
        │   │   └── Pie Chart (Categories)
        │   ├── Table (Top Products)
        │   └── List (Recent Sales)
        │
        ├── [Page: Sales Management]
        │   ├── Form (Add Sale)
        │   │   ├── Select (Product)
        │   │   ├── Input (Quantity)
        │   │   ├── Select (Store)
        │   │   └── Button (Submit)
        │   ├── Filters
        │   │   ├── Date Range
        │   │   └── Search
        │   └── Table (Sales History)
        │       └── Row Actions (View, Edit)
        │
        ├── [Page: Product Management]
        │   ├── Form (Add/Edit Product)
        │   │   ├── Input (Name)
        │   │   ├── Select (Category)
        │   │   ├── Input (Price)
        │   │   ├── Input (Cost)
        │   │   ├── Input (Stock)
        │   │   ├── Input (Reorder Level)
        │   │   ├── DatePicker (Last Restocked)
        │   │   ├── DatePicker (Next Restock)
        │   │   └── Button (Save)
        │   ├── Search Bar
        │   ├── Category Filter
        │   └── Table (Products)
        │       ├── Column (Name)
        │       ├── Column (Category)
        │       ├── Column (Stock)
        │       ├── Column (Price)
        │       └── Actions (Edit, Delete)
        │
        ├── [Page: Reports]
        │   ├── Filters
        │   │   ├── Date Range
        │   │   ├── Store Select
        │   │   └── Report Type
        │   ├── Charts
        │   │   ├── Revenue Chart
        │   │   ├── Profit Chart
        │   │   └── Category Chart
        │   └── Export Buttons
        │       ├── PDF
        │       ├── CSV
        │       └── Print
        │
        ├── [Page: Data Import]
        │   ├── Upload Section
        │   │   ├── Drag & Drop Zone
        │   │   ├── File Input
        │   │   └── Template Download
        │   ├── Mapping Section
        │   │   └── Column Mappers
        │   ├── Validation Section
        │   │   ├── Error List
        │   │   └── Warning List
        │   ├── Preview Table
        │   └── Import Button
        │
        └── [Page: User Management] (Admin Only)
            ├── Add User Form
            │   ├── Input (Name)
            │   ├── Input (Email)
            │   ├── Input (Password)
            │   ├── Select (Role)
            │   ├── Select (Store)
            │   └── Button (Add)
            ├── Search Bar
            ├── Filters
            │   ├── Filter by Role
            │   └── Filter by Store
            └── Table (Users)
                ├── Column (Name)
                ├── Column (Email)
                ├── Column (Role)
                ├── Column (Store)
                └── Actions (Edit, Delete)
```

---

## 🗂️ **File System Hierarchy**

```
project-root/
│
├── 📁 components/
│   ├── 📁 ui/                           ← UI Component Library
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── alert.tsx
│   │   └── ... (40+ components)
│   │
│   ├── 📁 figma/                        ← Protected Components
│   │   └── ImageWithFallback.tsx
│   │
│   ├── AuthPage.tsx                     ← Authentication
│   ├── WelcomeScreen.tsx                ← Onboarding
│   ├── SetupWizard.tsx                  ← Setup Flow
│   ├── Dashboard.tsx                    ← Main Dashboard
│   ├── SalesManagement.tsx              ← Sales Feature
│   ├── ProductManagement.tsx            ← Products Feature
│   ├── Reports.tsx                      ← Reports Feature
│   ├── DataImportAdvanced.tsx           ← Import Feature
│   └── UserManagement.tsx               ← User Admin Feature
│
├── 📁 types/
│   └── index.ts                         ← TypeScript Types
│
├── 📁 utils/
│   ├── kpiCalculations.ts               ← Business Logic
│   └── mockData.ts                      ← Demo Data
│
├── 📁 styles/
│   └── globals.css                      ← Global Styles
│
├── 📁 guidelines/
│   └── Guidelines.md                    ← Coding Standards
│
├── 📄 App.tsx                           ← Application Root
├── 📄 README.md                         ← Project Overview
├── 📄 PROJECT_ARCHITECTURE.md           ← This Document
└── 📄 ... (documentation files)
```

---

## 🎨 **UI Component Library Structure**

```
components/ui/
│
├── 📦 Form Components
│   ├── input.tsx                 ← Text input
│   ├── textarea.tsx              ← Multi-line input
│   ├── select.tsx                ← Dropdown
│   ├── checkbox.tsx              ← Checkbox
│   ├── radio-group.tsx           ← Radio buttons
│   ├── switch.tsx                ← Toggle
│   ├── slider.tsx                ← Range slider
│   ├── calendar.tsx              ← Date picker
│   └── input-otp.tsx             ← OTP input
│
├── 📦 Layout Components
│   ├── card.tsx                  ← Container
│   ├── separator.tsx             ← Divider
│   ├── accordion.tsx             ← Collapse
│   ├── tabs.tsx                  ← Tabs
│   ├── sidebar.tsx               ← Sidebar
│   ├── resizable.tsx             ← Resize panels
│   └── scroll-area.tsx           ← Scrollbar
│
├── 📦 Feedback Components
│   ├── alert.tsx                 ← Alerts
│   ├── alert-dialog.tsx          ← Modals
│   ├── dialog.tsx                ← Generic modal
│   ├── drawer.tsx                ← Drawer
│   ├── sheet.tsx                 ← Sheet
│   ├── sonner.tsx                ← Toasts
│   ├── progress.tsx              ← Progress bar
│   └── skeleton.tsx              ← Loading
│
├── 📦 Navigation Components
│   ├── navigation-menu.tsx       ← Nav menu
│   ├── menubar.tsx               ← Menu bar
│   ├── breadcrumb.tsx            ← Breadcrumbs
│   ├── pagination.tsx            ← Pagination
│   ├── dropdown-menu.tsx         ← Dropdown
│   └── context-menu.tsx          ← Right-click
│
├── 📦 Data Display
│   ├── table.tsx                 ← Tables
│   ├── badge.tsx                 ← Badges
│   ├── avatar.tsx                ← Avatars
│   ├── chart.tsx                 ← Charts
│   ├── hover-card.tsx            ← Hover cards
│   ├── popover.tsx               ← Popovers
│   └── tooltip.tsx               ← Tooltips
│
└── 📦 Utilities
    ├── button.tsx                ← Buttons
    ├── use-mobile.ts             ← Mobile hook
    └── utils.ts                  ← Helpers
```

---

## 🔐 **Authentication Flow Diagram**

```
START
  │
  ▼
┌─────────────────┐
│  Load App       │
│  App.tsx        │
└────────┬────────┘
         │
         ▼
    ┌─────────────┐
    │ currentUser │
    │   === null? │
    └──┬───────┬──┘
       │       │
    YES│       │NO
       │       │
       ▼       ▼
  ┌─────────┐ ┌──────────────────┐
  │ AuthPage│ │ Main Application │
  └────┬────┘ └──────────────────┘
       │
       ▼
  ┌──────────────┐
  │ Enter Email  │
  │ Enter Pass   │
  └──────┬───────┘
         │
         ▼
  ┌─────────────────┐
  │ Validate Against│
  │ localStorage    │
  │ "users"         │
  └──────┬──────────┘
         │
    ┌────┴─────┐
    │          │
 VALID│      INVALID│
    │          │
    ▼          ▼
┌────────┐  ┌─────────┐
│Success │  │ Error   │
│        │  │ Message │
└────┬───┘  └─────────┘
     │
     ▼
┌──────────────────┐
│ setCurrentUser() │
│ Navigate to      │
│ Dashboard        │
└──────────────────┘
```

---

## 📊 **Data Management Flow**

```
                    ┌─────────────────────┐
                    │   USER ACTION       │
                    │  (Add/Edit/Delete)  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   COMPONENT          │
                    │  (Form/Table/Modal)  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   EVENT HANDLER      │
                    │  handleAddProduct()  │
                    │  handleUpdateUser()  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   VALIDATION         │
                    │  • Required fields   │
                    │  • Data types        │
                    │  • Business rules    │
                    └──────────┬───────────┘
                               │
                          ┌────┴────┐
                          │         │
                      VALID│     INVALID│
                          │         │
                          ▼         ▼
                   ┌─────────┐  ┌─────────┐
                   │ Process │  │ Show    │
                   │ Data    │  │ Error   │
                   └────┬────┘  └─────────┘
                        │
                        ▼
                   ┌─────────────────┐
                   │ STATE UPDATE    │
                   │ setProducts()   │
                   │ setUsers()      │
                   │ setSales()      │
                   └────┬────────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
           ▼                         ▼
    ┌─────────────┐         ┌──────────────┐
    │ useEffect   │         │ React        │
    │ Trigger     │         │ Re-render    │
    └──────┬──────┘         └──────────────┘
           │
           ▼
    ┌──────────────────┐
    │ localStorage     │
    │ .setItem()       │
    │                  │
    │ Data Persisted! │
    └──────────────────┘
```

---

## 🎯 **Role-Based Access Control (RBAC)**

```
┌─────────────────────────────────────────────────────────────┐
│                        USER ROLES                            │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
      ┌──────────┐    ┌──────────┐    ┌──────────┐
      │  ADMIN   │    │ MANAGER  │    │ ANALYST  │
      └────┬─────┘    └────┬─────┘    └────┬─────┘
           │               │               │
           │               │               │
    ┌──────▼──────┐  ┌─────▼──────┐  ┌────▼─────┐
    │ PERMISSIONS │  │ PERMISSIONS│  │PERMISSIONS│
    ├─────────────┤  ├────────────┤  ├───────────┤
    │ ✅ Dashboard│  │ ✅ Dashboard│  │ ✅ Dashboard│
    │ ✅ Sales    │  │ ✅ Sales   │  │ ❌ Sales   │
    │ ✅ Products │  │ ✅ Products│  │ ❌ Products│
    │ ✅ Reports  │  │ ✅ Reports │  │ ✅ Reports │
    │ ✅ Import   │  │ ✅ Import  │  │ ❌ Import  │
    │ ✅ Users    │  │ ❌ Users   │  │ ❌ Users   │
    │             │  │            │  │            │
    │ All Stores  │  │ Own Store  │  │ All Stores │
    │ Can CRUD    │  │ Own Only   │  │ View Only  │
    └─────────────┘  └────────────┘  └────────────┘
```

---

## 📱 **Responsive Breakpoints**

```
┌─────────────────────────────────────────────────────────────┐
│                     RESPONSIVE DESIGN                        │
└─────────────────────────────────────────────────────────────┘

📱 MOBILE (< 768px)
├── Single column layout
├── Mobile header (hamburger menu)
├── Collapsible navigation drawer
├── Stacked KPI cards
├── Simplified tables (horizontal scroll)
└── Touch-optimized buttons

📱 TABLET (768px - 1024px)
├── Two column layout
├── Visible sidebar
├── 2x2 KPI cards grid
├── Full tables with scroll
└── Medium spacing

💻 DESKTOP (1024px - 1280px)
├── Full sidebar (w-64)
├── Three column layout
├── 4x1 KPI cards
├── Full tables
└── Standard spacing

🖥️ LARGE DESKTOP (> 1280px)
├── Expanded sidebar (w-72)
├── Four column layout
├── 4x1 large KPI cards
├── Wide tables
└── Generous spacing

Tailwind Breakpoints:
├── sm: 640px
├── md: 768px
├── lg: 1024px
├── xl: 1280px
└── 2xl: 1536px
```

---

## 🔄 **localStorage Data Schema**

```json
{
  "users": [
    {
      "id": "U1234567890",
      "name": "John Doe",
      "email": "john@store.com",
      "password": "password123",
      "role": "manager",
      "storeLocation": "Store A"
    }
  ],
  
  "products": [
    {
      "id": "P1234567890",
      "name": "Product Name",
      "category": "Groceries",
      "price": 29.99,
      "cost": 15.00,
      "currentStock": 100,
      "reorderLevel": 20,
      "lastRestocked": "2024-12-01T00:00:00.000Z",
      "nextRestockDate": "2024-12-20T00:00:00.000Z",
      "supplier": "Supplier Inc"
    }
  ],
  
  "sales": [
    {
      "id": "S1234567890",
      "productId": "P1234567890",
      "productName": "Product Name",
      "quantity": 5,
      "totalAmount": 149.95,
      "saleDate": "2024-12-16T10:30:00.000Z",
      "storeLocation": "Store A",
      "soldBy": "John Doe"
    }
  ],
  
  "businessName": "My Retail Store",
  "darkMode": "true",
  "setupCompleted": "true"
}
```

---

## 🎨 **Color System**

```
LIGHT MODE
├── Primary: Indigo-600     #4F46E5
├── Secondary: Purple-600   #9333EA
├── Background: White       #FFFFFF
├── Foreground: Gray-900    #111827
├── Border: Gray-200        #E5E7EB
├── Muted: Gray-50          #F9FAFB
├── Success: Green-500      #10B981
├── Warning: Orange-500     #F59E0B
└── Error: Red-500          #EF4444

DARK MODE
├── Primary: Indigo-500     #6366F1
├── Secondary: Purple-500   #A855F7
├── Background: Gray-900    #111827
├── Foreground: White       #FFFFFF
├── Border: Gray-700        #374151
├── Muted: Gray-800         #1F2937
├── Success: Green-400      #34D399
├── Warning: Orange-400     #FB923C
└── Error: Red-400          #F87171
```

---

## 📈 **Chart Types Used**

```
┌────────────────────────────────────┐
│        DASHBOARD CHARTS            │
└────────────────────────────────────┘

1. LINE CHART
   ├── Purpose: Sales trends over time
   ├── X-Axis: Date
   ├── Y-Axis: Revenue ($)
   └── Library: Recharts

2. BAR CHART
   ├── Purpose: Product sales comparison
   ├── X-Axis: Product names
   ├── Y-Axis: Quantity sold
   └── Library: Recharts

3. PIE CHART
   ├── Purpose: Category distribution
   ├── Segments: Product categories
   ├── Values: Sales percentage
   └── Library: Recharts

4. AREA CHART (Reports)
   ├── Purpose: Profit margins
   ├── X-Axis: Time periods
   ├── Y-Axis: Profit %
   └── Library: Recharts
```

---

## 🔔 **Alert System Architecture**

```
┌──────────────────────────────────────┐
│        ALERT GENERATION              │
└──────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │   useEffect Hook      │
    │   (products, sales)   │
    └───────────┬───────────┘
                │
    ┌───────────┴──────────┐
    │                      │
    ▼                      ▼
┌──────────┐         ┌──────────┐
│ Check    │         │ Check    │
│ Stock    │         │ Sales    │
│ Levels   │         │ History  │
└────┬─────┘         └────┬─────┘
     │                    │
     ▼                    ▼
┌──────────────┐    ┌──────────────┐
│ LOW STOCK    │    │ DEAD STOCK   │
│ Alert        │    │ Alert        │
└──────┬───────┘    └──────┬───────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
        ┌────────────────┐
        │ RESTOCK DUE    │
        │ Alert          │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ setAlerts()    │
        │ Update State   │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Alerts Panel   │
        │ Displays       │
        │ Notifications  │
        └────────────────┘
```

---

## 🚀 **Application Lifecycle**

```
1. APP LOAD
   ├── Load App.tsx
   ├── Initialize state
   └── Check localStorage
        ├── Load users
        ├── Load products
        ├── Load sales
        └── Load settings

2. AUTHENTICATION CHECK
   ├── currentUser === null?
   │   ├── YES → Show AuthPage
   │   └── NO → Show Main App

3. FIRST TIME USER?
   ├── No data in localStorage?
   │   ├── YES → Show WelcomeScreen
   │   └── NO → Show Dashboard

4. USER INTERACTION
   ├── Navigate pages
   ├── Add/Edit data
   ├── Import CSV
   └── Manage users

5. DATA PERSISTENCE
   ├── useEffect triggers
   ├── Save to localStorage
   └── Sync across tabs (optional)

6. LOGOUT
   ├── Clear currentUser
   ├── Reset to AuthPage
   └── Keep localStorage intact
```

---

## 🎯 **Key Performance Indicators (KPIs)**

```
┌────────────────────────────────────────────┐
│            KPI CALCULATIONS                │
└────────────────────────────────────────────┘

📊 TOTAL SALES
Formula: Σ (sale.totalAmount)
Source: sales array
Display: $XX,XXX.XX

📦 TOTAL PRODUCTS
Formula: products.length
Source: products array
Display: XXX products

💰 AVERAGE ORDER VALUE
Formula: totalSales / sales.length
Source: sales array
Display: $XX.XX

🛒 TOTAL TRANSACTIONS
Formula: sales.length
Source: sales array
Display: XXX transactions

📈 PROFIT MARGIN
Formula: ((revenue - cost) / revenue) × 100
Source: sales + products
Display: XX.X%

🔄 INVENTORY TURNOVER
Formula: COGS / avg inventory
Source: products + sales
Display: X.X turns

⚠️ LOW STOCK ITEMS
Formula: currentStock <= reorderLevel
Source: products array
Display: XX items

💀 DEAD STOCK ITEMS
Formula: No sales in 30+ days
Source: products + sales
Display: XX items
```

---

**Last Updated:** December 2024  
**Version:** 2.0.0  
**Status:** ✅ Complete

