import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sale, Product } from '../types';
import { calculateKPIs, exportToCSV, formatCurrency, formatPercentage } from '../utils/kpiCalculations';
import { FileText, Download, Calendar, TrendingUp, Package2, DollarSign } from 'lucide-react';

interface ReportsProps {
  sales: Sale[];
  products: Product[];
}

export function Reports({ sales, products }: ReportsProps) {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('monthly');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const dateRange = useMemo(() => {
    const end = new Date(endDate);
    let start = new Date(startDate);
    
    if (reportType === 'daily') {
      start = new Date();
      start.setDate(start.getDate() - 1);
    } else if (reportType === 'weekly') {
      start = new Date();
      start.setDate(start.getDate() - 7);
    } else if (reportType === 'monthly') {
      start = new Date();
      start.setDate(start.getDate() - 30);
    }
    
    return { startDate: start, endDate: end };
  }, [reportType, startDate, endDate]);

  const kpis = useMemo(() => {
    return calculateKPIs(sales, products, dateRange);
  }, [sales, products, dateRange]);

  const handleExportSalesReport = () => {
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= dateRange.startDate && saleDate <= dateRange.endDate;
    });

    const exportData = filteredSales.map(sale => ({
      'Date': new Date(sale.saleDate).toLocaleDateString(),
      'Sale ID': sale.id,
      'Product': sale.productName,
      'Quantity': sale.quantity,
      'Unit Price': sale.sellingPrice,
      'Discount %': sale.discount,
      'Total Amount': sale.totalAmount,
      'Cost Price': sale.costPrice,
      'Profit': (sale.sellingPrice - sale.costPrice) * sale.quantity,
      'Store': sale.storeLocation || 'N/A'
    }));
    
    exportToCSV(exportData, `sales-report-${dateRange.startDate.toISOString().split('T')[0]}-to-${dateRange.endDate.toISOString().split('T')[0]}.csv`);
  };

  const handleExportInventoryReport = () => {
    const exportData = products.map(product => ({
      'Product ID': product.id,
      'Product Name': product.name,
      'Category': product.category,
      'Cost Price': product.costPrice,
      'Selling Price': product.sellingPrice,
      'Current Stock': product.currentStock,
      'Reorder Level': product.reorderLevel,
      'Stock Value': product.currentStock * product.costPrice,
      'Status': product.currentStock <= product.reorderLevel ? 'Low Stock' : 'OK',
      'Last Restocked': product.lastRestocked ? new Date(product.lastRestocked).toLocaleDateString() : 'N/A'
    }));
    
    exportToCSV(exportData, `inventory-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportKPIReport = () => {
    const kpiData = [
      { 'KPI': 'Total Sales', 'Value': kpis.totalSales, 'Unit': 'INR' },
      { 'KPI': 'Revenue Growth', 'Value': kpis.revenueGrowth, 'Unit': '%' },
      { 'KPI': 'Average Order Value', 'Value': kpis.averageOrderValue, 'Unit': 'INR' },
      { 'KPI': 'Gross Profit', 'Value': kpis.grossProfit, 'Unit': 'INR' },
      { 'KPI': 'Net Profit', 'Value': kpis.netProfit, 'Unit': 'INR' },
      { 'KPI': 'Profit Margin', 'Value': kpis.profitMargin, 'Unit': '%' },
      { 'KPI': 'Total Stock Value', 'Value': kpis.totalStockValue, 'Unit': 'INR' },
      { 'KPI': 'Inventory Turnover', 'Value': kpis.inventoryTurnover, 'Unit': 'x' },
      { 'KPI': 'Low Stock Items', 'Value': kpis.lowStockAlerts.length, 'Unit': 'count' },
      { 'KPI': 'Dead Stock Items', 'Value': kpis.deadStock.length, 'Unit': 'count' }
    ];
    
    exportToCSV(kpiData, `kpi-report-${dateRange.startDate.toISOString().split('T')[0]}-to-${dateRange.endDate.toISOString().split('T')[0]}.csv`);
  };

  const handleExportProductPerformance = () => {
    const exportData = kpis.salesByProduct.map(item => ({
      'Product': item.productName,
      'Total Sales': item.amount,
      'Profit': kpis.profitByProduct.find(p => p.productName === item.productName)?.profit || 0
    }));
    
    exportToCSV(exportData, `product-performance-${dateRange.startDate.toISOString().split('T')[0]}-to-${dateRange.endDate.toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">{t('reports.title')}</h1>
        <p className="text-gray-600">{t('reports.subtitle')}</p>
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h2 className="text-gray-900">{t('reports.reportPeriod')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setReportType('daily')}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              reportType === 'daily'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-gray-900">{t('reports.daily')}</p>
            <p className="text-gray-600">{t('reports.last24Hours')}</p>
          </button>
          
          <button
            onClick={() => setReportType('weekly')}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              reportType === 'weekly'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-gray-900">{t('reports.weekly')}</p>
            <p className="text-gray-600">{t('reports.last7Days')}</p>
          </button>
          
          <button
            onClick={() => setReportType('monthly')}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              reportType === 'monthly'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-gray-900">{t('reports.monthly')}</p>
            <p className="text-gray-600">{t('reports.last30Days')}</p>
          </button>
          
          <button
            onClick={() => setReportType('custom')}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              reportType === 'custom'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-gray-900">{t('reports.custom')}</p>
            <p className="text-gray-600">{t('reports.selectDates')}</p>
          </button>
        </div>

        {reportType === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 mb-2">{t('reports.startDate')}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{t('reports.endDate')}</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <div className="text-right">
              <p className="text-blue-100">{t('reports.totalSales')}</p>
              <p className="text-white mt-1">{formatCurrency(kpis.totalSales)}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-blue-400">
            <p className="text-blue-100">
              {t('reports.growth')}: {formatPercentage(kpis.revenueGrowth)}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <div className="text-right">
              <p className="text-green-100">{t('reports.grossProfit')}</p>
              <p className="text-white mt-1">{formatCurrency(kpis.grossProfit)}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-green-400">
            <p className="text-green-100">
              {t('reports.margin')}: {kpis.profitMargin.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package2 className="w-8 h-8" />
            <div className="text-right">
              <p className="text-purple-100">{t('reports.stockValue')}</p>
              <p className="text-white mt-1">{formatCurrency(kpis.totalStockValue)}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-purple-400">
            <p className="text-purple-100">
              {t('reports.turnover')}: {kpis.inventoryTurnover.toFixed(2)}x
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8" />
            <div className="text-right">
              <p className="text-orange-100">AOV</p>
              <p className="text-white mt-1">{formatCurrency(kpis.averageOrderValue)}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-orange-400">
            <p className="text-orange-100">
              Per Transaction
            </p>
          </div>
        </div>
      </div>

      {/* Export Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-gray-900">{t('reports.salesReport')}</h2>
          </div>
          <p className="text-gray-600 mb-4">
            {t('reports.salesReportDescription')}
          </p>
          <button
            onClick={handleExportSalesReport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            {t('reports.exportSalesReport')}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Package2 className="w-5 h-5 text-green-600" />
            <h2 className="text-gray-900">{t('reports.inventoryReport')}</h2>
          </div>
          <p className="text-gray-600 mb-4">
            {t('reports.inventoryReportDescription')}
          </p>
          <button
            onClick={handleExportInventoryReport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            {t('reports.exportInventoryReport')}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="text-gray-900">{t('reports.kpiReport')}</h2>
          </div>
          <p className="text-gray-600 mb-4">
            {t('reports.kpiReportDescription')}
          </p>
          <button
            onClick={handleExportKPIReport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            {t('reports.exportKPIReport')}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900">{t('reports.productPerformance')}</h2>
          </div>
          <p className="text-gray-600 mb-4">
            {t('reports.productPerformanceDescription')}
          </p>
          <button
            onClick={handleExportProductPerformance}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            {t('reports.exportProductPerformance')}
          </button>
        </div>
      </div>

      {/* Category Performance Table */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">{t('reports.salesByCategory')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">{t('reports.category')}</th>
                <th className="px-6 py-3 text-right text-gray-700">{t('reports.salesAmount')}</th>
                <th className="px-6 py-3 text-right text-gray-700">{t('reports.percentOfTotal')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kpis.salesByCategory.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{item.category}</td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {((item.amount / kpis.totalSales) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">{t('reports.topProductsByProfit')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">{t('reports.rank')}</th>
                <th className="px-6 py-3 text-left text-gray-700">{t('reports.product')}</th>
                <th className="px-6 py-3 text-right text-gray-700">{t('reports.totalSales')}</th>
                <th className="px-6 py-3 text-right text-gray-700">{t('reports.profit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kpis.profitByProduct.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">#{index + 1}</td>
                  <td className="px-6 py-4 text-gray-900">{item.productName}</td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    {formatCurrency(
                      kpis.salesByProduct.find(p => p.productName === item.productName)?.amount || 0
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-green-600">
                    {formatCurrency(item.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
