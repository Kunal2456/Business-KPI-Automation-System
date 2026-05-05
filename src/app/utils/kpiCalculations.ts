import { Sale, Product, KPIMetrics } from '../types';

export const calculateKPIs = (
  sales: Sale[],
  products: Product[],
  dateRange?: { startDate: Date; endDate: Date }
): KPIMetrics => {
  // Filter sales by date range if provided
  let filteredSales = sales;
  if (dateRange) {
    filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= dateRange.startDate && saleDate <= dateRange.endDate;
    });
  }

  // Calculate previous period for growth comparison
  let previousPeriodSales: Sale[] = [];
  if (dateRange) {
    const periodLength = dateRange.endDate.getTime() - dateRange.startDate.getTime();
    const previousStart = new Date(dateRange.startDate.getTime() - periodLength);
    const previousEnd = dateRange.startDate;
    
    previousPeriodSales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= previousStart && saleDate < previousEnd;
    });
  }

  // Sales KPIs
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const previousTotalSales = previousPeriodSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const revenueGrowth = previousTotalSales > 0 
    ? ((totalSales - previousTotalSales) / previousTotalSales) * 100 
    : 0;
  
  const averageOrderValue = filteredSales.length > 0 
    ? totalSales / filteredSales.length 
    : 0;

  // Sales by Category
  const categoryMap = new Map<string, number>();
  filteredSales.forEach(sale => {
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      const current = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, current + sale.totalAmount);
    }
  });
  const salesByCategory = Array.from(categoryMap.entries())
    .map(([category, amount], index) => ({ 
      id: `category-${category}-${index}`, // Add unique id
      category, 
      amount 
    }))
    .sort((a, b) => b.amount - a.amount);

  // Sales by Product
  const productMap = new Map<string, number>();
  filteredSales.forEach(sale => {
    const current = productMap.get(sale.productName) || 0;
    productMap.set(sale.productName, current + sale.totalAmount);
  });
  const salesByProduct = Array.from(productMap.entries())
    .map(([productName, amount], index) => ({ 
      id: `product-${productName}-${index}`, // Add unique id
      productName, 
      amount 
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10); // Top 10 products

  // Inventory KPIs
  const totalStockValue = products.reduce(
    (sum, product) => sum + (product.currentStock * product.costPrice),
    0
  );

  // Dead Stock (not sold in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSoldProductIds = new Set(
    sales
      .filter(sale => new Date(sale.saleDate) >= thirtyDaysAgo)
      .map(sale => sale.productId)
  );
  const deadStock = products.filter(
    product => !recentSoldProductIds.has(product.id) && product.currentStock > 0
  );

  // Fast and Slow Moving Items
  const productSalesCount = new Map<string, number>();
  filteredSales.forEach(sale => {
    const count = productSalesCount.get(sale.productId) || 0;
    productSalesCount.set(sale.productId, count + sale.quantity);
  });

  const productsWithSales = products.map(product => ({
    ...product,
    salesCount: productSalesCount.get(product.id) || 0
  })).filter(p => p.salesCount > 0);

  const sortedByMovement = productsWithSales.sort((a, b) => b.salesCount - a.salesCount);
  const fastMovingItems = sortedByMovement.slice(0, 5);
  const slowMovingItems = sortedByMovement.slice(-5).reverse();

  // Low Stock Alerts
  const lowStockAlerts = products.filter(
    product => product.currentStock <= product.reorderLevel
  );

  // Inventory Turnover Ratio
  const totalCostOfGoodsSold = filteredSales.reduce(
    (sum, sale) => sum + (sale.costPrice * sale.quantity),
    0
  );
  const averageInventoryValue = totalStockValue; // Simplified
  const inventoryTurnover = averageInventoryValue > 0 
    ? totalCostOfGoodsSold / averageInventoryValue 
    : 0;

  // Profitability KPIs
  const grossProfit = filteredSales.reduce(
    (sum, sale) => sum + ((sale.sellingPrice - sale.costPrice) * sale.quantity),
    0
  );
  
  // Simplified net profit (gross profit minus 10% operating costs)
  const netProfit = grossProfit * 0.9;
  
  const profitMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;

  // Profit by Product
  const productProfitMap = new Map<string, number>();
  filteredSales.forEach(sale => {
    const profit = (sale.sellingPrice - sale.costPrice) * sale.quantity;
    const current = productProfitMap.get(sale.productName) || 0;
    productProfitMap.set(sale.productName, current + profit);
  });
  const profitByProduct = Array.from(productProfitMap.entries())
    .map(([productName, profit]) => ({ productName, profit }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  return {
    totalSales,
    revenueGrowth,
    averageOrderValue,
    salesByCategory,
    salesByProduct,
    totalStockValue,
    deadStock,
    fastMovingItems,
    slowMovingItems,
    inventoryTurnover,
    lowStockAlerts,
    grossProfit,
    netProfit,
    profitMargin,
    profitByProduct
  };
};

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle dates and values with commas
        if (value instanceof Date) {
          return value.toISOString();
        }
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatPercentage = (num: number): string => {
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};