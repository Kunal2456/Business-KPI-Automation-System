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
} from "lucide-react";
import { formatCurrency } from "../utils/kpiCalculations";

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, "id">) => void;
  onUpdateProduct: (
    id: string,
    updates: Partial<Product>,
  ) => void;
  darkMode: boolean;
}

export function ProductManagement({
  products,
  onAddProduct,
  onUpdateProduct,
  darkMode,
}: ProductManagementProps) {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
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
  });

  // Predefined categories
  const predefinedCategories = [
    "Groceries",
    "Alcohol",
    "Sports",
    "Beverages",
    "Dairy Products",
    "Bakery",
    "Fruits & Vegetables",
    "Meat & Seafood",
    "Frozen Foods",
    "Snacks",
    "Personal Care",
    "Household Items",
    "Electronics",
    "Clothing",
    "Toys & Games",
    "Stationery",
    "Health & Wellness",
    "Other",
  ];

  const categories = Array.from(
    new Set(products.map((p) => p.category)),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      nextRestockDate: formData.nextRestockDate
        ? new Date(formData.nextRestockDate)
        : undefined,
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      onAddProduct(productData);
    }

    setFormData({
      name: "",
      category: "",
      costPrice: 0,
      sellingPrice: 0,
      currentStock: 0,
      reorderLevel: 0,
      nextRestockDate: "",
    });
    setShowAddForm(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
      nextRestockDate: product.nextRestockDate
        ? product.nextRestockDate.toISOString().split("T")[0]
        : "",
    });
    setShowAddForm(true);
  };

  const handleStockUpdate = (
    productId: string,
    adjustment: number,
  ) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      onUpdateProduct(productId, {
        currentStock: Math.max(
          0,
          product.currentStock + adjustment,
        ),
        lastRestocked:
          adjustment > 0 ? new Date() : product.lastRestocked,
      });
    }
  };

  const filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category === filterCategory);

  const lowStockProducts = products.filter(
    (p) => p.currentStock <= p.reorderLevel,
  );

  const searchResults = filteredProducts.filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1
            className={`mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {t('products.title')}
          </h1>
          <p
            className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {t('products.subtitle')}
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
            setFormData({
              name: "",
              category: "",
              costPrice: 0,
              sellingPrice: 0,
              currentStock: 0,
              reorderLevel: 0,
              nextRestockDate: "",
            });
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          {t('products.addProduct')}
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div
          className={`${darkMode ? "bg-orange-900/30 border-orange-800" : "bg-orange-50 border-orange-200"} border rounded-lg p-3 sm:p-4`}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm sm:text-base ${darkMode ? "text-orange-300" : "text-orange-900"}`}
              >
                {t('products.lowStockWarning', { count: lowStockProducts.length })}
              </p>
              <p
                className={`text-xs sm:text-sm mt-1 ${darkMode ? "text-orange-400" : "text-orange-700"} break-words`}
              >
                {lowStockProducts
                  .slice(0, 3)
                  .map((p) => p.name)
                  .join(", ")}
                {lowStockProducts.length > 3 &&
                  ` and ${lowStockProducts.length - 3} more`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div
          className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-lg shadow p-4 sm:p-6 border`}
        >
          <h2
            className={`mb-4 text-lg sm:text-xl ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {editingProduct
              ? t('products.editProduct')
              : t('products.addNewProduct')}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            <div>
              <label
                className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t('products.productName')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t('products.category')}
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              >
                <option value="">{t('products.selectCategory')}</option>
                {predefinedCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t('products.costPrice')}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.costPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    costPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : 0,
                  })
                }
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t('products.sellingPrice')}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellingPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : 0,
                  })
                }
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t('products.currentStock')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.currentStock || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentStock: e.target.value
                      ? parseInt(e.target.value)
                      : 0,
                  })
                }
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t('products.reorderLevel')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.reorderLevel || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reorderLevel: e.target.value
                      ? parseInt(e.target.value)
                      : 0,
                  })
                }
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label
                className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                {t('products.nextRestockDate')}
              </label>
              <input
                type="date"
                value={formData.nextRestockDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nextRestockDate: e.target.value,
                  })
                }
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                {editingProduct
                  ? t('products.updateProduct')
                  : t('products.addProduct')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
                className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Dropdown */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`px-4 py-2.5 border rounded-lg text-sm sm:text-base ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="all">{t('products.allCategories')}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Search Bar */}
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('products.searchPlaceholder')}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm sm:text-base ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {searchResults.map((product) => {
          const isLowStock =
            product.currentStock <= product.reorderLevel;
          const margin = (
            ((product.sellingPrice - product.costPrice) /
              product.sellingPrice) *
            100
          ).toFixed(1);

          return (
            <div
              key={product.id}
              className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow border p-4 sm:p-6`}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                  <div
                    className={`p-2 sm:p-3 ${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"} rounded-lg flex-shrink-0`}
                  >
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`text-base sm:text-lg truncate ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {product.name}
                    </h3>
                    <p
                      className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-0.5 sm:mt-1 text-sm`}
                    >
                      {product.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => startEdit(product)}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                    darkMode
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Edit product"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <p
                    className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {t('products.costPrice')}
                  </p>
                  <p
                    className={`text-sm sm:text-base mt-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {formatCurrency(product.costPrice)}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {t('products.sellingPrice')}
                  </p>
                  <p
                    className={`text-sm sm:text-base mt-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {formatCurrency(product.sellingPrice)}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {t('products.currentStock')}
                  </p>
                  <p
                    className={`text-sm sm:text-base mt-0.5 ${isLowStock ? "text-orange-600 font-medium" : darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {product.currentStock} {t('products.units')}
                    {isLowStock && " ⚠️"}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {t('products.profitMargin')}
                  </p>
                  <p
                    className={`text-sm sm:text-base mt-0.5 ${darkMode ? "text-green-400" : "text-green-600"}`}
                  >
                    {margin}%
                  </p>
                </div>
              </div>

              {product.nextRestockDate && (
                <div
                  className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg ${darkMode ? "bg-blue-900/30 border-blue-800" : "bg-blue-50 border-blue-200"} border`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                    <p
                      className={`text-xs sm:text-sm ${darkMode ? "text-blue-300" : "text-blue-900"}`}
                    >
                      {t('products.restockScheduled')}:{" "}
                      {product.nextRestockDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {product.lastRestocked && (
                <p
                  className={`text-xs sm:text-sm mb-3 sm:mb-4 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                >
                  {t('products.lastRestocked')}:{" "}
                  {product.lastRestocked.toLocaleDateString()}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() =>
                    handleStockUpdate(product.id, 10)
                  }
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  {t('products.add10')}
                </button>
                <button
                  onClick={() =>
                    handleStockUpdate(product.id, -10)
                  }
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  disabled={product.currentStock < 10}
                >
                  {t('products.remove10')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {searchResults.length === 0 && (
        <div
          className={`text-center py-8 sm:py-12 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
          <p className="text-sm sm:text-base">
            {t('products.noProducts')}
          </p>
        </div>
      )}
    </div>
  );
}