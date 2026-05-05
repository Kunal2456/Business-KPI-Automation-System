import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Product } from "../types";
import {
  Plus,
  Package,
  Edit,
  AlertCircle,
  Calendar,
  Search,
  FileText,
} from "lucide-react";
import { formatCurrency } from "../utils/kpiCalculations";
import {
  GST_RATES,
  GSTRate,
  getPriceIncludingGST,
  getPriceExcludingGST,
  GSTRateBadge,
} from "../utils/gstCalculations";

interface ProductWithGST extends Product {
  gstRate: GSTRate;
  hsnCode?: string;
  priceIncludesGST?: boolean;
}

interface ProductManagementWithGSTProps {
  products: ProductWithGST[];
  onAddProduct: (product: Omit<ProductWithGST, "id">) => void;
  onUpdateProduct: (
    id: string,
    updates: Partial<ProductWithGST>,
  ) => void;
  darkMode: boolean;
}

export function ProductManagementWithGST({
  products,
  onAddProduct,
  onUpdateProduct,
  darkMode,
}: ProductManagementWithGSTProps) {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithGST | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    costPrice: 0,
    sellingPrice: 0,
    currentStock: 0,
    reorderLevel: 0,
    nextRestockDate: "",
    gstRate: 18 as GSTRate,
    hsnCode: "",
    priceIncludesGST: true,
  });

  // Predefined categories with typical GST rates
  const categoryGSTMapping: Record<string, GSTRate> = {
    Groceries: 0,
    Beverages: 12,
    "Dairy Products": 5,
    Bakery: 5,
    "Fruits & Vegetables": 0,
    "Meat & Seafood": 0,
    "Frozen Foods": 12,
    Snacks: 12,
    "Personal Care": 18,
    "Household Items": 18,
    Electronics: 18,
    Clothing: 5,
    "Toys & Games": 12,
    Stationery: 12,
    "Health & Wellness": 12,
    "Luxury Items": 28,
    Alcohol: 18,
    Sports: 18,
    Other: 18,
  };

  const predefinedCategories = Object.keys(categoryGSTMapping);

  const categories = Array.from(
    new Set(products.map((p) => p.category)),
  );

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filterCategory === "all" ||
      product.category === filterCategory;
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (product.hsnCode &&
        product.hsnCode.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, formData);
      setEditingProduct(null);
    } else {
      onAddProduct(formData);
    }

    setFormData({
      name: "",
      category: "",
      costPrice: 0,
      sellingPrice: 0,
      currentStock: 0,
      reorderLevel: 0,
      nextRestockDate: "",
      gstRate: 18,
      hsnCode: "",
      priceIncludesGST: true,
    });
    setShowAddForm(false);
  };

  const startEdit = (product: ProductWithGST) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
      nextRestockDate: product.nextRestockDate
        ? new Date(product.nextRestockDate)
            .toISOString()
            .split("T")[0]
        : "",
      gstRate: product.gstRate || 18,
      hsnCode: product.hsnCode || "",
      priceIncludesGST: product.priceIncludesGST !== false,
    });
    setShowAddForm(true);
  };

  const calculatePriceBreakdown = (
    price: number,
    gstRate: GSTRate,
    includesGST: boolean,
  ) => {
    if (includesGST) {
      const basePrice = getPriceExcludingGST(price, gstRate);
      const gstAmount = price - basePrice;
      return { basePrice, gstAmount };
    } else {
      const totalPrice = getPriceIncludingGST(price, gstRate);
      const gstAmount = totalPrice - price;
      return { basePrice: price, gstAmount };
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
      gstRate: categoryGSTMapping[category] || 18,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {t('products.title')}
          </h1>
          <p
            className={
              darkMode ? "text-gray-400" : "text-gray-600"
            }
          >
            Manage inventory with GST calculations
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          {t('products.addProduct')}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('common.search') + '...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div
          className={`p-6 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {editingProduct
              ? t('products.editProduct')
              : t('products.addProduct')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t('products.productName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t('products.category')} *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    handleCategoryChange(e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Select Category</option>
                  {predefinedCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} (GST {categoryGSTMapping[cat]}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t('products.hsnCode')}
                </label>
                <input
                  type="text"
                  placeholder="e.g., 8471"
                  value={formData.hsnCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hsnCode: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  4, 6, or 8 digit Harmonized System code
                </p>
              </div>

              <div>
                <label
                  className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t('products.gstRate')} *
                </label>
                <select
                  required
                  value={formData.gstRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gstRate: Number(
                        e.target.value,
                      ) as GSTRate,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value={0}>
                    0% - Exempt (Vegetables, Milk)
                  </option>
                  <option value={5}>
                    5% - Essential (Tea, Coffee, Sugar)
                  </option>
                  <option value={12}>
                    12% - Standard (Processed Food)
                  </option>
                  <option value={18}>
                    18% - Standard (Electronics, Soaps)
                  </option>
                  <option value={28}>
                    28% - Luxury (Cars, AC)
                  </option>
                </select>
              </div>

              <div>
                <label
                  className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t('products.costPrice')} (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      costPrice: parseFloat(e.target.value),
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t('products.sellingPrice')} (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sellingPrice: parseFloat(e.target.value),
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="includesGST"
                    checked={formData.priceIncludesGST}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceIncludesGST: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="includesGST"
                    className="text-sm text-gray-600"
                  >
                    Price includes GST
                  </label>
                </div>
              </div>

              <div>
                <label
                  className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t('products.currentStock')} *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentStock: parseInt(e.target.value),
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t('products.reorderLevel')} *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.reorderLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reorderLevel: parseInt(e.target.value),
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            {/* GST Price Breakdown */}
            {formData.sellingPrice > 0 && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h3 className="font-semibold mb-2 text-indigo-900 dark:text-indigo-300">
                  GST Price Breakdown
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Base Price
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(
                        calculatePriceBreakdown(
                          formData.sellingPrice,
                          formData.gstRate,
                          formData.priceIncludesGST,
                        ).basePrice,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      GST ({formData.gstRate}%)
                    </p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(
                        calculatePriceBreakdown(
                          formData.sellingPrice,
                          formData.gstRate,
                          formData.priceIncludesGST,
                        ).gstAmount,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Total Price
                    </p>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(
                        formData.priceIncludesGST
                          ? formData.sellingPrice
                          : getPriceIncludingGST(
                              formData.sellingPrice,
                              formData.gstRate,
                            ),
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {editingProduct
                  ? t('products.productUpdated')
                  : t('products.addProduct')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
                className={`px-6 py-2 rounded-lg transition ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div
        className={`rounded-lg border overflow-hidden ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }
            >
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('products.productName')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('products.hsnCode')} / GST
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('products.price')} (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('products.stock')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('common.edit')}
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
            >
              {filteredProducts.map((product) => {
                const breakdown = calculatePriceBreakdown(
                  product.sellingPrice,
                  product.gstRate,
                  product.priceIncludesGST !== false,
                );

                return (
                  <tr
                    key={product.id}
                    className={
                      darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="w-8 h-8 text-indigo-600 mr-3" />
                        <div>
                          <div
                            className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            {product.name}
                          </div>
                          <div
                            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div
                          className={
                            darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }
                        >
                          {product.hsnCode || "N/A"}
                        </div>
                        <GSTRateBadge rate={product.gstRate} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {formatCurrency(product.sellingPrice)}
                      </div>
                      <div
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Base:{" "}
                        {formatCurrency(breakdown.basePrice)}
                      </div>
                      <div className="text-xs text-green-600">
                        GST:{" "}
                        {formatCurrency(breakdown.gstAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.currentStock <=
                        product.reorderLevel ? (
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                        ) : null}
                        <span
                          className={`${
                            product.currentStock <=
                            product.reorderLevel
                              ? "text-red-600"
                              : darkMode
                                ? "text-white"
                                : "text-gray-900"
                          }`}
                        >
                          {product.currentStock}
                        </span>
                        <span
                          className={`ml-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          units
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => startEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {t('dashboard.cards.totalProducts')}
          </p>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {filteredProducts.length}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Total Stock Value
          </p>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {formatCurrency(
              filteredProducts.reduce(
                (sum, p) =>
                  sum + p.currentStock * p.sellingPrice,
                0,
              ),
            )}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {t('dashboard.cards.lowStock')}
          </p>
          <p className={`text-2xl font-bold text-red-600`}>
            {
              filteredProducts.filter(
                (p) => p.currentStock <= p.reorderLevel,
              ).length
            }
          </p>
        </div>
      </div>
    </div>
  );
}