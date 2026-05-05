# 🚀 ShelfIQ Setup Instructions - Your Credentials

## ✅ STEP 1: Supabase Configuration (DONE!)

Your Supabase credentials have been configured:
- ✅ Project ID: `ownnkpnqnffowxygutql`
- ✅ Project URL: `https://ownnkpnqnffowxygutql.supabase.co`
- ✅ Anon Key: Configured in `/utils/supabase/info.tsx`
- ✅ Service Role Key: Configured (keep secret!)

---

## 📋 STEP 2: Deploy Database Schema (DO THIS NOW!)

### Option A: Supabase Dashboard (Recommended)

1. **Go to SQL Editor**:
   - Open: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/sql
   
2. **Create New Query**:
   - Click "+ New query"
   
3. **Copy Database Schema**:
   - Open file: `/supabase/schema.sql`
   - Copy the ENTIRE content (it's long, ~500 lines)
   
4. **Paste and Run**:
   - Paste into SQL Editor
   - Click "Run" button (or press Ctrl/Cmd + Enter)
   - Wait 5-10 seconds
   
5. **Verify Success**:
   - Should see "Success. No rows returned"
   - Go to Table Editor: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/editor
   - You should see **10 new tables**:
     1. ✅ businesses
     2. ✅ branches
     3. ✅ users
     4. ✅ products
     5. ✅ customers
     6. ✅ sales
     7. ✅ alerts
     8. ✅ invoices
     9. ✅ subscriptions
     10. ✅ payments

### Option B: Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref ownnkpnqnffowxygutql

# Run migrations
supabase db push
```

---

## 💻 STEP 3: Install Dependencies

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Verify other dependencies (should already be installed)
npm install
```

---

## 🧪 STEP 4: Test Locally

```bash
# Start development server
npm run dev
```

**Expected Output**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open browser**: http://localhost:5173

---

## ✅ STEP 5: Test Registration Flow

1. **Landing Page**:
   - You should see the ShelfIQ landing page
   - Click "Get Started"

2. **Welcome Screen**:
   - Click "Start Setup Wizard" or see the onboarding

3. **Business Onboarding** (6 Steps):
   
   **Step 1: Business Type**
   - Select "GST Registered" (or your preference)
   
   **Step 2: Business Details**
   - GSTIN: `27AAAAA0000A1Z5` (test GSTIN)
   - Click "Auto-Fill" (will use mock data for now)
   - Business Name: Your Store Name
   - Legal Name: Your Legal Name
   - Industry: Select your industry
   
   **Step 3: Address & Contact**
   - Address: Your address
   - City: Your city
   - State: Select from dropdown
   - Pincode: 6-digit pincode
   - Email: your@email.com
   - Phone: 10-digit number
   
   **Step 4: Owner Details**
   - Your Name: John Doe
   - Your Email: john@example.com
   - Your Phone: 9876543210
   - Password: minimum 8 characters
   
   **Step 5: Complete**
   - Click "Complete Setup"

4. **Verify in Supabase**:
   - Go to: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/editor
   - Check **businesses** table → Should have 1 row
   - Check **users** table → Should have 1 user
   - Check **branches** table → Should have 1 HQ branch

5. **Dashboard**:
   - You should now see the main dashboard
   - Try adding a product
   - Try recording a sale

---

## 🔍 STEP 6: Verify Database Operations

### Check if data is being saved:

1. **Add a Product**:
   - Go to Products page
   - Click "Add Product"
   - Fill in details:
     - Name: Test Product
     - Category: Electronics
     - Cost Price: 100
     - Selling Price: 150
     - Stock: 50
   - Click "Add"

2. **Verify in Supabase**:
   - Go to Table Editor → products table
   - You should see your new product!

3. **Record a Sale**:
   - Go to Sales page
   - Record a sale for the product you created
   - Check sales table in Supabase

**If you see data in Supabase tables** = ✅ SUCCESS! Everything is working!

---

## 🚨 Troubleshooting

### Problem: "Failed to create account"

**Solution**:
1. Check Supabase project is active (green indicator)
2. Verify schema.sql was run successfully
3. Check browser console (F12) for errors
4. Verify credentials in `/utils/supabase/info.tsx`

### Problem: "Table does not exist"

**Solution**:
1. Go to Supabase SQL Editor
2. Re-run the entire `/supabase/schema.sql` file
3. Verify tables appear in Table Editor

### Problem: "Products not loading"

**Solution**:
1. Check if you're logged in
2. Verify businessId is set correctly
3. Check browser console for errors
4. Check Supabase logs: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/logs

### Problem: "RLS policy violation"

**Solution**:
1. RLS policies are enabled by default
2. Make sure you're logged in with a user that belongs to the business
3. Check Postgres Logs in Supabase Dashboard

### Check Supabase Logs:
https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/logs/postgres-logs

---

## 🎯 STEP 7: Deploy to Production

### Option A: Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "ShelfIQ production ready"
   git branch -M main
   git remote add origin https://github.com/yourusername/shelfiq.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repo
   - Add environment variables:
     ```
     VITE_SUPABASE_URL=https://ownnkpnqnffowxygutql.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bm5rcG5xbmZmb3d4eWd1dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQwNzU4MywiZXhwIjoyMDg0OTgzNTgzfQ.Iz4BWQc3VXHbAnimf9x2NUJJvp-PVDIKzVZEDivf8Ik
     ```
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is LIVE! 🎉

3. **Update Supabase Settings**:
   - Go to: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/auth/url-configuration
   - Add your Vercel URL to:
     - Site URL
     - Redirect URLs

### Option B: Netlify

```bash
# Build
npm run build

# Deploy
npx netlify-cli deploy --prod --dir=dist
```

Add same environment variables in Netlify dashboard.

---

## 🎨 STEP 8: Customize (Optional)

### Change Branding:
1. Update business name in landing page
2. Add your logo
3. Change color scheme in Tailwind config

### Add Custom Domain:
1. Buy domain (namecheap.com, godaddy.com)
2. Configure in Vercel/Netlify
3. Update Supabase URL settings

### Add Analytics:
1. Get Google Analytics ID
2. Add to environment variables
3. Integrate in app

---

## 📊 STEP 9: Monitor

### Supabase Dashboard:
- **Table Editor**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/editor
- **Authentication**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/auth/users
- **Database Logs**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/logs/postgres-logs
- **API Logs**: https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/logs/edge-logs

### Check Usage:
- https://supabase.com/dashboard/project/ownnkpnqnffowxygutql/settings/billing

**Free tier includes**:
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users

This is enough for 500-1000 businesses!

---

## ✅ Success Checklist

**Before going live**:
- [ ] Database schema deployed
- [ ] Can register new business
- [ ] Can login/logout
- [ ] Can add products
- [ ] Can record sales
- [ ] Invoices generate correctly
- [ ] Data persists in Supabase
- [ ] Tested on mobile
- [ ] Deployed to Vercel/Netlify
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)

