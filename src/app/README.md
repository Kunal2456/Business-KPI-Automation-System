# Business KPI Automation & Reporting System v2.0

A comprehensive web-based analytics system for retail businesses that automates KPI tracking, monitors inventory, generates real-time dashboards, and produces automated business reports with **multi-store support**, **intelligent alerts**, and **dark mode**.

## 🎯 Project Overview

This system eliminates manual reporting and provides live insights for retail business owners, managers, and analysts. Built with React and TypeScript, it offers a complete solution for tracking sales, inventory, and profitability metrics with full data import/export capabilities, **store-wise filtering**, and **modern authentication**.

## ✨ Key Features

### 🔐 Authentication System (NEW!)
- **Sign In** - Secure login with email and password
- **Sign Up** - Create new accounts with role-based access
- **Forgot Password** - Password reset functionality
- **Role-Based Access** - Admin, Manager, and Analyst roles
- **Store Assignment** - Managers assigned to specific stores
- **Beautiful UI** - Modern gradient design with branding

### 🌙 Dark Mode / Light Mode (NEW!)
- **Theme Toggle** - Switch between dark and light themes
- **Persistent** - Saves preference to localStorage
- **System-wide** - Applied across all components
- **Eye-Friendly** - Optimized colors for both themes
- **Mobile & Desktop** - Works on all screen sizes

### 🏪 Multi-Store Management (NEW!)
- **Store Filtering** - Filter data by Store A, B, C, or All Stores
- **Manager Assignment** - Each manager assigned to specific store
- **Admin View** - Admins can view all stores
- **Store-wise Reports** - Sales and inventory by location
- **Dashboard Filtering** - Real-time data updates by store

### 🔔 Intelligent Alerts System (NEW!)
- **Low Stock Alerts** - When stock ≤ reorder level (🔴)
- **Dead Stock Alerts** - No sales in 30 days (⚠️)
- **Restock Due Alerts** - Restock scheduled within 3 days (📅)
- **Alert Bell Badge** - Unread count indicator
- **Mark as Read** - Individual alert dismissal
- **Color Coded** - Visual priority indicators

### 📅 Restock Date Calendar (NEW!)
- **Date Picker** - HTML5 calendar for restock planning
- **Visual Indicators** - Blue badges on product cards
- **Auto Alerts** - Triggers alert 3 days before
- **Last Restocked** - Tracks previous restock date
- **Optional Field** - Not required for all products

### 🚪 Logout Functionality (FIXED!)
- **Proper State Reset** - Clears all user data
- **Desktop & Mobile** - Works on all devices
- **Visual Feedback** - Smooth transitions
- **Session Management** - Clean logout flow

### 🚀 Setup Wizard
- **First-Time Setup** - Interactive 3-step wizard for new users
- **Business Configuration** - Set up business name and details
- **Initial Product Entry** - Add your first products through a simple table interface
- **Skip Option** - Option to skip and use demo data for testing

### 📤 Data Import/Export
- **CSV Import** - Upload products and sales from CSV files
- **Template Download** - Get pre-formatted CSV templates
- **Bulk Upload** - Import hundreds of products/sales at once
- **Data Validation** - Automatic validation of imported data
- **Clear All Data** - Fresh start option with confirmation
- **Current Stats Display** - See product and sales count before import

### 📊 Real-Time Dashboard
- Live KPI visualization with interactive charts
- Revenue growth tracking vs previous periods
- Sales trends with area charts
- Category performance with pie charts
- Monthly sales and profit comparisons
- Inventory alerts and stock monitoring

### 💰 Sales KPIs
- **Total Sales** - Daily/Monthly/Yearly tracking
- **Revenue Growth %** - Period-over-period comparison
- **Average Order Value (AOV)** - Per transaction metrics
- **Sales by Product** - Top performing products
- **Sales by Category** - Category-wise breakdown
- **Sales by Store Location** - Multi-location tracking

### 📦 Inventory KPIs
- **Stock in Hand** - Current inventory levels
- **Dead Stock** - Items not sold in 30 days
- **Fast vs Slow Moving Items** - Movement analysis
- **Inventory Turnover Ratio** - Efficiency metrics
- **Reorder Level Alerts** - Automated low stock warnings
- **Stock Value** - Total inventory valuation

### 💵 Profitability KPIs
- **Gross Profit** - Revenue minus cost of goods sold
- **Net Profit** - After operating costs (estimated)
- **Profit Margin %** - Percentage profitability
- **Profit by Product** - Product-level profit analysis
- **Cost vs Selling Price** - Margin analysis

### 🔐 Role-Based Access Control
- **Admin** - Full system access, all KPIs, reports, product management
- **Manager** - Dashboard, sales management, inventory monitoring
- **Data Analyst** - Dashboard access, report generation, analytics

### 📈 Sales Management
- Record new sales transactions
- Track discounts and promotions
- Multi-store location support
- Automatic stock deduction
- Search and filter capabilities
- Export sales data to CSV

### 🏪 Product & Inventory Management
- Add/edit products with pricing
- Category management
- Real-time stock updates
- Low stock alerts
- Dead stock identification
- Quick stock adjustment buttons
- Cost and selling price tracking

