import { useState } from 'react';
import { Product, Sale } from '../types';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, Trash2, Database } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DataImportProps {
  onImportProducts: (products: Product[]) => void;
  onImportSales: (sales: Sale[]) => void;
  onClearAllData: () => void;
  products: Product[];
  sales: Sale[];
  darkMode: boolean;
}

export function DataImport({ 
  onImportProducts, 
  onImportSales, 
  onClearAllData,
  products,
  sales,
  darkMode 
}: DataImportProps) {
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

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
      // Excel format
      const data = [
        ['Product ID', 'Product Name', 'Category', 'Cost Price', 'Selling Price', 'Current Stock', 'Reorder Level'],
        ['P001', 'Rice 1kg', 'Groceries', 40, 60, 500, 100],
        ['P002', 'Wheat Flour 1kg', 'Groceries', 35, 50, 300, 80],
        ['P003', 'Cooking Oil 1L', 'Groceries', 120, 150, 200, 50]
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
      // Excel format
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

  const handleProductUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseFile(file);
      
      // Skip header row
      const dataRows = rows.slice(1).filter(row => row.some(cell => cell.trim()));
      
      const products: Product[] = dataRows.map((row, index) => {
        if (row.length < 7) {
          throw new Error(`Row ${index + 2} has insufficient columns`);
        }
        
        return {
          id: row[0] || `P${Date.now()}-${index}`,
          name: row[1],
          category: row[2],
          costPrice: parseFloat(row[3]),
          sellingPrice: parseFloat(row[4]),
          currentStock: parseInt(row[5]),
          reorderLevel: parseInt(row[6]),
          lastRestocked: new Date()
        };
      });

      // Validate products
      const invalid = products.find(p => 
        !p.name || 
        !p.category || 
        isNaN(p.costPrice) || 
        isNaN(p.sellingPrice) || 
        isNaN(p.currentStock) || 
        isNaN(p.reorderLevel)
      );

      if (invalid) {
        throw new Error('Invalid data found. Please check all fields are filled correctly.');
      }

      onImportProducts(products);
      setUploadStatus({
        type: 'success',
        message: `Successfully imported ${products.length} products from ${file.name}!`
      });
      
      // Reset file input
      event.target.value = '';
      
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 5000);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error importing products: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      event.target.value = '';
    }
  };

  const handleSalesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rows = await parseFile(file);
      
      // Skip header row
      const dataRows = rows.slice(1).filter(row => row.some(cell => cell.trim()));
      
      const sales: Sale[] = dataRows.map((row, index) => {
        if (row.length < 9) {
          throw new Error(`Row ${index + 2} has insufficient columns`);
        }
        
        return {
          id: row[0] || `S${Date.now()}-${index}`,
          productId: row[1],
          productName: row[2],
          quantity: parseInt(row[3]),
          saleDate: new Date(row[4]),
          costPrice: parseFloat(row[5]),
          sellingPrice: parseFloat(row[6]),
          discount: parseFloat(row[7]),
          totalAmount: parseFloat(row[8]),
          storeLocation: row[9] || 'Store A'
        };
      });

      // Validate sales
      const invalid = sales.find(s => 
        !s.productId || 
        !s.productName || 
        isNaN(s.quantity) || 
        isNaN(s.costPrice) || 
        isNaN(s.sellingPrice) || 
        isNaN(s.totalAmount)
      );

      if (invalid) {
        throw new Error('Invalid data found. Please check all fields are filled correctly.');
      }

      onImportSales(sales);
      setUploadStatus({
        type: 'success',
        message: `Successfully imported ${sales.length} sales records from ${file.name}!`
      });
      
      // Reset file input
      event.target.value = '';
      
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 5000);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error importing sales: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      event.target.value = '';
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className={`mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Data Management</h1>
        <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Import your business data or download templates to get started</p>
      </div>

      {/* Status Message */}
      {uploadStatus.type && (
        <div className={`rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3 ${
          uploadStatus.type === 'success' 
            ? (darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200') 
            : (darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200')
        } border`}>
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
          )}
          <p className={`text-sm sm:text-base ${
            uploadStatus.type === 'success' 
              ? (darkMode ? 'text-green-300' : 'text-green-800')
              : (darkMode ? 'text-red-300' : 'text-red-800')
          }`}>
            {uploadStatus.message}
          </p>
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

      {/* Import/Export Sections */}
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
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Required Columns:</p>
              <ul className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>• Product ID</li>
                <li>• Product Name</li>
                <li>• Category</li>
                <li>• Cost Price</li>
                <li>• Selling Price</li>
                <li>• Current Stock</li>
                <li>• Reorder Level</li>
              </ul>
              <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-gray-500'} mt-2`}>
                ✓ Supports CSV, XLSX, XLS formats
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
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Required Columns:</p>
              <ul className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>• Sale ID</li>
                <li>• Product ID</li>
                <li>• Product Name</li>
                <li>• Quantity</li>
                <li>• Sale Date (YYYY-MM-DD)</li>
                <li>• Cost Price</li>
                <li>• Selling Price</li>
                <li>• Discount %</li>
                <li>• Total Amount</li>
                <li>• Store Location</li>
              </ul>
              <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-gray-500'} mt-2`}>
                ✓ Supports CSV, XLSX, XLS formats
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className={`${darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'} rounded-lg p-4 sm:p-6 border`}>
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5 flex-shrink-0`} />
          <div>
            <h3 className={`text-base sm:text-lg ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-2`}>How to Import Data</h3>
            <ol className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'} space-y-1.5 sm:space-y-2`}>
              <li>1. Download the CSV template for products or sales</li>
              <li>2. Fill in your data following the exact column format</li>
              <li>3. Save the file as CSV or Excel (.xlsx, .xls)</li>
              <li>4. Click "Upload" and select your file (CSV/Excel supported)</li>
              <li>5. The system will validate and import your data automatically</li>
            </ol>
            <div className={`mt-3 sm:mt-4 p-2 sm:p-3 ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'} rounded`}>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                <strong>✓ Supported Formats:</strong> CSV (.csv), Excel 2007+ (.xlsx), Excel 97-2003 (.xls)
              </p>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'} mt-2`}>
                <strong>Note:</strong> Uploading new products will ADD to existing data. Uploading sales will ADD new records. Use "Clear All Data" to start fresh.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h2 className="text-gray-900 mb-4">Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-green-900 mb-2">✓ Do</h3>
            <ul className="text-green-800 space-y-1">
              <li>• Use the provided templates</li>
              <li>• Keep column headers unchanged</li>
              <li>• Use consistent date format (YYYY-MM-DD)</li>
              <li>• Verify data before uploading</li>
              <li>• Backup existing data before clearing</li>
            </ul>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-red-900 mb-2">✗ Don't</h3>
            <ul className="text-red-800 space-y-1">
              <li>• Don't change column names</li>
              <li>• Don't leave required fields empty</li>
              <li>• Don't use special characters in IDs</li>
              <li>• Don't mix date formats</li>
              <li>• Don't upload without reviewing data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}