**After first 10 users**:
- [ ] Gather feedback
- [ ] Fix any bugs
- [ ] Add requested features
- [ ] Set up payment gateway (Razorpay)
- [ ] Configure real GST API
- [ ] Set up email service (SendGrid)

---

## 💰 Next Steps (Optional)

### Add Payment Gateway:
1. Sign up: [razorpay.com](https://razorpay.com)
2. Complete KYC
3. Get API keys
4. I'll help integrate

### Add Real GST API:
1. Sign up: [mastergst.com](https://mastergst.com) or [gstapi.charteredinfo.com](https://gstapi.charteredinfo.com)
2. Get API credentials
3. I'll help integrate

### Add Email Service:
1. Sign up: [sendgrid.com](https://sendgrid.com)
2. Verify sender email
3. Get API key
4. I'll help integrate

---

## 📞 Need Help?

**Just ask me**:
- "Database schema not working"
- "How to add products?"
- "Deploy to Vercel step by step"
- "Add payment gateway"
- "Custom feature request"

**I'm here to help!** 💪

---

## 🎉 YOU'RE READY!

**Your Supabase is configured and ready to go!**

**Next**: Run the database schema in SQL Editor (Step 2 above)

**Then**: Test locally (Step 4 above)

**Finally**: Deploy! (Step 7 above)

**Let me know when you're ready for the next step!** 🚀
