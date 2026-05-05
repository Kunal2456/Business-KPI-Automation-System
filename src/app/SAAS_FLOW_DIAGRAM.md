# 📊 SAAS USER FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    VISITOR LANDS ON APP                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  EnhancedAuthPage       │
              │  (Login Screen)         │
              │                         │
              │  • Email/Password       │
              │  • Demo Accounts        │
              │  • "Create Account" CTA │
              │  • "View Plans" Link    │
              └─────────┬───────┬───────┘
                        │       │
           ┌────────────┘       └────────────┐
           │                                  │
           ▼                                  ▼
┌──────────────────────┐          ┌──────────────────────┐
│  Click "View Plans"  │          │ Click "Create Account"│
└──────────┬───────────┘          └──────────┬───────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────┐          ┌──────────────────────┐
│ SubscriptionPlans    │          │   SignupWizard       │
│                      │          │                      │
│ • Free Trial (₹0)    │          │ Step 1: Account      │
│ • Starter (₹999)     │          │ • Name, Email, Pass  │
│ • Professional       │          │                      │
│   (₹2,999)           │          │ Step 2: Business     │
│ • Enterprise         │          │ • Business name      │
│   (Custom)           │          │ • Industry, Phone    │
│                      │          │                      │
│ [Select Plan] ──────────────────│ Step 3: Store        │
│                      │          │ • Store name         │
└──────────────────────┘          │ • Location           │
                                  │                      │
                                  │ Step 4: Review       │
                                  │ • Summary            │
                                  │ • Terms acceptance   │
                                  │                      │
                                  │ [Create Account] ────┤
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │ Account Created!     │
                                  │                      │
                                  │ • User saved         │
                                  │ • Organization ID    │
                                  │ • 14-day trial       │
                                  │ • Auto-login         │
                                  │                      │
                                  │ Toast: "Welcome! 🎉" │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                    ┌────────────────────────────────────────────┐
                    │            MAIN DASHBOARD                   │
                    │                                            │
                    │  Sidebar Shows:                            │
                    │  • Current Plan Badge                      │
                    │  • Trial Days Remaining                    │
                    │  • Usage Stats (Products: 0/50)            │
                    │  • [Upgrade Plan] Button                   │
                    └────────────┬───────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐
          │ Add Products    │       │ Record Sales    │
          └────────┬────────┘       └────────┬────────┘
                   │                         │
                   │ Check Limits            │ Check Limits
                   │                         │
                   ▼                         ▼
          ┌─────────────────────────────────────────┐
          │  subscriptionLimits.ts                  │
          │                                         │
          │  canAddProduct(count, plan)             │
          │  canAddSale(count, plan)                │
          │  hasFeature(plan, 'feature')            │
          └────────┬────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
┌──────────────┐      ┌──────────────┐
│ ALLOWED      │      │ LIMIT REACHED│
│ ✓ Continue   │      │ ✗ Show Error │
└──────────────┘      └──────┬───────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  UpgradePrompt  │
                    │                 │
                    │  • Feature name │
                    │  • Benefits     │
                    │  • Recommended  │
                    │    plan         │
                    │                 │
                    │  [Upgrade Now]  │
                    │  [Maybe Later]  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │SubscriptionPlans│
                    │                 │
                    │ Select Plan     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Payment Gateway │
                    │ (Razorpay/      │
                    │  Stripe)        │
                    │                 │
                    │ [To be added]   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Payment Success │
                    │                 │
                    │ • Update plan   │
                    │ • Send receipt  │
                    │ • Unlock        │
                    │   features      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Dashboard      │
                    │  (Updated)      │
                    │                 │
                    │  Badge: "Pro"   │
                    │  All features   │
                    │  unlocked ✓     │
                    └─────────────────┘
```

## 🔄 Limit Check Flow Detail

```
User Action: "Add Product"
         │
         ▼
┌──────────────────────────────────────────┐
│ handleAddProduct() in App.tsx            │
│                                          │
│ const plan = currentUser.subscriptionPlan│
│ const { allowed, limit, remaining } =    │
│   canAddProduct(products.length, plan)   │
└───────────────┬──────────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
    ▼                       ▼
┌─────────┐         ┌──────────────┐
│ allowed │         │ !allowed     │
│ = true  │         │ = false      │
└────┬────┘         └──────┬───────┘
     │                     │
     ▼                     ▼
┌─────────────┐    ┌────────────────────────┐
│ Add Product │    │ toast.error(           │
│ Show Toast  │    │   "Limit reached",     │
│ "Added!"    │    │   action: {            │
└─────────────┘    │     label: "Upgrade",  │
                   │     onClick: showPlans │
                   │   }                    │
                   │ )                      │
                   └────────────────────────┘
```

## 📊 Data Flow Diagram

```
┌────────────┐
│  Browser   │
│ localStorage│
└─────┬──────┘
      │
      │ Load on mount
      ▼
┌──────────────────────────────────┐
│  App.tsx State                   │
│                                  │
│  • currentUser {                 │
│      subscriptionPlan: 'free'    │
│      trialEndsAt: Date           │
│    }                             │
│  • products: []                  │
│  • sales: []                     │
│  • organizationId: string        │
└──────────┬───────────────────────┘
           │
           │ Pass down
           ▼
