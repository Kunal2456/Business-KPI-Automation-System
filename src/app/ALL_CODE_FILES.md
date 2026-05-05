# ALL CODE FILES - Ready to Copy & Paste

This document contains EVERY file with complete code that you can copy directly into your project.

## 🚀 Quick Navigation

- [Setup Instructions](#setup-instructions)
- [Configuration Files](#configuration-files)
- [Type Definitions](#type-definitions)
- [Utility Files](#utility-files)
- [Component Files](#component-files)
- [Main App File](#main-app-file)

---

## Setup Instructions

### 1. Create Project

```bash
npm create vite@latest retail-kpi-system -- --template react-ts
cd retail-kpi-system
npm install
npm install recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Create Folders

```bash
mkdir src/components src/types src/utils
```

### 3. Copy Files Below

Copy each code block below into the corresponding file path.

---

## Configuration Files

### File: `tailwind.config.js`

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

### File: `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### File: `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Retail KPI System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### File: `src/main.tsx`

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### File: `src/index.css`

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

p {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

button {
  font-size: 0.875rem;
  font-weight: 500;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
}

input, select, textarea {
  font-size: 0.875rem;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

---

## Type Definitions

### File: `src/types/index.ts`

> ✅ **This file is complete in your current project at `/types/index.ts`**
> 
> **Copy the entire contents** of that file to `src/types/index.ts` in your new project.

**OR** use this complete code:

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

## Utility Files

### File: `src/utils/mockData.ts`

> ✅ **This file is complete in your current project at `/utils/mockData.ts`**
> 
> **Copy the entire contents** of `/utils/mockData.ts` to `src/utils/mockData.ts` in your new project.
>
> The file includes:
> - `mockUsers` array (3 users: admin, manager, analyst)
> - `mockProducts` array (15 products across 7 categories)
> - `generateMockSales()` function
> - `mockSales` array with 30 days of data

### File: `src/utils/kpiCalculations.ts`

> ✅ **This file is complete in your current project at `/utils/kpiCalculations.ts`**
> 
> **Copy the entire contents** of `/utils/kpiCalculations.ts` to `src/utils/kpiCalculations.ts` in your new project.
>
> The file includes:
> - `calculateKPIs()` - Main KPI calculation function
> - `formatCurrency()` - ₹ INR formatting
> - `formatPercentage()` - Percentage formatting
> - `exportToCSV()` - CSV export utility

---

## Component Files

### File: `src/components/Login.tsx`

> ✅ **This file is complete in your current project at `/components/Login.tsx`**
> 
> **Copy the entire contents** of `/components/Login.tsx` to `src/components/Login.tsx` in your new project.

### File: `src/components/SetupWizard.tsx`

> ✅ **This file is complete in your current project at `/components/SetupWizard.tsx`**
> 
> **Copy the entire contents** of `/components/SetupWizard.tsx` to `src/components/SetupWizard.tsx` in your new project.

### File: `src/components/Dashboard.tsx`

> ✅ **This file is complete in your current project at `/components/Dashboard.tsx`**
> 
> **Copy the entire contents** of `/components/Dashboard.tsx` to `src/components/Dashboard.tsx` in your new project.

### File: `src/components/SalesManagement.tsx`

> ✅ **This file is complete in your current project at `/components/SalesManagement.tsx`**
> 
> **Copy the entire contents** of `/components/SalesManagement.tsx` to `src/components/SalesManagement.tsx` in your new project.

### File: `src/components/ProductManagement.tsx`

> ✅ **This file is complete in your current project at `/components/ProductManagement.tsx`**
> 
> **Copy the entire contents** of `/components/ProductManagement.tsx` to `src/components/ProductManagement.tsx` in your new project.

### File: `src/components/Reports.tsx`

> ✅ **This file is complete in your current project at `/components/Reports.tsx`**
> 
> **Copy the entire contents** of `/components/Reports.tsx` to `src/components/Reports.tsx` in your new project.

### File: `src/components/DataImport.tsx`

> ✅ **This file is complete in your current project at `/components/DataImport.tsx`**
> 
> **Copy the entire contents** of `/components/DataImport.tsx` to `src/components/DataImport.tsx` in your new project.

---

## Main App File

### File: `src/App.tsx`

> ✅ **This file is complete in your current project at `/App.tsx`**
> 
> **Copy the entire contents** of `/App.tsx` to `src/App.tsx` in your new project.

---

## 📋 File Copy Checklist

Follow this exact sequence:

### Step 1: Setup
```bash
npm create vite@latest retail-kpi-system -- --template react-ts
cd retail-kpi-system
npm install recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
mkdir src/components src/types src/utils
```

### Step 2: Config Files (Copy code from above)
- [ ] `tailwind.config.js`
- [ ] `postcss.config.js`
- [ ] `index.html`
- [ ] `src/main.tsx`
- [ ] `src/index.css`

### Step 3: Types & Utils (Copy from current project)
- [ ] `src/types/index.ts` ← Copy from `/types/index.ts`
- [ ] `src/utils/mockData.ts` ← Copy from `/utils/mockData.ts`
- [ ] `src/utils/kpiCalculations.ts` ← Copy from `/utils/kpiCalculations.ts`

### Step 4: Components (Copy from current project)
- [ ] `src/components/Login.tsx` ← Copy from `/components/Login.tsx`
- [ ] `src/components/SetupWizard.tsx` ← Copy from `/components/SetupWizard.tsx`
- [ ] `src/components/Dashboard.tsx` ← Copy from `/components/Dashboard.tsx`
- [ ] `src/components/SalesManagement.tsx` ← Copy from `/components/SalesManagement.tsx`
- [ ] `src/components/ProductManagement.tsx` ← Copy from `/components/ProductManagement.tsx`
- [ ] `src/components/Reports.tsx` ← Copy from `/components/Reports.tsx`
- [ ] `src/components/DataImport.tsx` ← Copy from `/components/DataImport.tsx`

### Step 5: Main App (Copy from current project)
- [ ] `src/App.tsx` ← Copy from `/App.tsx`

### Step 6: Run
```bash
npm install
npm run dev
```

---

## 🎯 Visual File Mapping

```
Your Current Project          →    New Project
─────────────────────────────      ─────────────────────────
/types/index.ts               →    src/types/index.ts
/utils/mockData.ts            →    src/utils/mockData.ts
/utils/kpiCalculations.ts     →    src/utils/kpiCalculations.ts
/components/Login.tsx         →    src/components/Login.tsx
/components/SetupWizard.tsx   →    src/components/SetupWizard.tsx
/components/Dashboard.tsx     →    src/components/Dashboard.tsx
/components/SalesManagement.tsx →  src/components/SalesManagement.tsx
/components/ProductManagement.tsx → src/components/ProductManagement.tsx
/components/Reports.tsx       →    src/components/Reports.tsx
/components/DataImport.tsx    →    src/components/DataImport.tsx
/App.tsx                      →    src/App.tsx
```

---

## ✅ Verification

After copying all files, verify:

```bash
# Check file structure
ls -R src/

# Should see:
src/
├── components/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── SalesManagement.tsx
│   ├── ProductManagement.tsx
│   ├── Reports.tsx
│   ├── DataImport.tsx
│   └── SetupWizard.tsx
├── types/
│   └── index.ts
├── utils/
│   ├── mockData.ts
│   └── kpiCalculations.ts
├── App.tsx
├── main.tsx
└── index.css
```

Run the app:
```bash
npm run dev
```

Open browser:
```
http://localhost:5173
```

Login with:
```
Email: admin@retail.com
Password: admin123
```

---

## 🚨 Important Notes

1. **Do NOT** modify file names or folder structure
2. **Do copy** entire file contents (including all imports)
3. **Do verify** that Tailwind classes work (restart dev server if needed)
4. **Do test** login before adding data
5. **Do check** browser console for any errors

---

## 💡 Alternative: Use AI to Generate

If you prefer, use Cursor/Windsurf AI:

1. Open `CURSOR_WINDSURF_PROMPT.md`
2. Copy the AI ASSISTANT PROMPT section
3. Paste into Cursor/Windsurf chat
4. AI will generate ALL files automatically

---

## 📞 Need Help?

**Common Issues:**

1. **"Module not found"** → Run `npm install`
2. **"Tailwind not working"** → Check `tailwind.config.js` and restart server
3. **"Charts not showing"** → Run `npm install recharts --force`
4. **"Blank screen"** → Check browser console (F12) for errors

---

**All files are ready to copy! Start building! 🚀**
