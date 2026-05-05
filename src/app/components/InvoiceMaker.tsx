import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, User, ShoppingCart, Receipt, Printer, Download, Search, Store, MapPin, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Product, Sale } from '../types';
import { formatCurrency } from '../utils/kpiCalculations';
import { 
  calculateInvoiceGST, 
  InvoiceWithGST,
  validateGSTIN,
  GSTRate,
  INDIAN_STATES
} from '../utils/gstCalculations';
import { 
  fetchGSTINDetails, 
  GSTINDetails,
  StoreLocation,
  DEFAULT_STORES,
  getTransactionType,
  isSameState,
  extractStateCodeFromGSTIN
} from '../utils/gstinLookup';
import { GSTInvoice } from './GSTInvoice';
import { AdvancedGSTInvoice } from './AdvancedGSTInvoice';

interface InvoiceItem {
  product: Product;
  quantity: number;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  gstin: string;
  state: string;
  address: string;
}

interface InvoiceMakerProps {
  products: Product[];
  sales: Sale[];
  darkMode: boolean;
}

export function InvoiceMaker({
  products,
  sales,
  darkMode
}: InvoiceMakerProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'create' | 'preview'>('create');
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(DEFAULT_STORES[0]);
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    state: '27',
    address: ''
  });
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [generatedInvoice, setGeneratedInvoice] = useState<InvoiceWithGST | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // GSTIN lookup states
  const [gstinLoading, setGstinLoading] = useState(false);
  const [gstinDetails, setGstinDetails] = useState<GSTINDetails | null>(null);
  const [gstinError, setGstinError] = useState<string>('');

  // Filter products with GST data
  const productsWithGST = products.map(p => ({
    ...p,
    gstRate: (p.gstRate || 18) as GSTRate,
    priceIncludesGST: p.priceIncludesGST !== false
  }));

  const filteredProducts = productsWithGST.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-fetch GSTIN details when valid GSTIN is entered
  const handleGSTINChange = async (gstin: string) => {
    const upperGSTIN = gstin.toUpperCase();
    setCustomerData({ ...customerData, gstin: upperGSTIN });
    setGstinError('');
    setGstinDetails(null);

    // If GSTIN is valid format, fetch details
    if (validateGSTIN(upperGSTIN)) {
      setGstinLoading(true);
      try {
        const details = await fetchGSTINDetails(upperGSTIN);
        if (details) {
          setGstinDetails(details);
          // Auto-populate customer data
          setCustomerData(prev => ({
            ...prev,
            name: details.tradeName || details.legalName,
            address: details.address,
            state: details.stateCode
          }));
        } else {
          setGstinError('GSTIN not found in government records');
        }
      } catch (error) {
        setGstinError('Error fetching GSTIN details. Please enter manually.');
      } finally {
        setGstinLoading(false);
      }
    }
  };

  // Get transaction type
  const transactionInfo = getTransactionType(selectedStore.stateCode, customerData.state);

  const addItem = (product: Product) => {
    const existingItem = invoiceItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setInvoiceItems(invoiceItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setInvoiceItems([...invoiceItems, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setInvoiceItems(invoiceItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const removeItem = (productId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.product.id !== productId));
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return `INV-${selectedStore.id.toUpperCase()}-${year}${month}-${String(random).padStart(4, '0')}`;
  };

  const handleGenerateInvoice = () => {
    if (!customerData.name) {
      alert(t('sales.customerName') + ' is required');
      return;
    }

    if (invoiceItems.length === 0) {
      alert(t('sales.items') + ' are required');
      return;
    }

    const invoice = calculateInvoiceGST(
      invoiceItems.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.sellingPrice,
          gstRate: (item.product.gstRate || 18) as GSTRate,
          hsnCode: item.product.hsnCode,
          includesGST: item.product.priceIncludesGST !== false
        },
        quantity: item.quantity
      })),
      selectedStore.stateCode,
      customerData.state,
      generateInvoiceNumber(),
      customerData.name,
      customerData.gstin
    );

    setGeneratedInvoice(invoice);
    setStep('preview');
  };

  const handleSaveAndNew = () => {
    // Reset form
    setCustomerData({
      name: '',
      email: '',
      phone: '',
      gstin: '',
      state: '27',
      address: ''
    });
    setInvoiceItems([]);
    setGeneratedInvoice(null);
    setStep('create');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert(t('reports.downloadPdf') + ' - In production, integrate jsPDF library');
  };

  if (step === 'preview' && generatedInvoice) {
    return (
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={() => setStep('create')}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← {t('common.back')} to {t('common.edit')}
          </button>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Printer className="w-4 h-4" />
              {t('sales.printInvoice')}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              {t('reports.downloadPdf')}
            </button>
            <button
              onClick={handleSaveAndNew}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Receipt className="w-4 h-4" />
              {t('common.save')} & New Invoice
            </button>
          </div>
        </div>

        {/* Invoice Display - Use Advanced Invoice */}
        <AdvancedGSTInvoice
          invoice={generatedInvoice}
          store={selectedStore}
          customerAddress={customerData.address}
          customerEmail={customerData.email}
          customerPhone={customerData.phone}
          reverseCharge={false}
          placeOfSupply={customerData.state}
          bankDetails={{
            bankName: 'HDFC Bank',
            accountNumber: '1234567890123456',
            ifscCode: 'HDFC0001234',
            branch: 'Andheri East'
          }}
          terms={[
            'Goods once sold cannot be returned',
            'Payment due within 30 days',
            'Interest @18% p.a. will be charged on delayed payments',
            'Subject to Mumbai jurisdiction only'
          ]}
          declarationText="We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('invoice.title')}
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Create GST-compliant invoices for your customers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Receipt className="w-6 h-6 text-indigo-600" />
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            #{generateInvoiceNumber()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Selection */}
          <div className={`p-6 rounded-lg border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-5 h-5 text-indigo-600" />
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('setup.storeInfo')}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('setup.storeName')} *
                </label>
                <select
                  value={selectedStore.id}
                  onChange={(e) => {
                    const store = DEFAULT_STORES.find(s => s.id === e.target.value);
                    if (store) setSelectedStore(store);
                  }}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {DEFAULT_STORES.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name} - {store.city}, {store.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Store Details Display */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
                  <div className="flex-1">
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedStore.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedStore.address}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedStore.city}, {selectedStore.state} - {selectedStore.pincode}
                    </p>
                    {selectedStore.gstin && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {t('invoice.gstin')}: {selectedStore.gstin}
                      </p>
                    )}
                    {selectedStore.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('common.phone')}: {selectedStore.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction Type Indicator */}
              {customerData.state && (
                <div className={`p-4 rounded-lg border-2 ${
                  transactionInfo.type === 'INTRA_STATE'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                }`}>
                  <div className="flex items-start gap-3">
                    {transactionInfo.type === 'INTRA_STATE' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        transactionInfo.type === 'INTRA_STATE'
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-blue-700 dark:text-blue-400'
                      }`}>
                        {transactionInfo.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Tax Type: <span className="font-semibold">{transactionInfo.taxApplicable}</span>
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <p>Store State: {INDIAN_STATES[selectedStore.stateCode as keyof typeof INDIAN_STATES]} ({selectedStore.stateCode})</p>
                        <p>Customer State: {INDIAN_STATES[customerData.state as keyof typeof INDIAN_STATES]} ({customerData.state})</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Details */}
          <div className={`p-6 rounded-lg border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('sales.customer')} Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('sales.customerName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder={t('sales.customerName')}
                  />
                </div>

                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('common.phone')}
                  </label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('invoice.gstin')} ({t('setup.autoFetch')}) 🔍
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="27AAAAA0000A1Z5"
                      value={customerData.gstin}
                      onChange={(e) => handleGSTINChange(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${gstinLoading ? 'pr-10' : ''}`}
                    />
                    {gstinLoading && (
                      <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-600 animate-spin" />
                    )}
                  </div>
                  {gstinLoading && (
                    <p className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
                      <Loader className="w-3 h-3 animate-spin" />
                      Fetching details from government database...
                    </p>
                  )}
                  {gstinError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {gstinError}
                    </p>
                  )}
                  {gstinDetails && (
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      ✓ Details auto-fetched: {gstinDetails.tradeName}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('common.state')} *
                  </label>
                  <select
                    required
                    value={customerData.state}
                    onChange={(e) => setCustomerData({ ...customerData, state: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {Object.entries(INDIAN_STATES).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('common.address')}
                </label>
                <textarea
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  rows={2}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter billing address"
                />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className={`p-6 rounded-lg border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('sales.addItem')}
              </h2>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('common.search') + '...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Products List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No products found. Add products first.
                </p>
              ) : (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => addItem(product)}
                  >
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(product.sellingPrice)} • Stock: {product.currentStock} • GST {product.gstRate || 18}%
                      </p>
                    </div>
                    <button
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(product);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Invoice Items & Summary */}
        <div className="space-y-6">
          {/* Invoice Items */}
          <div className={`p-6 rounded-lg border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('sales.items')} ({invoiceItems.length})
            </h2>

            {invoiceItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No items added yet
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {invoiceItems.map(item => {
                  const lineTotal = item.product.sellingPrice * item.quantity;
                  
                  return (
                    <div
                      key={item.product.id}
                      className={`p-3 rounded-lg border ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            GST {item.product.gstRate || 18}% • {formatCurrency(item.product.sellingPrice)}/unit
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className={`px-2 py-1 rounded text-sm ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                          >
                            -
                          </button>
                          <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className={`px-2 py-1 rounded text-sm ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                            disabled={item.quantity >= item.product.currentStock}
                          >
                            +
                          </button>
                        </div>
                        <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(lineTotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          {invoiceItems.length > 0 && (
            <div className={`p-6 rounded-lg border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('reports.summary')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('sales.items')}:</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                    {invoiceItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('sales.subtotal')}:</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                    {formatCurrency(
                      invoiceItems.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>GST:</span>
                  <span className="text-green-600">Will be calculated</span>
                </div>
              </div>
            </div>
          )}

          {/* Generate Invoice Button */}
          {invoiceItems.length > 0 && customerData.name && (
            <button
              onClick={handleGenerateInvoice}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Receipt className="w-5 h-5" />
              {t('sales.generateInvoice')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}