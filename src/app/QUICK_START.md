# Quick Start Guide - 5 Minutes Setup

## The Fastest Way to Build This Project

### Method 1: Using Cursor or Windsurf AI (⚡ FASTEST - 2 minutes)

1. **Create Project Structure**
   ```bash
   npm create vite@latest retail-kpi-system -- --template react-ts
   cd retail-kpi-system
   npm install recharts lucide-react
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configure Tailwind**
   
   Update `tailwind.config.js`:
   ```javascript
   export default {
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
     theme: { extend: {} },
     plugins: [],
   }
   ```

3. **Update `src/index.css`**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Create Folder Structure**
   ```bash
   mkdir src/components src/types src/utils
   ```

5. **Open `CURSOR_WINDSURF_PROMPT.md`**
   - Copy the entire "AI ASSISTANT PROMPT" section
   - Paste into Cursor/Windsurf AI chat
   - AI will generate ALL code files for you

6. **Run the App**
   ```bash
   npm run dev
   ```

---

### Method 2: Copy-Paste All Code (⏱️ 10 minutes)

All the code files are available in this project. Simply:

1. **Follow Method 1 steps 1-4 above**

2. **Copy these files from the current project:**

   **Type Definitions:**
   - Copy `/types/index.ts` to `src/types/index.ts`

   **Utilities:**
   - Copy `/utils/mockData.ts` to `src/utils/mockData.ts`
   - Copy `/utils/kpiCalculations.ts` to `src/utils/kpiCalculations.ts`

   **Components:**
   - Copy `/components/Login.tsx` to `src/components/Login.tsx`
   - Copy `/components/Dashboard.tsx` to `src/components/Dashboard.tsx`
   - Copy `/components/SalesManagement.tsx` to `src/components/SalesManagement.tsx`
   - Copy `/components/ProductManagement.tsx` to `src/components/ProductManagement.tsx`
   - Copy `/components/Reports.tsx` to `src/components/Reports.tsx`
   - Copy `/components/DataImport.tsx` to `src/components/DataImport.tsx`
   - Copy `/components/SetupWizard.tsx` to `src/components/SetupWizard.tsx`

   **Main Files:**
   - Copy `/App.tsx` to `src/App.tsx`
   - Update `src/index.css` with the CSS from above

3. **Run the App**
   ```bash
   npm run dev
   ```

---

### Method 3: Manual File-by-File (📚 30 minutes)

Follow the complete guide in `IMPLEMENTATION_GUIDE.md`

---

## What You'll Get

### ✅ Complete Features

- **Authentication** - 3 user roles with demo login
- **Setup Wizard** - First-time user onboarding
- **Dashboard** - Real-time KPIs with interactive charts
- **Sales Management** - Record and track sales
- **Product Management** - Inventory with low stock alerts
- **Reports** - CSV export and analytics
- **Data Import** - Bulk CSV upload

### ✅ Pre-loaded Data

- 15 products across 7 categories
- 30 days of sales history
- 3 demo users (Admin, Manager, Analyst)

### ✅ Technology Stack

- React 18 + TypeScript
- Tailwind CSS (beautiful UI)
- Recharts (interactive charts)
- Lucide React (modern icons)
- LocalStorage (data persistence)

---

## Testing After Setup

1. **Open in browser:** `http://localhost:5173`

2. **Quick Login:**
   - Click "Admin" button
   - Or use: admin@retail.com / admin123

3. **Explore Features:**
   - Dashboard: Change time range, view charts
   - Sales: Add a new sale, export data
   - Products: Add/edit products, adjust stock
   - Reports: Export different reports
   - Data Import: Download templates, upload CSV

4. **Test Setup Wizard:**
   - Open browser console (F12)
   - Type: `localStorage.clear()`
   - Refresh page
   - See setup wizard!

---

## File Checklist

After setup, verify you have these files:

```
✅ src/types/index.ts
✅ src/utils/mockData.ts
✅ src/utils/kpiCalculations.ts
✅ src/components/Login.tsx
✅ src/components/Dashboard.tsx
✅ src/components/SalesManagement.tsx
✅ src/components/ProductManagement.tsx
✅ src/components/Reports.tsx
✅ src/components/DataImport.tsx
✅ src/components/SetupWizard.tsx
✅ src/App.tsx
✅ src/main.tsx
✅ src/index.css
✅ tailwind.config.js
✅ package.json (with recharts & lucide-react)
```

---

## Common Issues & Fixes

### Issue 1: "Module not found: recharts"
```bash
npm install recharts --force
```

### Issue 2: Blank white screen
- Check browser console (F12)
- Look for red errors
- Usually a missing import or typo

### Issue 3: Tailwind styles not working
```bash
# Make sure index.css has:
@tailwind base;
@tailwind components;
@tailwind utilities;

# Then restart:
npm run dev
```

### Issue 4: TypeScript errors
```bash
# In tsconfig.json, make sure:
"strict": false  // temporarily
```

---

## Project Structure (What Goes Where)

```
src/
│
├── types/           ← TypeScript interfaces
│   └── index.ts     → User, Product, Sale, KPIMetrics
│
├── utils/           ← Helper functions
│   ├── mockData.ts  → Demo users, products, sales
│   └── kpiCalculations.ts → KPI calculations, CSV export
│
├── components/      ← React components
│   ├── Login.tsx    → Login page
│   ├── Dashboard.tsx → Main dashboard with charts
│   ├── SalesManagement.tsx → Add/view sales
│   ├── ProductManagement.tsx → Manage inventory
│   ├── Reports.tsx  → Generate reports
│   ├── DataImport.tsx → Upload CSV files
│   └── SetupWizard.tsx → First-time setup
│
├── App.tsx          ← Main app (routing & state)
├── main.tsx         ← React entry point
└── index.css        ← Tailwind CSS
```

---

## Next Steps After Setup

1. **Customize the Data**
   - Go to Data Import
   - Download product template
   - Add your products
   - Upload CSV

2. **Change Branding**
   - Update business name in Setup Wizard
   - Modify colors in components

3. **Deploy to Production**
   ```bash
   npm run build
   # Upload 'dist' folder to Netlify/Vercel
   ```

4. **Add Backend (Optional)**
   - Connect to Supabase
   - Use real database instead of localStorage

---

## Commands Reference

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Clean Install
rm -rf node_modules package-lock.json
npm install          # Fresh install

# Clear Data
# In browser console (F12):
localStorage.clear()
```

---

## Demo Credentials

**Admin (Full Access):**
- Email: admin@retail.com
- Password: admin123

**Manager (Most Features):**
- Email: manager@retail.com
- Password: manager123

**Analyst (View Only):**
- Email: analyst@retail.com
- Password: analyst123

---

## Support & Help

If you encounter issues:

1. **Check Browser Console** (F12 → Console tab)
2. **Verify Node Version** (need 18+)
   ```bash
   node --version
   ```
3. **Clear Everything and Reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

---

## Success Checklist

After setup, you should be able to:

- [ ] Login with demo credentials
- [ ] See dashboard with charts
- [ ] Add a new sale
- [ ] Add a new product
- [ ] Export sales to CSV
- [ ] Upload products from CSV
- [ ] Generate reports
- [ ] See low stock alerts
- [ ] Change time ranges on dashboard
- [ ] View KPIs for different periods

---

**Congratulations! Your Retail KPI System is ready! 🎉**

Start by logging in as Admin and exploring all features.

For detailed documentation, see:
- `IMPLEMENTATION_GUIDE.md` - Complete technical guide
- `USER_GUIDE.md` - How to use your own data
- `README.md` - Project overview

**Happy tracking! 📊**
