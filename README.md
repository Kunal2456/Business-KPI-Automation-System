<div align="center">

<img src="https://img.shields.io/badge/ShelfIQ-Smart%20Inventory%20Intelligence-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0zIDNoMTh2MkgzVjN6bTAgNGgxOHYySDF6bTAgNGgxOHYySDF6bTAgNGgxMnYySDF6Ii8+PC9zdmc+" alt="ShelfIQ Banner"/>

# ShelfIQ — Smart Inventory Intelligence Platform

**A production-ready SaaS platform for store owners to get complete business insights, automate KPI reporting, and manage inventory with real-time data.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![React Router](https://img.shields.io/badge/React%20Router-v7-CA4245?style=flat-square&logo=reactrouter)](https://reactrouter.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-FF6384?style=flat-square)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Subscription Plans](#-subscription-plans)
- [Multi-Language Support](#-multi-language-support)
- [GST & Invoice System](#-gst--invoice-system)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

---

## 🚀 Overview

ShelfIQ is a **full-stack SaaS Business KPI Automation & Reporting System** built for retail store owners. It transforms raw store data into actionable intelligence — tracking inventory, sales, vendors, and financials — all in one unified dashboard.

> Built as a **college major project** demonstrating enterprise-grade SaaS architecture, real-time database integration, multi-language support, GST compliance, and subscription-based access control.

---

## ✨ Features

### 🏪 Store Management
- Multi-store registration with branch-level tracking
- Business onboarding wizard (name, address, GSTIN, store type)
- Real data persistence via Supabase — no demo/mock data

### 📊 Business Intelligence Dashboard
- Real-time KPI cards (Revenue, Orders, Stock, Profit)
- Interactive charts — Line, Bar, Pie, Area (powered by Recharts)
- Sales trends, category breakdown, and inventory heatmaps

### 📦 Inventory Management
- Product catalog with stock tracking
- Low-stock alerts and reorder suggestions
- Excel/CSV import & export (via xlsx)
- Drag-and-drop product ordering (react-dnd)

### 🤝 Vendor Management
- Vendor directory with contact details
- Purchase order tracking
- Vendor performance analytics

### 🧾 GST Invoice System
- Auto-fetch business details via GSTIN
- Generate professional GST-compliant invoices
- Multi-store invoice management
- PDF-ready invoice templates

### 👤 Authentication & Security
- OTP-based verification
- Supabase Auth integration
- Role-based access control
- 14-day free trial with subscription gating

### 🌍 Multi-Language Support
- English, Italian, Hindi
- Globe icon language switcher
- i18next + react-i18next integration

### 💳 Subscription System (4-Tier)
| Plan | Price | Features |
|------|-------|----------|
| **Free Trial** | ₹0 / 14 days | Core dashboard, 1 store |
| **Starter** | ₹499/mo | 3 stores, basic reports |
| **Professional** | ₹1499/mo | 10 stores, GST invoicing, vendor mgmt |
| **Enterprise** | Custom | Unlimited stores, API access, priority support |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS v4, Framer Motion, Motion |
| **UI Components** | Radix UI, MUI, shadcn-style components |
| **Routing** | React Router v7 |
| **State & Forms** | React Hook Form v7, i18next |
| **Charts** | Recharts 2.x |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Server** | Hono.js (Deno runtime) |
| **Auth** | Supabase Auth + OTP |
| **Storage** | Supabase Storage |
| **File Handling** | xlsx (Excel/CSV import-export) |
| **Icons** | Lucide React |
| **Package Manager** | pnpm |

---

## 🖥 Screenshots

> Dashboard · Inventory · Vendors · GST Invoices · Landing Page

*(Add screenshots here after deployment)*

---

## ⚡ Getting Started

### Prerequisites

- Node.js `v18+`
- pnpm `v8+`
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/Kunal2456/Business-KPI-Automation-System.git
cd Business-KPI-Automation-System

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase credentials in .env

# Start the development server
pnpm dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
ShelfIQ/
├── src/
│   ├── app/
│   │   ├── App.tsx                  # Root component & routing
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Dashboard/           # KPI cards, charts
│   │   │   ├── Inventory/           # Product management
│   │   │   ├── Vendors/             # Vendor directory
│   │   │   ├── GST/                 # Invoice system
│   │   │   ├── Auth/                # Login, OTP, onboarding
│   │   │   └── Landing/             # Animated landing page
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── i18n/                    # Translation files (EN, IT, HI)
│   │   ├── types/                   # TypeScript type definitions
│   │   └── utils/                   # Helper functions
│   └── styles/
│       ├── theme.css                # Design tokens & CSS variables
│       └── fonts.css                # Font imports
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx            # Hono web server (API routes)
│           └── kv_store.tsx         # Key-value store utilities
├── public/                          # Static assets
├── .env.example                     # Environment variable template
├── package.json
└── README.md
```

---

## 🌍 Multi-Language Support

ShelfIQ supports 3 languages out of the box:

| Language | Code | Status |
|----------|------|--------|
| 🇬🇧 English | `en` | ✅ Complete |
| 🇮🇹 Italian | `it` | ✅ Complete |
| 🇮🇳 Hindi | `hi` | ✅ Complete |

Switch languages using the **🌐 globe icon** in the navigation bar. Language preference is persisted across sessions.

---

## 🧾 GST & Invoice System

- Auto-fetch business details using **GSTIN** (GST Identification Number)
- Generates invoices compliant with **Indian GST regulations**
- Supports **CGST, SGST, IGST** tax breakdowns
- Multi-store invoice history with search and filter
- Export to PDF-ready format

---

## 🗄 Database Schema

ShelfIQ uses **Supabase PostgreSQL** with the following core tables:

```sql
stores          -- Business/store registration
products        -- Inventory catalog
vendors         -- Vendor directory
orders          -- Sales & purchase orders
invoices        -- GST invoices
kv_store        -- Flexible key-value persistence
```

> All data is real — no mock/demo data in production mode.

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side service key | ✅ (backend) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Kunal**
- GitHub: [@Kunal2456](https://github.com/Kunal2456)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for smart retail management**

*ShelfIQ — Know your shelf, grow your business.*

</div>
