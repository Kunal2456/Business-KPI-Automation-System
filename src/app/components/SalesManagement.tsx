import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sale, Product } from '../types';
import { Plus, Download, Search, Filter } from 'lucide-react';
import { formatCurrency, exportToCSV } from '../utils/kpiCalculations';

interface SalesManagementProps {
  sales: Sale[];
  products: Product[];
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
  selectedStore: string;
  darkMode: boolean;
}

export function SalesManagement({ sales, products, onAddSale, selectedStore, darkMode }: SalesManagementProps) {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    discount: 0,
    storeLocation: 'Store A'
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = products.find(p => p.id === formData.productId);
    if (!product) return;

    const totalAmount = (product.sellingPrice * formData.quantity) * (1 - formData.discount / 100);
    
    onAddSale({
      productId: product.id,
      productName: product.name,
      quantity: formData.quantity,
      saleDate: new Date(),
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      discount: formData.discount,
      totalAmount,
      storeLocation: formData.storeLocation
    });

    setFormData({
      productId: '',
      quantity: 1,
      discount: 0,
      storeLocation: 'Store A'
    });
    setShowAddForm(false);
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const product = products.find(p => p.id === sale.productId);
    const matchesCategory = filterCategory === 'all' || product?.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    const exportData = filteredSales.map(sale => ({
      'Sale ID': sale.id,
      'Product': sale.productName,
      'Quantity': sale.quantity,
      'Unit Price': sale.sellingPrice,
      'Discount %': sale.discount,
      'Total Amount': sale.totalAmount,
      'Date': new Date(sale.saleDate).toLocaleDateString(),
      'Store': sale.storeLocation || 'N/A'
    }));
    
    exportToCSV(exportData, `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('sales.title')}</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('sales.subtitle')}</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('sales.addSale')}
        </button>
      </div>

      {/* Add Sale Form */}
      {showAddForm && (
        <div className={`rounded-lg shadow p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('sales.recordNewSale')}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.product')}</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="">{t('sales.selectProduct')}</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.sellingPrice)} (Stock: {product.currentStock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.quantity')}</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.discount')}</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.storeLocation')}</label>
              <select
                value={formData.storeLocation}
                onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="Store A">Store A</option>
                <option value="Store B">Store B</option>
                <option value="Store C">Store C</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('sales.recordSale')}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className={`rounded-lg shadow p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder={t('sales.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">{t('sales.allCategories')}</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              {t('common.export')}
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className={`rounded-lg shadow border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <tr>
                <th className={`px-6 py-3 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.saleID')}</th>
                <th className={`px-6 py-3 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.product')}</th>
                <th className={`px-6 py-3 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.quantity')}</th>
                <th className={`px-6 py-3 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.unitPrice')}</th>
                <th className={`px-6 py-3 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.discount')}</th>
                <th className={`px-6 py-3 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.total')}</th>
                <th className={`px-6 py-3 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.date')}</th>
                <th className={`px-6 py-3 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('sales.store')}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('sales.noSales')}
                  </td>
                </tr>
              ) : (
                filteredSales.slice(0, 100).map(sale => (
                  <tr key={sale.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{sale.id}</td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{sale.productName}</td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sale.quantity}</td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCurrency(sale.sellingPrice)}</td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sale.discount}%</td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(sale.totalAmount)}</td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sale.storeLocation || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredSales.length > 100 && (
          <div className={`px-6 py-4 border-t ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('sales.showingResults', { showing: 100, total: filteredSales.length })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}