### 📑 Automated Reports
- **Sales Report** - Detailed transaction history
- **Inventory Report** - Stock levels and valuations
- **KPI Summary Report** - Complete metrics overview
- **Product Performance Report** - Top performers by profit
- Customizable date ranges (Daily/Weekly/Monthly/Custom)
- CSV export for all reports
- Category and product performance tables

## 🚀 Technology Stack

- **Frontend:** React 18 with TypeScript
- **Charts:** Recharts for data visualization
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Storage:** LocalStorage for data persistence
- **State Management:** React Hooks

## 📦 Getting Started

### Demo Credentials

**Admin Access (All Stores):**
- Email: admin@retail.com
- Password: admin123

**Manager Access (Store A):**
- Email: manager@retail.com
- Password: manager123

**Manager Access (Store B):**
- Email: managerb@retail.com
- Password: manager123

**Manager Access (Store C):**
- Email: managerc@retail.com
- Password: manager123

**Analyst Access:**
- Email: analyst@retail.com
- Password: analyst123

### Quick Login
Use the demo credentials shown on the sign-in page for instant access with different roles and store assignments.

## 💡 How to Use

### 1. Dashboard
- Select time range (7 days, 30 days, or All time)
- View KPI cards at the top showing key metrics
- Explore charts for trends and patterns
- Monitor low stock alerts
- Check fast-moving items

### 2. Sales Management
- Click "Add Sale" to record a new transaction
- Select product, quantity, and discount
- Choose store location
- System automatically updates inventory
- Use search and filters to find specific sales
- Export data using the "Export" button

### 3. Product & Inventory Management
- Click "Add Product" to create new items
- Enter product details, cost price, and selling price
- Set reorder levels for automatic alerts
- Use +10, +50 buttons for quick stock updates
- Edit products using the edit icon
- Monitor low stock warnings (orange highlighted)

### 4. Reports
- Select report period (Daily/Weekly/Monthly/Custom)
- View KPI summary cards
- Export any report as CSV file
- Analyze category performance
- Review top 10 products by profit

## 🎨 Features Breakdown

### Automatic KPI Calculations
The system automatically calculates:
- Total sales and revenue growth
- Gross and net profit margins
- Inventory turnover ratios
- Average order values
- Product and category performance
- Stock movement analysis

### Real-Time Updates
- Dashboard refreshes automatically with new data
- Stock levels update after each sale
- KPIs recalculate based on selected time range
- Alerts appear for low stock items

### Data Export
- All sales data exportable to CSV
- Inventory reports with current valuations
- KPI summaries for business reviews
- Product performance rankings

### Responsive Design
- Works on desktop, tablet, and mobile
- Mobile-friendly navigation menu
- Touch-optimized controls
- Adaptive layouts

## 📊 Sample Data

The system comes pre-loaded with:
- 15 products across 7 categories
- 30 days of sales history
- Multiple store locations
- Various product categories (Groceries, Beverages, Dairy, etc.)

## 🔄 Data Persistence

All data is automatically saved to browser localStorage:
- Products and inventory levels
- Sales transactions
- User sessions

Data persists across browser sessions and page refreshes.

## 🎯 Use Cases

### Retail Stores
- Supermarkets
- Convenience stores
- FMCG distributors
- Franchise operations

### Key Problems Solved
- ✅ Eliminates manual Excel reporting
- ✅ Provides real-time business insights
- ✅ Prevents stockouts with alerts
- ✅ Identifies slow-moving inventory
- ✅ Tracks profitability by product
- ✅ Supports data-driven decisions
- ✅ Reduces human error in calculations

## 💼 Career & Portfolio Value

This project demonstrates:
- **Business Intelligence** - KPI tracking and analytics
- **Data Analysis** - Sales and inventory metrics
- **Dashboard Development** - Interactive visualizations
- **React/TypeScript** - Modern web development
- **Problem Solving** - Real-world retail challenges
- **UI/UX Design** - User-friendly interfaces

Perfect for roles:
- Data Analyst
- Business Intelligence Analyst
- Business Analyst
- Operations Analyst
- Frontend Developer

## 📝 Project Presentation

**Title:** Business KPI Automation & Reporting System for Retail Sales

**Description:** Developed a web-based analytics system to automate retail KPIs, monitor inventory, generate real-time dashboards, and produce automated business reports. Implemented role-based access control, real-time data visualization, and automated report generation reducing manual reporting time by 90%.

**Technical Highlights:**
- Built with React & TypeScript for type-safe development
- Integrated Recharts for interactive data visualization
- Implemented automatic KPI calculation engine
- Created role-based authentication system
- Designed responsive UI with Tailwind CSS
- Developed CSV export functionality for reports

## 🚀 Future Enhancements

Potential additions:
- Backend API integration
- Database persistence (PostgreSQL/MySQL)
- Email report automation
- Customer analytics (CLV, repeat customers)
- Forecasting and predictions
- Multi-language support
- Advanced filtering and search
- Barcode scanning for sales
- Invoice generation
- Tax calculations

## 📄 License

This is a demo project for educational and portfolio purposes.

---

**Built with ❤️ for retail businesses seeking automation and insights**