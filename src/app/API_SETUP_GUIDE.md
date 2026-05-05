# 🔑 ShelfIQ - Complete API Setup Guide

## Overview
This document lists **ALL APIs and services** you need to configure for ShelfIQ to work in production. Each section includes what it's used for, where to get credentials, and how to set them up.

---

## 🚨 CRITICAL - REQUIRED APIS (Must Have)

### 1️⃣ **Supabase** (Database + Backend + Authentication)
**Purpose:** Core database, user authentication, real-time data storage, serverless functions

**What you need:**
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Public anonymous key (frontend)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (backend/server)
- `SUPABASE_DB_URL` - PostgreSQL database connection string

**Where to get:**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign up/Login
3. Create a new project
4. Wait for project setup (~2 minutes)
5. Go to **Project Settings** → **API**
6. Copy the credentials:
   - Project URL → `SUPABASE_URL`
   - Project API keys → `anon` `public` → `SUPABASE_ANON_KEY`
   - Project API keys → `service_role` `secret` → `SUPABASE_SERVICE_ROLE_KEY`
7. Go to **Project Settings** → **Database**
   - Copy Connection String (URI) → `SUPABASE_DB_URL`

**Cost:** FREE tier available (up to 500MB database, 2GB bandwidth/month)

**File locations:**
- Frontend: `/utils/supabase/info.tsx`
- Edge Functions: Set as Supabase Secrets

---

## ⚠️ IMPORTANT - HIGHLY RECOMMENDED APIS

### 2️⃣ **GST API** (GSTIN Lookup & Validation)
**Purpose:** Auto-fetch company details from GSTIN, validate GST numbers, generate GST-compliant invoices

**What you need:**
- `GST_API_KEY` - API authentication key
- `GST_API_USERNAME` - Your username
- `GST_API_CLIENT_ID` - Client ID
- `GST_API_CLIENT_SECRET` - Client Secret
- `GST_API_IP_ADDRESS` - Your server IP (whitelist)

**Where to get:**

