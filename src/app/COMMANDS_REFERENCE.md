# 🚀 ShelfIQ - Quick Commands Reference

## 📋 Essential Commands

### Development
```bash
# Start development server
npm run dev

# Open in browser (after starting dev server)
# http://localhost:5173
```

### Build & Preview
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deployment
```bash
# Deploy to Vercel (one command)
npx vercel --prod

# Deploy to Netlify
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Database Management
```bash
# Connect to Supabase
npx supabase link --project-ref ownnkpnqnffowxygutql

# Run migrations
npx supabase db push

# Reset database (careful!)
npx supabase db reset
```

---

## 🔗 Important URLs

### Your Supabase Project
- **Dashboard**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql
- **Table Editor**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/editor
- **SQL Editor**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/sql
- **Authentication**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/auth/users
- **Logs**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/logs/postgres-logs
- **Settings**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/settings/api

### Your Credentials
- **Project URL**: https://ownnkpnqnffowxygutql.supabase.co
- **Project ID**: ownnkpnqnffowxygutql
- **Anon Key**: (in `/utils/supabase/info.tsx`)

---

## 🧪 Testing Commands

### Test Registration Flow
1. Start dev server: `npm run dev`
2. Open: http://localhost:5173
3. Click "Get Started"
4. Complete 6-step registration
5. Verify in Supabase Table Editor

### Test Product CRUD
```typescript
// In browser console (F12)
// After logging in

// Check current user
console.log('User:', currentUser);

// Check business ID
console.log('Business ID:', currentBusiness?.id);
```

### Check Supabase Connection
```bash
# In browser console
localStorage.getItem('sb-ownnkpnqnffowxygutql-auth-token')
```

---

## 📊 Database Queries (Supabase SQL Editor)

### Check if tables exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Count records in each table
```sql
SELECT 
  'businesses' as table_name, COUNT(*) as count FROM businesses
UNION ALL
SELECT 'branches', COUNT(*) FROM branches
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'sales', COUNT(*) FROM sales;
```

### View recent registrations
```sql
SELECT 
  business_name, 
  email, 
  business_type,
  created_at 
FROM businesses 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check user accounts
```sql
SELECT 
  u.name,
  u.email,
  u.role,
  b.business_name
FROM users u
LEFT JOIN businesses b ON u.business_id = b.id
ORDER BY u.created_at DESC;
```

### View products by business
```sql
SELECT 
  p.name,
  p.category,
  p.current_stock,
  p.selling_price,
  b.business_name
FROM products p
JOIN businesses b ON p.business_id = b.id
ORDER BY p.created_at DESC
LIMIT 20;
```

### Sales summary
```sql
SELECT 
  b.business_name,
  COUNT(s.id) as total_sales,
  SUM(s.total_amount) as total_revenue
FROM sales s
JOIN businesses b ON s.business_id = b.id
GROUP BY b.id, b.business_name
ORDER BY total_revenue DESC;
```

---

## 🔧 Troubleshooting Commands

### Clear browser cache
```javascript
// In browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Check Supabase auth status
```javascript
// In browser console
import { supabase } from './utils/supabaseClient';
const { data } = await supabase.auth.getSession();
console.log('Session:', data);
```

### Reset local state
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Clear build cache
rm -rf dist
npm run build
```

### Check environment variables
```bash
# Print all VITE_ variables
env | grep VITE_
```

---

## 📦 Package Management

### Install new package
```bash
npm install package-name
```

### Update all packages
```bash
npm update
```

### Check for outdated packages
```bash
npm outdated
```

### Security audit
```bash
npm audit
npm audit fix
```

---

## 🚀 Git Commands

### Initial setup
```bash
git init
git add .
git commit -m "Initial commit - ShelfIQ production ready"
git branch -M main
git remote add origin https://github.com/yourusername/shelfiq.git
git push -u origin main
```

### Daily workflow
```bash
# Pull latest changes
git pull

# Make changes, then:
git add .
git commit -m "Description of changes"
git push
```

### Create new feature
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push -u origin feature/new-feature
```

---

## 🔒 Security Commands

### Generate secure password
```bash
# In browser console
crypto.randomUUID()
```

### Check for exposed secrets
```bash
# Install git-secrets
npm install -g git-secrets

# Scan for secrets
git secrets --scan
```

---

## 📈 Performance Commands

### Build size analysis
```bash
npm run build

# Check dist folder size
du -sh dist
```

### Lighthouse audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5173 --view
```

---

## 💡 Useful Snippets

### Quick test user creation (SQL)
```sql
-- Run in Supabase SQL Editor
INSERT INTO businesses (
  owner_id,
  business_name,
  legal_name,
  display_name,
  business_type,
  industry,
  email,
  phone,
  address,
  city,
  state,
  state_code,
  pincode,
  country
) VALUES (
  gen_random_uuid(),
  'Test Store',
  'Test Store Pvt Ltd',
  'Test Store',
  'LOCAL_STORE',
  'RETAIL',
  'test@example.com',
  '9876543210',
  '123 Test Street',
  'Mumbai',
  'Maharashtra',
  '27',
  '400001',
  'India'
);
```

### Quick product creation (SQL)
```sql
-- Get your business ID first
SELECT id, business_name FROM businesses LIMIT 1;

-- Insert product (replace business_id)
INSERT INTO products (
  business_id,
  name,
  category,
  cost_price,
  selling_price,
  current_stock,
  reorder_level,
  unit
) VALUES (
  'your-business-id-here',
  'Sample Product',
  'Electronics',
  100,
  150,
  50,
  10,
  'pcs'
);
```

---

## 🎯 Common Tasks

### Add new user to existing business
```sql
INSERT INTO users (
  name,
  email,
  role,
  business_id,
  is_active
) VALUES (
  'Manager Name',
  'manager@example.com',
  'manager',
  'your-business-id',
  true
);
```

### Update product stock
```sql
UPDATE products 
SET current_stock = current_stock - 10
WHERE id = 'product-id';
```

### Generate sales report
```sql
SELECT 
  DATE(sale_date) as date,
  COUNT(*) as total_sales,
  SUM(total_amount) as revenue
FROM sales
WHERE business_id = 'your-business-id'
  AND sale_date >= NOW() - INTERVAL '30 days'
GROUP BY DATE(sale_date)
ORDER BY date DESC;
```

---

## 📱 Mobile Testing

### Test on real device
```bash
# Start dev server with network access
npm run dev -- --host

# Access from mobile
# http://YOUR_IP:5173
```

### Check responsive design
```bash
# Open Chrome DevTools
# Press F12
# Click device toolbar icon (Ctrl+Shift+M)
```

---

## 🆘 Emergency Commands

### If build fails
```bash
rm -rf node_modules dist .next
npm install
npm run build
```

### If database is corrupted
```sql
-- Backup first!
-- Then re-run schema.sql
```

### If deployment fails
```bash
# Check logs
npx vercel logs

# Redeploy
npx vercel --force
```

---

## 📞 Support

If something doesn't work:
1. Check browser console (F12)
2. Check Supabase logs
3. Check this reference
4. Ask me for help!

---

**Quick Access**: Bookmark this page for easy reference! 🔖
