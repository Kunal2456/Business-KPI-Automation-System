import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sale, Product, KPIMetrics, User } from '../types';
import { calculateKPIs, formatCurrency, formatPercentage, formatNumber } from '../utils/kpiCalculations';
import { mockProcurementMetrics } from '../mockVendorData';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  IndianRupee,
  BarChart3,
  PieChart as PieChartIcon,
  Truck,
  FileText,
  Clock,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DashboardProps {
  sales: Sale[];
  products: Product[];
  user: User;
  selectedStore: string;
  darkMode: boolean;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4'];

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const chartVariant = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function Dashboard({ sales, products, user, selectedStore, darkMode }: DashboardProps) {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'all'>('30days');

  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    
    if (timeRange === '7days') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === '30days') {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate.setDate(startDate.getDate() - 365);
    }
    
    return { startDate, endDate };
  }, [timeRange]);

  const kpis: KPIMetrics = useMemo(() => {
    return calculateKPIs(sales, products, dateRange);
  }, [sales, products, dateRange]);

  // Daily sales trend data
  const dailySalesData = useMemo(() => {
    const salesByDate = new Map<string, number>();

    sales.forEach(sale => {
      const date = new Date(sale.saleDate);
      if (date >= dateRange.startDate && date <= dateRange.endDate) {
        const dateKey = date.toISOString().split('T')[0];
        salesByDate.set(dateKey, (salesByDate.get(dateKey) || 0) + sale.totalAmount);
      }
    });

    const result = Array.from(salesByDate.entries())
      .map(([date, amount]) => ({
        date,
        amount
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    return result.length > 0 ? result : [{ date: new Date().toISOString().split('T')[0], amount: 0 }];
  }, [sales, dateRange]);

  // Monthly comparison data
  const monthlyData = useMemo(() => {
    const months = new Map<string, { sales: number; profit: number }>();

    sales.forEach(sale => {
      const date = new Date(sale.saleDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = months.get(monthKey) || { sales: 0, profit: 0 };
      const profit = (sale.sellingPrice - sale.costPrice) * sale.quantity;

      months.set(monthKey, {
        sales: current.sales + sale.totalAmount,
        profit: current.profit + profit
      });
    });

    const result = Array.from(months.entries())
      .map(([month, data]) => ({
        month,
        ...data
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    return result.length > 0 ? result : [{ month: new Date().toISOString().slice(0, 7), sales: 0, profit: 0 }];
  }, [sales]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header with Quick Actions */}
      <motion.div
        variants={cardVariant}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Filters */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => setTimeRange('7days')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                timeRange === '7days'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('dashboard.7days')}
            </motion.button>
            <motion.button
              onClick={() => setTimeRange('30days')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                timeRange === '30days'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('dashboard.30days')}
            </motion.button>
            <motion.button
              onClick={() => setTimeRange('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                timeRange === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('dashboard.allTime')}
            </motion.button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 border-l border-gray-300 pl-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              {t('dashboard.addProduct')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              {t('dashboard.createInvoice')}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Business Overview - KPI Cards (BIGGER & BOLDER) */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.businessOverview')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <motion.div
            variants={cardVariant}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/60 p-6 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              {kpis.revenueGrowth >= 0 ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">↑ {formatPercentage(kpis.revenueGrowth)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-bold text-red-700">↓ {formatPercentage(Math.abs(kpis.revenueGrowth))}</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-gray-500 mb-2">{t('dashboard.totalSales')}</p>
            <p className="text-4xl font-extrabold text-gray-900 mb-2">{formatCurrency(kpis.totalSales)}</p>
            <p className="text-xs text-gray-400">{t('dashboard.vsPreviousPeriod')}</p>
          </motion.div>

          <motion.div
            variants={cardVariant}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/60 p-6 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-bold text-green-700">{kpis.profitMargin.toFixed(1)}% margin</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-2">{t('dashboard.grossProfit')}</p>
            <p className="text-4xl font-extrabold text-gray-900 mb-2">{formatCurrency(kpis.grossProfit)}</p>
            <p className="text-xs text-gray-400">{t('dashboard.profitability')}</p>
          </motion.div>

          <motion.div
            variants={cardVariant}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/60 p-6 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm font-bold text-purple-700">{kpis.inventoryTurnover.toFixed(1)}x turnover</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-2">{t('dashboard.stockValue')}</p>
            <p className="text-4xl font-extrabold text-gray-900 mb-2">{formatCurrency(kpis.totalStockValue)}</p>
            <p className="text-xs text-gray-400">{t('dashboard.inventoryHealth')}</p>
          </motion.div>

          <motion.div
            variants={cardVariant}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-white rounded-2xl shadow-sm hover:shadow-xl border p-6 transition-all duration-200 ${
              kpis.lowStockAlerts.length > 0 ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200/60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl shadow-md ${
                kpis.lowStockAlerts.length > 0
                  ? 'bg-gradient-to-br from-orange-500 to-red-600'
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              {kpis.lowStockAlerts.length > 0 && (
                <div className="px-3 py-1.5 bg-orange-100 rounded-lg border border-orange-300">
                  <span className="text-sm font-bold text-orange-700">⚠ Alert</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-gray-500 mb-2">{t('dashboard.lowStockAlerts')}</p>
            <p className={`text-4xl font-extrabold mb-2 ${
              kpis.lowStockAlerts.length > 0 ? 'text-orange-600' : 'text-gray-900'
            }`}>{kpis.lowStockAlerts.length}</p>
            <p className="text-xs text-gray-400">{t('dashboard.deadStock')}: {kpis.deadStock.length}</p>
          </motion.div>
        </div>
      </div>

      {/* Procurement Overview */}
      <motion.div
        variants={cardVariant}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/60 p-6 transition-all duration-200 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-sm">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{t('procurement.overview')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('procurement.activeVendors')}</p>
              <p className="text-2xl font-bold text-gray-900">{mockProcurementMetrics.activeVendors}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('procurement.outOf')} {mockProcurementMetrics.totalVendors} {t('procurement.total')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('procurement.totalSpent')}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockProcurementMetrics.totalSpent)}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('procurement.avgOrder')}: {formatCurrency(mockProcurementMetrics.averageOrderValue)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('procurement.pendingOrders')}</p>
              <p className="text-2xl font-bold text-gray-900">{mockProcurementMetrics.pendingOrders}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('procurement.outOf')} {mockProcurementMetrics.totalPurchaseOrders} {t('procurement.total')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('procurement.outstandingPayments')}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockProcurementMetrics.outstandingPayments)}</p>
              <p className="text-xs text-green-600 font-medium mt-0.5">
                {mockProcurementMetrics.onTimeDeliveryRate.toFixed(1)}% {t('procurement.onTimeDelivery')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sales Trend Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.salesAnalytics')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Trend */}
        <motion.div
          variants={chartVariant}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.dailySalesTrend')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailySalesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke="#d1d5db"
              />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} stroke="#d1d5db" />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sales by Category */}
        <motion.div
          variants={chartVariant}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <PieChartIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.salesByCategory')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={kpis.salesByCategory || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {(kpis.salesByCategory || []).map((entry, index) => (
                  <Cell key={`cell-category-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.performanceMetrics')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales & Profit */}
        <motion.div
          variants={chartVariant}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.monthlySalesProfit')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#d1d5db" />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} stroke="#d1d5db" />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="sales" fill="#6366f1" name={t('dashboard.sales')} radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" name={t('dashboard.profit')} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products by Revenue */}
        <motion.div
          variants={chartVariant}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.topProductsByRevenue')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kpis.salesByProduct.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} stroke="#d1d5db" />
              <YAxis dataKey="productName" type="category" width={120} tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#d1d5db" />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        </div>
      </div>

      {/* Smart Insights Panel */}
      <motion.div
        variants={cardVariant}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-200/60 p-6"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.smartInsights')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Low Stock Alert */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200">
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{t('dashboard.lowStockWarning')}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpis.lowStockAlerts.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">{t('dashboard.productsNeedRestock')}</p>
          </div>

          {/* Sales Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-200">
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{t('dashboard.salesTrend')}</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {kpis.revenueGrowth >= 0 ? '+' : ''}{formatPercentage(kpis.revenueGrowth)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600">{t('dashboard.comparedToLastPeriod')}</p>
          </div>

          {/* Profit Insight */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{t('dashboard.profitMargin')}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpis.profitMargin.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">{t('dashboard.averageMargin')}</p>
          </div>
        </div>
      </motion.div>

      {/* Inventory Alerts Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.inventoryAlerts')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <motion.div
          variants={cardVariant}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.lowStockAlerts')}</h2>
          </div>
          <div className="space-y-3">
            {kpis.lowStockAlerts.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">{t('dashboard.noLowStockAlerts')}</p>
            ) : (
              kpis.lowStockAlerts.slice(0, 5).map(product => (
                <div key={product.id} className="flex justify-between items-center p-4 bg-orange-50/60 rounded-xl hover:bg-orange-50 transition-colors border border-orange-100">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">{product.currentStock} {t('dashboard.units')}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t('dashboard.reorder')}: {product.reorderLevel}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Fast Moving Items */}
        <motion.div
          variants={cardVariant}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.fastMovingItems')}</h2>
          </div>
          <div className="space-y-3">
            {kpis.fastMovingItems.map(product => (
              <div key={product.id} className="flex justify-between items-center p-4 bg-green-50/60 rounded-xl hover:bg-green-50 transition-colors border border-green-100">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{product.currentStock} {t('dashboard.units')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(product.sellingPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </motion.div>
  );
}