**Option 1: MasterGST (Recommended)**
1. Go to [mastergst.com](https://mastergst.com)
2. Sign up for API access
3. Choose plan (₹999/month for basic API)
4. Get credentials from Dashboard → API Settings

**Option 2: Chartered Info**
1. Go to [gstapi.charteredinfo.com](https://gstapi.charteredinfo.com)
2. Register for API access
3. Pricing: ₹1,500/month

**Option 3: Government GST Portal (Free but complex)**
1. Go to [gst.gov.in](https://www.gst.gov.in)
2. Register as GSP (GST Suvidha Provider)
3. Apply for API access (requires business documents)

**Currently:** Using MOCK data in demo mode (file: `/utils/gstinLookup.ts`)

**Cost:** 
- Paid: ₹999-2,000/month
- Free: Government portal (requires registration)

**File locations:**
- `/utils/gstinLookup.ts` (line 82-92)
- Set as environment variables

---

### 3️⃣ **Razorpay** (Payment Gateway - Indian)
**Purpose:** Accept subscription payments (₹499 - ₹4,999/month plans), process refunds, handle recurring billing

**What you need:**
- `RAZORPAY_KEY_ID` - Public key (starts with `rzp_test_` or `rzp_live_`)
- `RAZORPAY_KEY_SECRET` - Secret key
- `RAZORPAY_WEBHOOK_SECRET` - Webhook signature key

**Where to get:**
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up and complete KYC
3. Go to **Settings** → **API Keys**
4. Generate Test/Live keys
5. Copy Key ID and Key Secret
6. Go to **Settings** → **Webhooks**
7. Create webhook for payment events
8. Copy Webhook Secret

**Cost:** 
- Setup: FREE
- Transaction fee: 2% per transaction
- No monthly charges

**Integration status:** Ready for integration (currently in mock mode)

---

### 4️⃣ **Stripe** (International Payment Gateway)
**Purpose:** Accept international payments if targeting global customers

**What you need:**
- `STRIPE_PUBLISHABLE_KEY` - Public key (starts with `pk_test_` or `pk_live_`)
- `STRIPE_SECRET_KEY` - Secret key (starts with `sk_test_` or `sk_live_`)
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret

    **Where to get:**
1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Go to **Developers** → **API keys**
4. Copy Publishable key and Secret key
5. Go to **Developers** → **Webhooks**
6. Add endpoint and copy webhook secret

**Cost:** 
- Setup: FREE
- International: 2.9% + ₹2 per transaction
- India: 2.9% + 30¢ per transaction

**Status:** Optional (only if targeting international customers)

---

## 📧 OPTIONAL - COMMUNICATION APIS

### 5️⃣ **SendGrid** (Email Service)
**Purpose:** Send OTP emails, password reset links, subscription confirmations, invoice emails, low stock alerts

**What you need:**
- `SENDGRID_API_KEY` - API key (starts with `SG.`)
- `SENDGRID_FROM_EMAIL` - Verified sender email

**Where to get:**
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up (Free tier: 100 emails/day)
3. Go to **Settings** → **API Keys**
4. Create API Key → Full Access
5. Copy the API key (shown only once!)
6. Go to **Settings** → **Sender Authentication**
7. Verify your email/domain

**Cost:** 
- FREE: 100 emails/day
- Essentials: $14.95/month (40,000 emails)
- Pro: $89.95/month (100,000 emails)

**Current status:** Using mock email (console logs)

---

### 6️⃣ **Twilio** (SMS/OTP Service)
**Purpose:** Send OTP via SMS, low stock SMS alerts, payment confirmations

**What you need:**
- `TWILIO_ACCOUNT_SID` - Account identifier
- `TWILIO_AUTH_TOKEN` - Authentication token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number
- `TWILIO_MESSAGING_SERVICE_SID` - Messaging service ID (optional)

**Where to get:**
1. Go to [twilio.com](https://twilio.com)
2. Sign up (Free trial: $15 credit)
3. Go to Console → Dashboard
4. Copy Account SID and Auth Token
5. Go to **Phone Numbers** → Buy a number
6. Copy your Twilio phone number

**Cost:** 
- FREE trial: $15 credit
- SMS India: $0.0063 per SMS (~₹0.50)
- Monthly phone number: $1/month

**Current status:** Using mock OTP (console logs)

---

### 7️⃣ **AWS SNS** (Alternative to Twilio)
**Purpose:** Send SMS notifications (cheaper for high volume)

**What you need:**
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - Region (e.g., `ap-south-1` for Mumbai)

**Where to get:**
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Create account
3. Go to IAM → Create User → Get credentials
4. Enable SNS service
5. Set spending limit (to avoid overcharges)

**Cost:** 
- India: $0.00465 per SMS (~₹0.35)
- Cheaper than Twilio for bulk

---

## 📊 DATA & ANALYTICS APIS

### 8️⃣ **Kaggle API** (Dataset Import)
**Purpose:** Import real-world retail datasets for testing/demo

**What you need:**
- `KAGGLE_USERNAME` - Your Kaggle username
- `KAGGLE_KEY` - API key

**Where to get:**
1. Go to [kaggle.com](https://kaggle.com)
2. Sign up/Login
3. Go to **Account** → **Settings**
4. Scroll to **API** section
5. Click "Create New API Token"
6. Download `kaggle.json` file
7. Extract username and key from JSON

**Cost:** FREE

**Current status:** Using manual CSV upload (Kaggle templates available)

---

### 9️⃣ **Google Analytics 4** (Website Analytics)
**Purpose:** Track user behavior, page views, conversions

**What you need:**
- `GA4_MEASUREMENT_ID` - Measurement ID (starts with `G-`)
- `GA4_API_SECRET` - API secret (for server-side tracking)

**Where to get:**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create account and property
3. Go to **Admin** → **Data Streams**
4. Click Web → Add stream
5. Copy Measurement ID
6. Go to **Admin** → **Measurement Protocol API secrets**
7. Create secret and copy

**Cost:** FREE (up to 10M events/month)

---

## 🔔 NOTIFICATION & MONITORING

### 🔟 **Slack Webhook** (Team Notifications)
**Purpose:** Send alerts to team channel (new signups, errors, low stock)

**What you need:**
- `SLACK_WEBHOOK_URL` - Webhook URL (starts with `https://hooks.slack.com/...`)

**Where to get:**
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create app → From scratch
3. Go to **Incoming Webhooks**
4. Activate webhooks
5. Add webhook to workspace
6. Select channel
7. Copy webhook URL

**Cost:** FREE

---

### 1️⃣1️⃣ **Sentry** (Error Tracking)
**Purpose:** Monitor crashes, track errors in production

**What you need:**
- `SENTRY_DSN` - Data Source Name (connection string)

**Where to get:**
1. Go to [sentry.io](https://sentry.io)
2. Sign up (Free: 5,000 errors/month)
3. Create project → React
4. Copy DSN from project settings

**Cost:** 
- FREE: 5,000 errors/month
- Team: $26/month

---

## 🚀 DEPLOYMENT & HOSTING

### 1️⃣2️⃣ **Vercel/Netlify** (Frontend Hosting)
**Purpose:** Deploy React frontend

**What you need:**
- GitHub repository connected
- Environment variables set in dashboard

**Where to get:**
- [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com)
- Sign up with GitHub
- Import repository
- Set environment variables in dashboard

**Cost:** FREE for hobby projects

---

## 📱 MOBILE APP (Android)

### 1️⃣3️⃣ **Firebase** (Android Backend)
**Purpose:** Push notifications, analytics for Android app

**What you need:**
- `google-services.json` - Firebase config file
- `FIREBASE_SERVER_KEY` - Server key for push notifications

**Where to get:**
1. Go to [firebase.google.com](https://firebase.google.com)
2. Create project
3. Add Android app
4. Download `google-services.json`
5. Go to **Project Settings** → **Cloud Messaging**
6. Copy Server Key

**Cost:** FREE (Spark plan)

---

## 🔐 ENVIRONMENT VARIABLE SETUP

### Frontend Configuration

**File:** `/utils/supabase/info.tsx`
```typescript
export const projectId = 'YOUR_SUPABASE_PROJECT_ID';
export const publicAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

### Backend/Edge Function Configuration

**Set via Supabase CLI:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_ID

# Set secrets
supabase secrets set SUPABASE_URL=https://xxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=xxx
supabase secrets set GST_API_KEY=xxx
supabase secrets set GST_API_USERNAME=xxx
supabase secrets set RAZORPAY_KEY_ID=xxx
supabase secrets set RAZORPAY_KEY_SECRET=xxx
supabase secrets set SENDGRID_API_KEY=xxx
supabase secrets set TWILIO_ACCOUNT_SID=xxx
supabase secrets set TWILIO_AUTH_TOKEN=xxx
supabase secrets set SLACK_WEBHOOK_URL=xxx
```

**Or via Supabase Dashboard:**
1. Go to Project Settings → Edge Functions
2. Click "Secrets"
3. Add key-value pairs

---

## 📝 CHECKLIST - WHAT TO PROVIDE

### ✅ MINIMUM TO START (Required)
- [ ] Supabase URL
- [ ] Supabase Anon Key  
- [ ] Supabase Service Role Key
- [ ] Supabase DB URL

### ⚡ FOR PRODUCTION (Highly Recommended)
- [ ] GST API Key + Username + Client ID
- [ ] Razorpay Key ID + Secret (for Indian payments)
- [ ] SendGrid API Key + Verified Email
- [ ] Twilio Account SID + Auth Token + Phone Number

### 🎯 FOR FULL FEATURES (Optional)
- [ ] Stripe Keys (international payments)
- [ ] Kaggle API credentials
- [ ] Google Analytics 4 Measurement ID
- [ ] Slack Webhook URL
- [ ] Sentry DSN
- [ ] Firebase config (for Android app)

---

## 💰 ESTIMATED MONTHLY COST

### Startup (100 users)
- Supabase: **FREE**
- Razorpay: **2% per transaction** (₹0 base fee)
- SendGrid: **FREE** (100 emails/day)
- Twilio: **~₹500/month** (1000 SMS)
- GST API: **₹999/month**
- **Total: ~₹1,500-2,000/month**

### Growth (1,000 users)
- Supabase: **$25/month**
- Razorpay: **2% per transaction**
- SendGrid: **$15/month** (40K emails)
- Twilio: **~₹5,000/month** (10K SMS)
- GST API: **₹999/month**
- Google Analytics: **FREE**
- **Total: ~₹10,000-12,000/month**

### Scale (10,000+ users)
- Supabase: **$100-250/month**
- Razorpay: **2% per transaction** (negotiate for lower rates)
- SendGrid: **$90/month** (100K emails)
- AWS SNS: **~₹30,000/month** (100K SMS)
- GST API: **₹999/month** (or enterprise plan)
- **Total: ~₹50,000-80,000/month**

---

## 🎓 HOW TO PROVIDE CREDENTIALS TO ME

### Method 1: Paste in Chat (Secure)
```
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GST_API_KEY=your_key_here
GST_API_USERNAME=your_username
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
SENDGRID_API_KEY=SG.xxxxx
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_token
```

### Method 2: Provide Service by Service
Just tell me which services you've signed up for and paste the credentials one by one.

---

## 🚀 PRIORITY ORDER

### Phase 1 (THIS WEEK)
1. **Supabase** - Set up database and authentication
2. **GST API** - Enable GSTIN lookup OR keep using mock data

### Phase 2 (BEFORE LAUNCH)
1. **Razorpay** - Set up payment gateway for subscriptions
2. **SendGrid** - Set up email for OTP and notifications

### Phase 3 (POST-LAUNCH)
1. **Twilio/AWS SNS** - Add SMS notifications
2. **Google Analytics** - Track user behavior
3. **Sentry** - Monitor errors

---

## 📞 SUPPORT LINKS

| Service | Documentation | Support |
|---------|--------------|---------|
| Supabase | [docs.supabase.com](https://docs.supabase.com) | Discord, Email |
| Razorpay | [razorpay.com/docs](https://razorpay.com/docs) | Email, Phone |
| SendGrid | [docs.sendgrid.com](https://docs.sendgrid.com) | Email, Chat |
| Twilio | [twilio.com/docs](https://twilio.com/docs) | Email, Phone |
| MasterGST | [mastergst.com/api](https://mastergst.com/api) | Email, Phone |

---

## ⚠️ IMPORTANT NOTES

1. **NEVER commit API keys to GitHub** - Use environment variables
2. **Use TEST keys first** - Before going live with payments
3. **Set spending limits** - On AWS, Twilio to avoid overcharges
4. **Keep Service Role Key secret** - Only use on server-side
5. **Rotate keys regularly** - Every 3-6 months for security

---

## 📬 NEXT STEPS

**Reply with:**
1. Which services you want to set up NOW
2. I'll guide you step-by-step for each service
3. Or paste all credentials and I'll integrate them immediately

**Example:**
```
I want to start with:
1. Supabase (PRIORITY)
2. Razorpay (for payments)
3. Keep GST API as mock for now

Here are my credentials:
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

I'm ready to integrate as soon as you provide the credentials! 🚀