┌────────────────────────────────────┐
│  Components                        │
│                                    │
│  • Dashboard                       │
│  • ProductManagement               │
│  • SalesManagement                 │
│  • UserManagement                  │
└──────────┬─────────────────────────┘
           │
           │ Call limit checks
           ▼
┌────────────────────────────────────┐
│  subscriptionLimits.ts             │
│                                    │
│  • SUBSCRIPTION_LIMITS object      │
│  • canAdd* functions               │
│  • hasFeature()                    │
└──────────┬─────────────────────────┘
           │
           │ Return { allowed, limit }
           ▼
┌────────────────────────────────────┐
│  Component Decision                │
│                                    │
│  if (allowed) {                    │
│    performAction()                 │
│  } else {                          │
│    showUpgradePrompt()             │
│  }                                 │
└────────────────────────────────────┘
```

## 🎯 Component Hierarchy

```
App.tsx
│
├─── EnhancedAuthPage
│    ├─── Login Form
│    ├─── Demo Account Buttons
│    └─── CTAs (Signup, Plans)
│
├─── SignupWizard
│    ├─── Step 1: Account Info
│    ├─── Step 2: Business Info
│    ├─── Step 3: Store Setup
│    └─── Step 4: Review
│
├─── SubscriptionPlans
│    ├─── Free Trial Card
│    ├─── Starter Card
│    ├─── Professional Card
│    └─── Enterprise Card
│
├─── Main Dashboard
│    ├─── Sidebar
│    │    ├─── User Profile
│    │    ├─── Plan Badge
│    │    ├─── Usage Stats
│    │    └─── Upgrade Button
│    │
│    ├─── Dashboard (KPIs)
│    ├─── ProductManagement
│    │    └─── canAddProduct check
│    ├─── SalesManagement
│    │    └─── canAddSale check
│    └─── UserManagement
│         └─── canAddUser check
│
└─── UpgradePrompt (Modal)
     ├─── Feature Description
     ├─── Benefits List
     ├─── Pricing
     └─── Action Buttons
```

## 🔐 Authentication Flow

```
┌─────────────┐
│ New Visitor │
└──────┬──────┘
       │
       ▼
┌────────────────┐      No User      ┌──────────────┐
│ Check          │─────────────────→ │ Show Auth    │
│ localStorage   │                   │ Page         │
│ for user       │                   └──────────────┘
└────────┬───────┘
         │
         │ Has User
         ▼
┌─────────────────┐
│ Load User Data  │
│ • Products      │
│ • Sales         │
│ • Business Info │
└────────┬────────┘
         │
         ▼
┌──────────────────┐      Trial Expired    ┌─────────────┐
│ Check Trial      │──────────────────────→ │ Show        │
│ Status           │                        │ Expired     │
└────────┬─────────┘                        │ Message     │
         │                                  └─────────────┘
         │ Active
         ▼
┌──────────────────┐
│ Show Dashboard   │
│ with Limits      │
└──────────────────┘
```

## 💳 Future Payment Flow

```
User Clicks "Upgrade"
         │
         ▼
┌──────────────────┐
│ Select Plan      │
│ (Subscription    │
│  Plans page)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Payment Gateway  │
│ (Razorpay)       │
│                  │
│ • Enter card     │
│ • Confirm        │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────┐
│Success │ │Failed│
└───┬────┘ └──┬───┘
    │         │
    │         ▼
    │    ┌────────────┐
    │    │ Show Error │
    │    │ Retry      │
    │    └────────────┘
    │
    ▼
┌────────────────────┐
│ Webhook Handler    │
│ (Backend)          │
│                    │
│ • Verify payment   │
│ • Update DB        │
│ • Send receipt     │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Update Frontend    │
│                    │
│ • New plan active  │
│ • Features unlocked│
│ • Show toast       │
└────────────────────┘
```

## 📈 Growth Path

```
Free Trial (14 days)
    │
    │ Using basic features
    │ Learning the system
    │
    ▼
Hit Limit or Trial Expires
    │
    ├─── 50th Product
    ├─── 100th Sale
    └─── Day 14
    │
    ▼
Upgrade Prompt Shown
    │
    ├─── "Maybe Later" → Continue limited
    │
    └─── "Upgrade Now"
         │
         ▼
    Choose Plan
         │
    ┌────┴────┬────────┐
    │         │        │
    ▼         ▼        ▼
 Starter  Professional Enterprise
 ₹999/mo  ₹2,999/mo   Custom
    │         │        │
    └────┬────┴────┬───┘
         │         │
         ▼         ▼
    Payment   Contact Sales
         │
         ▼
    Active Paid User
         │
         ▼
    Unlock All Features
```

## 🎯 Key Success Metrics

```
Conversion Funnel:

100 Visitors
    │
    ▼
30 Signups (30%)
    │
    ▼
25 Activated (25%)
    │  (Added 1+ product)
    ▼
15 Engaged (15%)
    │  (Used 5+ times)
    ▼
5 Paid (5%)
    │  (Upgraded)
    ▼
4 Retained (4%)
    │  (3+ months)
    ▼
Revenue: ₹20,000/mo
```

---

**This diagram shows the complete user journey from landing to paid customer! 🚀**
