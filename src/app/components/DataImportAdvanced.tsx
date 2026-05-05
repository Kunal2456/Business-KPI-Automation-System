import { useState } from 'react';
import { Product, Sale } from '../types';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, Trash2, Database, AlertTriangle, Info, MapPin } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DataImportProps {
  onImportProducts: (products: Product[]) => void;
  onImportSales: (sales: Sale[]) => void;
  onClearAllData: () => void;
  products: Product[];
  sales: Sale[];
  darkMode: boolean;
  onNavigateToDashboard?: () => void; // Add navigation callback
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  warnings: string[];
}

interface ColumnMapping {
  [key: string]: string;
}

export function DataImportAdvanced({ 
  onImportProducts, 
  onImportSales, 
  onClearAllData,
  products,
  sales,
  darkMode,
  onNavigateToDashboard
}: DataImportProps) {
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | 'warning' | null;
    message: string;
    details?: ImportResult;
  }>({ type: null, message: '' });

  const [showColumnMapper, setShowColumnMapper] = useState(false);
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [pendingData, setPendingData] = useState<string[][]>([]);
  const [importType, setImportType] = useState<'products' | 'sales'>('products');

  // Auto-generate unique Product ID
  const generateProductId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `PROD-${timestamp}-${random}`.toUpperCase();
  };

  // Auto-generate unique Sale ID
  const generateSaleId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `SALE-${timestamp}-${random}`.toUpperCase();
  };

  // Validate and parse date (supports multiple formats)
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    // Try ISO format (YYYY-MM-DD)
    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return new Date(dateStr);
    }

    // Try DD/MM/YYYY or MM/DD/YYYY
    const slashMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (slashMatch) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) return date;
    }

    // Try Excel serial number (days since 1900-01-01)
    const excelSerial = parseFloat(dateStr);
    if (!isNaN(excelSerial) && excelSerial > 25000 && excelSerial < 60000) {
      const date = new Date((excelSerial - 25569) * 86400 * 1000);
      return date;
    }

    // Try parsing as-is
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Kaggle dataset templates
  const downloadKaggleTemplate = (dataset: 'retail' | 'supermarket' | 'inventory' | 'forecasting') => {
    let data: any[][] = [];
    let filename = '';

    switch (dataset) {
      case 'retail':
        // Online Retail Dataset format
        data = [
          ['InvoiceNo', 'StockCode', 'Description', 'Quantity', 'InvoiceDate', 'UnitPrice', 'Country'],
          ['INV001', 'PROD001', 'LED Bulb 9W', 10, '2024-12-16', 120.50, 'USA'],
          ['INV002', 'PROD002', 'Rice 5kg', 5, '2024-12-16', 350.00, 'USA'],
          ['INV003', 'PROD003', 'Pencil Pack', 20, '2024-12-16', 15.00, 'Canada']
        ];
        filename = 'kaggle-online-retail-template.xlsx';
        break;

      case 'supermarket':
        // Supermarket Sales Dataset format
        data = [
          ['Invoice ID', 'Product line', 'Unit price', 'Quantity', 'Date', 'Payment'],
          ['INV001', 'Electronics', 120.50, 2, '2024-12-16', 'Cash'],
          ['INV002', 'Food', 45.00, 1, '2024-12-16', 'Credit Card'],
          ['INV003', 'Home', 89.99, 3, '2024-12-16', 'E-wallet']
        ];
        filename = 'kaggle-supermarket-sales-template.xlsx';
        break;

      case 'inventory':
        // Retail Inventory Dataset format
        data = [
          ['ProductID', 'ProductName', 'Category', 'Price', 'Stock'],
          ['PROD001', 'LED Bulb 9W', 'Electronics', 120.50, 150],
          ['PROD002', 'Rice 5kg', 'Grocery', 350.00, 80],
          ['PROD003', 'Notebook A4', 'Stationery', 25.00, 200]
        ];
        filename = 'kaggle-inventory-template.xlsx';
        break;

      case 'forecasting':
        // Store Sales Forecasting Dataset format
        data = [
          ['Store', 'Item', 'Date', 'Sales'],
          ['Store A', 'PROD001', '2024-12-16', 1250.00],
          ['Store B', 'PROD002', '2024-12-16', 3500.00],
          ['Store A', 'PROD003', '2024-12-16', 500.00]
        ];
        filename = 'kaggle-forecasting-template.xlsx';
        break;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, filename);
  };

  const downloadProductTemplate = (format: 'csv' | 'excel' = 'csv') => {
    if (format === 'csv') {
      const template = `Product ID,Product Name,Category,Cost Price,Selling Price,Current Stock,Reorder Level
P001,Rice 1kg,Groceries,40,60,500,100
P002,Wheat Flour 1kg,Groceries,35,50,300,80
P003,Cooking Oil 1L,Groceries,120,150,200,50`;
      
      const blob = new Blob([template], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'product-template.csv';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const data = [
        ['Product ID', 'Product Name', 'Category', 'Cost Price', 'Selling Price', 'Current Stock', 'Reorder Level'],
        ['P001', 'Rice 1kg', 'Groceries', 40, 60, 500, 100],
        ['P002', 'Wheat Flour 1kg', 'Groceries', 35, 50, 300, 80],
        ['P003', 'Cooking Oil 1L', 'Groceries', 120, 150, 200, 50],
        ['', 'LED Bulb', 'Electronics', 120, 150, 200, 50]  // Empty ID for auto-generation demo
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
      XLSX.writeFile(workbook, 'product-template.xlsx');
    }
  };

  const downloadSalesTemplate = (format: 'csv' | 'excel' = 'csv') => {
    if (format === 'csv') {
      const template = `Sale ID,Product ID,Product Name,Quantity,Sale Date,Cost Price,Selling Price,Discount %,Total Amount,Store Location
S001,P001,Rice 1kg,5,2024-12-16,40,60,0,300,Store A
S002,P002,Wheat Flour 1kg,3,2024-12-16,35,50,5,142.5,Store B`;
      
      const blob = new Blob([template], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sales-template.csv';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const data = [
        ['Sale ID', 'Product ID', 'Product Name', 'Quantity', 'Sale Date', 'Cost Price', 'Selling Price', 'Discount %', 'Total Amount', 'Store Location'],
        ['S001', 'P001', 'Rice 1kg', 5, '2024-12-16', 40, 60, 0, 300, 'Store A'],
        ['S002', 'P002', 'Wheat Flour 1kg', 3, '2024-12-16', 35, 50, 5, 142.5, 'Store B']
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
      XLSX.writeFile(workbook, 'sales-template.xlsx');
    }
  };

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
  };

  const parseExcel = (arrayBuffer: ArrayBuffer): string[][] => {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];
    return data.map(row => row.map(cell => String(cell || '')));
  };

  const parseFile = async (file: File): Promise<string[][]> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            resolve(parseCSV(text));
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            resolve(parseExcel(arrayBuffer));
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      });
    } else {
      throw new Error('Unsupported file format. Please use CSV, XLS, or XLSX files.');
    }
  };

  // Smart column detection and auto-mapping
  const detectColumnMapping = (headers: string[], type: 'products' | 'sales'): ColumnMapping => {
    const mapping: ColumnMapping = {};
    
    if (type === 'products') {
      const productIdVariants = ['product id', 'productid', 'stockcode', 'item', 'sku', 'id'];
      const nameVariants = ['product name', 'productname', 'name', 'description', 'item name'];
      const categoryVariants = ['category', 'product line', 'type', 'class'];
      const priceVariants = ['price', 'unit price', 'unitprice', 'cost price', 'selling price'];
      const stockVariants = ['stock', 'quantity', 'qty', 'current stock', 'opening stock'];

      headers.forEach(header => {
        const normalized = header.toLowerCase().trim();
        
        if (productIdVariants.some(v => normalized.includes(v))) {
          if (!mapping['Product ID']) mapping['Product ID'] = header;
        } else if (nameVariants.some(v => normalized.includes(v))) {
          if (!mapping['Product Name']) mapping['Product Name'] = header;
        } else if (categoryVariants.some(v => normalized.includes(v))) {
          if (!mapping['Category']) mapping['Category'] = header;
        } else if (priceVariants.some(v => normalized.includes(v))) {
          if (!mapping['Cost Price']) mapping['Cost Price'] = header;
          if (!mapping['Selling Price']) mapping['Selling Price'] = header;
        } else if (stockVariants.some(v => normalized.includes(v))) {
          if (!mapping['Current Stock']) mapping['Current Stock'] = header;
        }
      });
    } else {
      // Sales mapping
      const saleIdVariants = ['sale id', 'saleid', 'invoice', 'invoiceno', 'transaction'];
      const productIdVariants = ['product id', 'productid', 'stockcode', 'item'];
      const qtyVariants = ['quantity', 'qty'];
      const dateVariants = ['date', 'sale date', 'invoice date', 'transaction date'];
      const priceVariants = ['price', 'unit price', 'sale price'];

      headers.forEach(header => {
        const normalized = header.toLowerCase().trim();
        
        if (saleIdVariants.some(v => normalized.includes(v))) {
          if (!mapping['Sale ID']) mapping['Sale ID'] = header;
        } else if (productIdVariants.some(v => normalized.includes(v))) {
          if (!mapping['Product ID']) mapping['Product ID'] = header;
        } else if (qtyVariants.some(v => normalized === v)) {
          if (!mapping['Quantity']) mapping['Quantity'] = header;
        } else if (dateVariants.some(v => normalized.includes(v))) {
          if (!mapping['Sale Date']) mapping['Sale Date'] = header;
        } else if (priceVariants.some(v => normalized.includes(v))) {
          if (!mapping['Selling Price']) mapping['Selling Price'] = header;
        }
      });
    }

    return mapping;
  };

  const handleProductUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseFile(file);
      const headers = rows[0];
      const dataRows = rows.slice(1).filter(row => row.some(cell => cell.trim()));

      // Auto-detect column mapping
      const autoMapping = detectColumnMapping(headers, 'products');
      
      // If we can't auto-map critical columns, show mapper
      if (!autoMapping['Product Name']) {
        setPendingData(rows);
        setDetectedColumns(headers);
        setColumnMapping(autoMapping);
        setImportType('products');
        setShowColumnMapper(true);
        event.target.value = '';
        return;
      }

      // Process with auto-mapping
      const result = processProductImport(dataRows, headers, autoMapping);
      showImportResult(result, file.name);
      
      event.target.value = '';
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error importing products: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      event.target.value = '';
    }
  };

  const processProductImport = (dataRows: string[][], headers: string[], mapping: ColumnMapping): ImportResult => {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      warnings: []
    };

    const validProducts: Product[] = [];
    const idIndex = headers.indexOf(mapping['Product ID'] || '');
    const nameIndex = headers.indexOf(mapping['Product Name'] || '');
    const categoryIndex = headers.indexOf(mapping['Category'] || '');
    const costIndex = headers.indexOf(mapping['Cost Price'] || '');
    const sellIndex = headers.indexOf(mapping['Selling Price'] || '');
    const stockIndex = headers.indexOf(mapping['Current Stock'] || '');
    const reorderIndex = headers.indexOf(mapping['Reorder Level'] || '');

    dataRows.forEach((row, index) => {
      try {
        // Auto-generate ID if missing
        let productId = idIndex >= 0 && row[idIndex] ? row[idIndex].trim() : '';
        if (!productId) {
          productId = generateProductId();
          result.warnings.push(`Row ${index + 2}: Auto-generated Product ID: ${productId}`);
        }

        const name = nameIndex >= 0 ? row[nameIndex].trim() : '';
        if (!name) {
          result.errors.push(`Row ${index + 2}: Product Name is required`);
          result.failed++;
          return;
        }

        const category = categoryIndex >= 0 ? row[categoryIndex].trim() : 'General';
        
        const costPrice = costIndex >= 0 ? parseFloat(row[costIndex]) : 0;
        const sellingPrice = sellIndex >= 0 ? parseFloat(row[sellIndex]) : costPrice * 1.5;
        
        if (isNaN(costPrice) || costPrice < 0) {
          result.errors.push(`Row ${index + 2}: Invalid Cost Price`);
          result.failed++;
          return;
        }

        if (isNaN(sellingPrice) || sellingPrice < 0) {
          result.errors.push(`Row ${index + 2}: Invalid Selling Price`);
          result.failed++;
          return;
        }

        const currentStock = stockIndex >= 0 ? parseInt(row[stockIndex]) : 0;
        const reorderLevel = reorderIndex >= 0 ? parseInt(row[reorderIndex]) : 10;

        validProducts.push({
          id: productId,
          name,
          category,
          costPrice,
          sellingPrice,
          currentStock: isNaN(currentStock) ? 0 : currentStock,
          reorderLevel: isNaN(reorderLevel) ? 10 : reorderLevel,
          lastRestocked: new Date()
        });

        result.success++;
      } catch (error) {
        result.errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        result.failed++;
      }
    });

    if (validProducts.length > 0) {
      onImportProducts(validProducts);
    }

    return result;
  };

  const handleSalesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseFile(file);
      const headers = rows[0];
      const dataRows = rows.slice(1).filter(row => row.some(cell => cell.trim()));

      const autoMapping = detectColumnMapping(headers, 'sales');
      
      if (!autoMapping['Product ID'] || !autoMapping['Quantity']) {
        setPendingData(rows);
        setDetectedColumns(headers);
        setColumnMapping(autoMapping);
        setImportType('sales');
        setShowColumnMapper(true);
        event.target.value = '';
        return;
      }

      const result = processSalesImport(dataRows, headers, autoMapping);
      showImportResult(result, file.name);
      
      event.target.value = '';
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error importing sales: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      event.target.value = '';
    }
  };

  const processSalesImport = (dataRows: string[][], headers: string[], mapping: ColumnMapping): ImportResult => {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      warnings: []
    };

    const validSales: Sale[] = [];
    const saleIdIndex = headers.indexOf(mapping['Sale ID'] || '');
    const productIdIndex = headers.indexOf(mapping['Product ID'] || '');
    const productNameIndex = headers.indexOf(mapping['Product Name'] || '');
    const qtyIndex = headers.indexOf(mapping['Quantity'] || '');
    const dateIndex = headers.indexOf(mapping['Sale Date'] || '');
    const costIndex = headers.indexOf(mapping['Cost Price'] || '');
    const sellIndex = headers.indexOf(mapping['Selling Price'] || '');
    const discountIndex = headers.indexOf(mapping['Discount %'] || '');
    const totalIndex = headers.indexOf(mapping['Total Amount'] || '');
    const storeIndex = headers.indexOf(mapping['Store Location'] || '');

    const existingProductIds = new Set(products.map(p => p.id));

    dataRows.forEach((row, index) => {
      try {
        let saleId = saleIdIndex >= 0 && row[saleIdIndex] ? row[saleIdIndex].trim() : '';
        if (!saleId) {
          saleId = generateSaleId();
        }

        const productId = productIdIndex >= 0 ? row[productIdIndex].trim() : '';
        if (!productId) {
          result.errors.push(`Row ${index + 2}: Product ID is required`);
          result.failed++;
          return;
        }

        // Validate product exists (with warning)
        if (!existingProductIds.has(productId)) {
          result.warnings.push(`Row ${index + 2}: Product ID "${productId}" not found in inventory`);
        }

        let productName = productNameIndex >= 0 ? row[productNameIndex].trim() : '';
        if (!productName) {
          const product = products.find(p => p.id === productId);
          productName = product?.name || 'Unknown Product';
        }

        const quantity = qtyIndex >= 0 ? parseInt(row[qtyIndex]) : 1;
        if (isNaN(quantity) || quantity <= 0) {
          result.errors.push(`Row ${index + 2}: Quantity must be greater than 0`);
          result.failed++;
          return;
        }

        const saleDate = dateIndex >= 0 ? parseDate(row[dateIndex]) : new Date();
        if (!saleDate) {
          result.errors.push(`Row ${index + 2}: Invalid date format`);
          result.failed++;
          return;
        }

        const costPrice = costIndex >= 0 ? parseFloat(row[costIndex]) : 0;
        const sellingPrice = sellIndex >= 0 ? parseFloat(row[sellIndex]) : 0;
        const discount = discountIndex >= 0 ? parseFloat(row[discountIndex]) : 0;
        
        let totalAmount = totalIndex >= 0 ? parseFloat(row[totalIndex]) : 0;
        if (!totalAmount || isNaN(totalAmount)) {
          totalAmount = quantity * sellingPrice * (1 - discount / 100);
        }

        const storeLocation = storeIndex >= 0 ? row[storeIndex].trim() : 'Store A';

        validSales.push({
          id: saleId,
          productId,
          productName,
          quantity,
          saleDate,
          costPrice: isNaN(costPrice) ? 0 : costPrice,
          sellingPrice: isNaN(sellingPrice) ? 0 : sellingPrice,
          discount: isNaN(discount) ? 0 : discount,
          totalAmount,
          storeLocation
        });

        result.success++;
      } catch (error) {
        result.errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        result.failed++;
      }
    });

    if (validSales.length > 0) {
      onImportSales(validSales);
    }

    return result;
  };

  const showImportResult = (result: ImportResult, filename: string) => {
    if (result.success > 0 && result.failed === 0 && result.errors.length === 0) {
      setUploadStatus({
        type: 'success',
        message: `Successfully imported ${result.success} records from ${filename}!`,
        details: result
      });
    } else if (result.success > 0 && (result.failed > 0 || result.warnings.length > 0)) {
      setUploadStatus({
        type: 'warning',
        message: `Imported ${result.success} records with ${result.failed} failures and ${result.warnings.length} warnings`,
        details: result
      });
    } else {
      setUploadStatus({
        type: 'error',
        message: `Import failed: ${result.errors[0] || 'Unknown error'}`,
        details: result
      });
    }

    // Don't auto-hide if there are details to review
    if (result.failed === 0 && result.warnings.length === 0) {
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 10000);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
      onClearAllData();
      setUploadStatus({
        type: 'success',
        message: 'All data has been cleared successfully.'
      });
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 5000);
    }
  };

  const handleColumnMappingConfirm = () => {
    const headers = pendingData[0];
    const dataRows = pendingData.slice(1).filter(row => row.some(cell => cell.trim()));

    let result: ImportResult;
    if (importType === 'products') {
      result = processProductImport(dataRows, headers, columnMapping);
    } else {
      result = processSalesImport(dataRows, headers, columnMapping);
    }

    showImportResult(result, 'uploaded file');
    setShowColumnMapper(false);
    setPendingData([]);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className={`mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Data Management</h1>
        <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Import data from Kaggle datasets, Excel, or CSV files</p>
      </div>

      {/* Status Message */}
      {uploadStatus.type && (
        <div className={`rounded-lg p-3 sm:p-4 border ${
          uploadStatus.type === 'success' 
            ? (darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200') 
            : uploadStatus.type === 'warning'
            ? (darkMode ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-200')
            : (darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200')
        }`}>
          <div className="flex items-start gap-2 sm:gap-3">
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : uploadStatus.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm sm:text-base font-medium ${
                uploadStatus.type === 'success' 
                  ? (darkMode ? 'text-green-300' : 'text-green-800')
                  : uploadStatus.type === 'warning'
                  ? (darkMode ? 'text-yellow-300' : 'text-yellow-800')
                  : (darkMode ? 'text-red-300' : 'text-red-800')
              }`}>
                {uploadStatus.message}
              </p>
              
              {/* View in Dashboard Button */}
              {(uploadStatus.type === 'success' || uploadStatus.type === 'warning') && uploadStatus.details && uploadStatus.details.success > 0 && onNavigateToDashboard && (
                <button
                  onClick={onNavigateToDashboard}
                  className={`mt-2 px-3 py-1.5 text-sm rounded ${
                    uploadStatus.type === 'success'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  } transition-colors`}
                >
                  📊 View in Dashboard
                </button>
              )}
              
              {uploadStatus.details && (
                <div className="mt-2 space-y-1">
                  {uploadStatus.details.warnings.length > 0 && (
                    <details className="text-xs">
                      <summary className={`cursor-pointer ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                        {uploadStatus.details.warnings.length} warnings
                      </summary>
                      <ul className="mt-1 ml-4 space-y-0.5">
                        {uploadStatus.details.warnings.slice(0, 5).map((warning, i) => (
                          <li key={i} className={darkMode ? 'text-yellow-300' : 'text-yellow-600'}>• {warning}</li>
                        ))}
                        {uploadStatus.details.warnings.length > 5 && (
                          <li className={darkMode ? 'text-yellow-300' : 'text-yellow-600'}>... and {uploadStatus.details.warnings.length - 5} more</li>
                        )}
                      </ul>
                    </details>
                  )}
                  
                  {uploadStatus.details.errors.length > 0 && (
                    <details className="text-xs">
                      <summary className={`cursor-pointer ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                        {uploadStatus.details.errors.length} errors
                      </summary>
                      <ul className="mt-1 ml-4 space-y-0.5">
                        {uploadStatus.details.errors.slice(0, 5).map((error, i) => (
                          <li key={i} className={darkMode ? 'text-red-300' : 'text-red-600'}>• {error}</li>
                        ))}
                        {uploadStatus.details.errors.length > 5 && (
                          <li className={darkMode ? 'text-red-300' : 'text-red-600'}>... and {uploadStatus.details.errors.length - 5} more</li>
                        )}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Column Mapper Modal */}
      {showColumnMapper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h3 className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Map Columns</h3>
            </div>
            
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              We detected these columns. Please map them to the required fields:
            </p>

            <div className="space-y-3 mb-6">
              {importType === 'products' ? (
                <>
                  {['Product ID', 'Product Name', 'Category', 'Cost Price', 'Selling Price', 'Current Stock', 'Reorder Level'].map(field => (
                    <div key={field}>
                      <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{field}:</label>
                      <select
                        value={columnMapping[field] || ''}
                        onChange={(e) => setColumnMapping({ ...columnMapping, [field]: e.target.value })}
                        className={`w-full mt-1 px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="">-- Select Column --</option>
                        {detectedColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {['Sale ID', 'Product ID', 'Product Name', 'Quantity', 'Sale Date', 'Cost Price', 'Selling Price', 'Discount %', 'Total Amount', 'Store Location'].map(field => (
                    <div key={field}>
                      <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{field}:</label>
                      <select
                        value={columnMapping[field] || ''}
                        onChange={(e) => setColumnMapping({ ...columnMapping, [field]: e.target.value })}
                        className={`w-full mt-1 px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="">-- Select Column --</option>
                        {detectedColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleColumnMappingConfirm}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowColumnMapper(false);
                  setPendingData([]);
                }}
                className={`flex-1 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Data Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-4 sm:p-6 border`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'} rounded-lg`}>
              <Database className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Products</p>
              <p className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{products.length}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-4 sm:p-6 border`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'} rounded-lg`}>
              <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sales Records</p>
              <p className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{sales.length}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-4 sm:p-6 border flex items-center`}>
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Clear All Data
          </button>
        </div>
      </div>

      {/* Kaggle Templates Section */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-800' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'} rounded-lg p-4 sm:p-6 border`}>
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-purple-600" />
          <h2 className={`text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kaggle Dataset Templates</h2>
        </div>
        <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          Download templates compatible with popular Kaggle retail datasets
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <button
            onClick={() => downloadKaggleTemplate('retail')}
            className={`flex flex-col items-center gap-2 px-3 py-3 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-lg transition-colors text-center`}
          >
            <FileSpreadsheet className="w-5 h-5 text-purple-600" />
            <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Online Retail</span>
          </button>

          <button
            onClick={() => downloadKaggleTemplate('supermarket')}
            className={`flex flex-col items-center gap-2 px-3 py-3 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-lg transition-colors text-center`}
          >
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Supermarket</span>
          </button>

          <button
            onClick={() => downloadKaggleTemplate('inventory')}
            className={`flex flex-col items-center gap-2 px-3 py-3 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-lg transition-colors text-center`}
          >
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Inventory</span>
          </button>

          <button
            onClick={() => downloadKaggleTemplate('forecasting')}
            className={`flex flex-col items-center gap-2 px-3 py-3 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-lg transition-colors text-center`}
          >
            <FileSpreadsheet className="w-5 h-5 text-orange-600" />
            <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Forecasting</span>
          </button>
        </div>
      </div>

      {/* Standard Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Product Import/Export */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-4 sm:p-6 border`}>
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <h2 className={`text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Product Data</h2>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Download a template or upload your product catalog
              </p>
              
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => downloadProductTemplate('csv')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors text-xs sm:text-sm`}
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  CSV
                </button>
                <button
                  onClick={() => downloadProductTemplate('excel')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors text-xs sm:text-sm`}
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  Excel
                </button>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleProductUpload}
                  className="hidden"
                  id="product-upload"
                />
                <label
                  htmlFor="product-upload"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Upload Products (CSV/Excel)
                </label>
              </div>
            </div>

            <div className={`pt-3 sm:pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Auto-detected columns:</p>
              <ul className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>✓ Product ID (auto-generated if missing)</li>
                <li>✓ Product Name, Category</li>
                <li>✓ Cost/Selling Price, Stock</li>
              </ul>
              <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-gray-500'} mt-2`}>
                ✓ CSV, XLSX, XLS | Smart column mapping
              </p>
            </div>
          </div>
        </div>

        {/* Sales Import/Export */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-4 sm:p-6 border`}>
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <h2 className={`text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sales Data</h2>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Download a template or upload your sales history
              </p>
              
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => downloadSalesTemplate('csv')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors text-xs sm:text-sm`}
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  CSV
                </button>
                <button
                  onClick={() => downloadSalesTemplate('excel')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors text-xs sm:text-sm`}
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  Excel
                </button>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleSalesUpload}
                  className="hidden"
                  id="sales-upload"
                />
                <label
                  htmlFor="sales-upload"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Upload Sales (CSV/Excel)
                </label>
              </div>
            </div>

            <div className={`pt-3 sm:pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Auto-detected columns:</p>
              <ul className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>✓ Sale/Invoice ID (auto-generated)</li>
                <li>✓ Product ID, Quantity, Date</li>
                <li>✓ Prices, Discounts, Store</li>
              </ul>
              <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-gray-500'} mt-2`}>
                ✓ Multiple date formats | Flexible parsing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className={`${darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'} rounded-lg p-4 sm:p-6 border`}>
        <div className="flex items-start gap-2 sm:gap-3">
          <Info className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5 flex-shrink-0`} />
          <div>
            <h3 className={`text-base sm:text-lg ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-2`}>Smart Import Features</h3>
            <ul className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'} space-y-1.5 sm:space-y-2`}>
              <li>✓ <strong>Auto-ID Generation:</strong> Missing Product/Sale IDs are auto-generated</li>
              <li>✓ <strong>Smart Column Mapping:</strong> Detects columns from Kaggle datasets automatically</li>
              <li>✓ <strong>Flexible Dates:</strong> Supports YYYY-MM-DD, DD/MM/YYYY, Excel serial dates</li>
              <li>✓ <strong>Validation:</strong> Skips invalid rows with detailed error logs</li>
              <li>✓ <strong>Partial Import:</strong> Imports valid data even if some rows fail</li>
            </ul>
            <div className={`mt-3 sm:mt-4 p-2 sm:p-3 ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'} rounded`}>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                <strong>Kaggle Compatible:</strong> Works with Online Retail, Supermarket Sales, Inventory, and Forecasting datasets. Download templates above to get started!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}