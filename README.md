<div align="center">

<!-- Animated Banner Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=ShelfIQ&fontSize=80&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Smart%20Inventory%20Intelligence%20Platform&descAlignY=60&descSize=20" width="100%"/>

<!-- Typing Animation -->
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&multiline=true&width=700&height=80&lines=Business+KPI+Automation+%26+Reporting+System;Real-time+Inventory+%7C+GST+Invoicing+%7C+Multi-Store;Built+with+React+%2B+TypeScript+%2B+Supabase" alt="Typing SVG" />

<br/>

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![React Router](https://img.shields.io/badge/React%20Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Subscription Plans](#-subscription-plans)
- [Multi-Language Support](#-multi-language-support)
- [GST & Invoice System](#-gst--invoice-system)
- [Environment Variables](#-environment-variables)
- [GitHub Stats](#-github-stats)
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

---

## 💳 Subscription Plans

<div align="center">

| Plan | Price | Stores | Features |
|------|-------|--------|----------|
| 🆓 **Free Trial** | ₹0 / 14 days | 1 | Core dashboard, basic reports |
| 🚀 **Starter** | ₹499/mo | 3 | Basic reports, inventory |
| 💼 **Professional** | ₹1499/mo | 10 | GST invoicing, vendor mgmt |
| 🏢 **Enterprise** | Custom | Unlimited | API access, priority support |

</div>

---

## 🛠 Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **UI Components** | Radix UI, MUI, Lucide Icons |
| **Routing** | React Router v7 |
| **Forms & i18n** | React Hook Form v7, i18next |
| **Charts** | Recharts 2.x |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Server** | Hono.js on Deno runtime |
| **Auth** | Supabase Auth + OTP |
| **File Handling** | xlsx (Excel/CSV import-export) |
| **Package Manager** | pnpm |

</div>

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
│   │   ├── i18n/                    # Translations (EN, IT, HI)
│   │   ├── types/                   # TypeScript type definitions
│   │   └── utils/                   # Helper functions
│   └── styles/
│       ├── theme.css                # Design tokens & CSS variables
│       └── fonts.css                # Font imports
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx            # Hono API server
│           └── kv_store.tsx         # Key-value store utilities
├── .env.example
├── package.json
└── README.md
```

---

## 🌍 Multi-Language Support

<div align="center">

| Language | Code | Status |
|----------|------|--------|
| 🇬🇧 English | `en` | ✅ Complete |
| 🇮🇹 Italian | `it` | ✅ Complete |
| 🇮🇳 Hindi | `hi` | ✅ Complete |

</div>

Switch languages using the **🌐 globe icon** in the navigation bar.

---

## 🧾 GST & Invoice System

- Auto-fetch business details using **GSTIN**
- GST-compliant invoices with **CGST, SGST, IGST** breakdowns
- Multi-store invoice history with search and filter
- PDF-ready invoice templates

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side service key | ✅ (backend) |

---

## 📊 GitHub Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=Kunal2456&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0D1117&title_color=6366f1&icon_color=6366f1&text_color=ffffff" height="165" alt="GitHub Stats"/>
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Kunal2456&layout=compact&theme=tokyonight&hide_border=true&bg_color=0D1117&title_color=6366f1&text_color=ffffff" height="165" alt="Top Languages"/>

<br/>

<img src="https://github-readme-streak-stats.herokuapp.com?user=Kunal2456&theme=tokyonight&hide_border=true&background=0D1117&stroke=6366f1&ring=6366f1&fire=f59e0b&currStreakLabel=6366f1" alt="GitHub Streak"/>

</div>

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

<div align="center">

**Kunal**

[![GitHub](https://img.shields.io/badge/GitHub-Kunal2456-181717?style=for-the-badge&logo=github)](https://github.com/Kunal2456)

</div>

---

<!-- Animated Footer -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer&animation=twinkling" width="100%"/>

<div align="center">

*ShelfIQ — Know your shelf, grow your business.* 🚀

</div>
