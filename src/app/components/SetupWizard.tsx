import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../types';
import { ArrowRight, ArrowLeft, Check, Store, Package, Rocket, Sparkles, Home } from 'lucide-react';

interface SetupWizardProps {
  onComplete: (data: { businessName: string; products: Product[] }) => void;
  onSkip: () => void;
  onLoadDemo?: () => void;
  onBack?: () => void;
}

export function SetupWizard({ onComplete, onSkip, onLoadDemo, onBack }: SetupWizardProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [products, setProducts] = useState<Array<{
    name: string;
    category: string;
    costPrice: string;
    sellingPrice: string;
    currentStock: string;
    reorderLevel: string;
  }>>([
    { name: '', category: '', costPrice: '', sellingPrice: '', currentStock: '', reorderLevel: '' }
  ]);

  const addProductRow = () => {
    setProducts([...products, { 
      name: '', 
      category: '', 
      costPrice: '', 
      sellingPrice: '', 
      currentStock: '', 
      reorderLevel: '' 
    }]);
  };

  const removeProductRow = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: string, value: string) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleComplete = () => {
    const validProducts = products.filter(p => 
      p.name && p.category && p.costPrice && p.sellingPrice && p.currentStock && p.reorderLevel
    );

    const productData: Product[] = validProducts.map((p, index) => ({
      id: `P${Date.now()}-${index}`,
      name: p.name,
      category: p.category,
      costPrice: parseFloat(p.costPrice),
      sellingPrice: parseFloat(p.sellingPrice),
      currentStock: parseInt(p.currentStock),
      reorderLevel: parseInt(p.reorderLevel),
      lastRestocked: new Date()
    }));

    onComplete({ businessName, products: productData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 relative">
      {/* Floating Explore Demo Button */}
      {onLoadDemo && (
        <button
          onClick={onLoadDemo}
          className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-all hover:scale-110 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white group"
          title="Explore with Demo Data"
        >
          <Sparkles className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gray-900 text-white">
            Explore Demo
          </span>
        </button>
      )}

      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-8">
        {/* Back to Welcome Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Welcome Screen</span>
          </button>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">{t('setup.stepOf', { current: step, total: 3 })}</span>
            <button
              onClick={onSkip}
              className="text-indigo-600 hover:text-indigo-700"
            >
              {t('setup.skipSetup')}
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
              <Rocket className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-gray-900 mb-4">{t('setup.welcome')}</h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('setup.welcomeMessage')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Store className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-gray-900 mb-2">{t('setup.businessInfo')}</h3>
                <p className="text-gray-600">{t('setup.businessInfoDesc')}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-gray-900 mb-2">{t('setup.addProducts')}</h3>
                <p className="text-gray-600">{t('setup.addProductsDesc')}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-2">{t('setup.youreReady')}</h3>
                <p className="text-gray-600">{t('setup.youreReadyDesc')}</p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              {t('setup.getStarted')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Business Info */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <Store className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-gray-900 mb-2">{t('setup.tellUsAboutBusiness')}</h2>
              <p className="text-gray-600">{t('setup.businessInfoUsage')}</p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">{t('setup.businessName')}</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., ABC Retail Store"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-blue-900">
                  <strong>Optional:</strong> You can add more details like store locations, contact info, and business settings later in the admin panel.
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('common.back')}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!businessName.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.continue')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add Products */}
        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-gray-900 mb-2">{t('setup.addYourProducts')}</h2>
              <p className="text-gray-600">{t('setup.addProductsInstructions')}</p>
            </div>

            <div className="mb-6 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700">Product Name*</th>
                    <th className="px-4 py-2 text-left text-gray-700">Category*</th>
                    <th className="px-4 py-2 text-left text-gray-700">Cost Price*</th>
                    <th className="px-4 py-2 text-left text-gray-700">Selling Price*</th>
                    <th className="px-4 py-2 text-left text-gray-700">Stock*</th>
                    <th className="px-4 py-2 text-left text-gray-700">Reorder*</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          placeholder="Rice 1kg"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={product.category}
                          onChange={(e) => updateProduct(index, 'category', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          placeholder="Groceries"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={product.costPrice}
                          onChange={(e) => updateProduct(index, 'costPrice', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          placeholder="40"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={product.sellingPrice}
                          onChange={(e) => updateProduct(index, 'sellingPrice', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          placeholder="60"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={product.currentStock}
                          onChange={(e) => updateProduct(index, 'currentStock', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          placeholder="100"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={product.reorderLevel}
                          onChange={(e) => updateProduct(index, 'reorderLevel', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          placeholder="20"
                        />
                      </td>
                      <td className="px-4 py-2">
                        {products.length > 1 && (
                          <button
                            onClick={() => removeProductRow(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addProductRow}
              className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('setup.addAnotherProduct')}
            </button>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-6">
              <p className="text-yellow-900">
                <strong>Tip:</strong> You can also import products in bulk using CSV files from the Data Management section after setup.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('common.back')}
              </button>
              <button
                onClick={handleComplete}
                disabled={!products.some(p => p.name && p.category && p.costPrice && p.sellingPrice && p.currentStock && p.reorderLevel)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                {t('setup.completeSetup')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}