import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { User, Product, Sale, Alert } from './types';
import { mockUsers, mockProducts, mockSales, STORES } from './utils/mockData';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { SalesManagement } from './components/SalesManagement';
import { ProductManagement } from './components/ProductManagement';
import { Reports } from './components/Reports';
import { DataImportAdvanced as DataImport } from './components/DataImportAdvanced';
import { SetupWizard } from './components/SetupWizard';
import { UserManagement } from './components/UserManagement';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LandingPage } from './components/landing/LandingPage';
import { InvoiceMaker } from './components/InvoiceMaker';
import { GSTReports } from './components/GSTReports';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import VendorManagement from './components/VendorManagement';
import PurchaseOrders from './components/PurchaseOrders';
import GoodsReceiptComponent from './components/GoodsReceipt';
import VendorPayments from './components/VendorPayments';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Upload,
  Moon,
  Sun,
  Bell,
  Users,
  Wand2,
  Settings,
  Home,
  Receipt,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileBarChart,
  Truck,
  FileText as PurchaseOrderIcon,
  PackageCheck,
  DollarSign
} from 'lucide-react';

type Page = 'dashboard' | 'sales' | 'products' | 'reports' | 'data-import' | 'user-management' | 'gst-invoice' | 'gst-reports' | 'vendors' | 'purchase-orders' | 'goods-receipt' | 'vendor-payments';

function App() {
  const { t } = useTranslation();
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>('All Stores');
  const [showAlerts, setShowAlerts] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [procurementExpanded, setProcurementExpanded] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Check if user has visited before
  useEffect(() => {
    const hasVisitedApp = localStorage.getItem('hasVisitedApp');
    if (hasVisitedApp) {
      setShowLandingPage(false);
    }
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedSales = localStorage.getItem('sales');
    const savedBusinessName = localStorage.getItem('businessName');
    const hasCompletedSetup = localStorage.getItem('setupCompleted');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedUsers = localStorage.getItem('users');
    
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
    }

    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load users from localStorage or use mockUsers as default
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers(mockUsers);
        localStorage.setItem('users', JSON.stringify(mockUsers));
      }
    } else {
      // First time - save mockUsers to localStorage
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }

    // Show welcome screen if no data and no setup completed
    if (!savedProducts && !savedSales && !hasCompletedSetup) {
      setShowWelcomeScreen(true);
      return;
    }
    
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      setProducts(parsedProducts.map((p: any) => ({
        ...p,
        lastRestocked: p.lastRestocked ? new Date(p.lastRestocked) : undefined,
        nextRestockDate: p.nextRestockDate ? new Date(p.nextRestockDate) : undefined
      })));
    }
    
    if (savedSales) {
      const parsedSales = JSON.parse(savedSales);
      setSales(parsedSales.map((sale: any) => ({
        ...sale,
        saleDate: new Date(sale.saleDate)
      })));
    }
  }, []);

  // Generate alerts based on products
  useEffect(() => {
    if (products.length > 0) {
      const newAlerts: Alert[] = [];
      const today = new Date();
      
      products.forEach(product => {
        // Low stock alert
        if (product.currentStock <= product.reorderLevel) {
          newAlerts.push({
            id: `alert-low-${product.id}`,
            type: 'low-stock',
            productId: product.id,
            productName: product.name,
            message: `${product.name} is running low on stock (${product.currentStock} units)`,
            date: today,
            read: false
          });
        }
        
        // Restock due alert
        if (product.nextRestockDate && product.nextRestockDate <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)) {
          newAlerts.push({
            id: `alert-restock-${product.id}`,
            type: 'restock-due',
            productId: product.id,
            productName: product.name,
            message: `${product.name} restock scheduled for ${product.nextRestockDate.toLocaleDateString()}`,
            date: today,
            read: false
          });
        }
        
        // Dead stock alert (no sales in 30 days)
        const productSales = sales.filter(s => s.productId === product.id);
        const last30Days = productSales.filter(s => {
          const daysDiff = (today.getTime() - s.saleDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 30;
        });
        
        if (last30Days.length === 0 && product.currentStock > 0) {
          newAlerts.push({
            id: `alert-dead-${product.id}`,
            type: 'dead-stock',
            productId: product.id,
            productName: product.name,
            message: `${product.name} has no sales in the last 30 days`,
            date: today,
            read: false
          });
        }
      });
      
      setAlerts(newAlerts);
    }
  }, [products, sales]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (sales.length > 0) {
      localStorage.setItem('sales', JSON.stringify(sales));
    }
  }, [sales]);

  useEffect(() => {
    if (businessName) {
      localStorage.setItem('businessName', businessName);
    }
  }, [businessName]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save users to localStorage whenever users array changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  // Set store filter based on user role
  useEffect(() => {
    if (currentUser?.role === 'manager' && currentUser.storeLocation) {
      setSelectedStore(currentUser.storeLocation);
    }
  }, [currentUser]);

  const handleSetupComplete = (data: { businessName: string; products: Product[] }) => {
    setBusinessName(data.businessName);
    setProducts(data.products);
    setSales([]);
    localStorage.setItem('setupCompleted', 'true');
    setShowSetupWizard(false);
  };

  const handleSkipSetup = () => {
    setProducts(mockProducts);
    setSales(mockSales);
    localStorage.setItem('setupCompleted', 'true');
    setShowSetupWizard(false);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMobileMenuOpen(false);
    setCurrentPage('dashboard');
    setSelectedStore('All Stores');
  };

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `P${Date.now()}`
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleAddSale = (sale: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...sale,
      id: `S${Date.now()}`
    };
    
    // Update product stock
    const product = products.find(p => p.id === sale.productId);
    if (product && product.currentStock >= sale.quantity) {
      handleUpdateProduct(sale.productId, {
        currentStock: product.currentStock - sale.quantity
      });
      setSales([newSale, ...sales]);
    } else {
      alert('Insufficient stock!');
    }
  };

  const handleImportProducts = (newProducts: Product[]) => {
    setProducts([...products, ...newProducts]);
  };

  const handleImportSales = (newSales: Sale[]) => {
    setSales([...sales, ...newSales]);
  };

  const handleClearAllData = () => {
    setProducts([]);
    setSales([]);
    localStorage.removeItem('products');
    localStorage.removeItem('sales');
    localStorage.removeItem('setupCompleted');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  // User Management Handlers
  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `U${Date.now()}`
    };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
    // Update currentUser if editing self
    if (userId === currentUser?.id) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  // Welcome Screen Handlers
  const handleStartSetupWizard = () => {
    setShowWelcomeScreen(false);
    setShowSetupWizard(true);
  };

  const handleOpenWelcomeScreen = () => {
    setShowWelcomeScreen(true);
  };

  const handleBackFromWelcome = () => {
    setShowWelcomeScreen(false);
  };

  const handleBackToWelcomeFromSetup = () => {
    setShowSetupWizard(false);
    setShowWelcomeScreen(true);
  };

  const handleLoadDemoData = () => {
    setProducts(mockProducts);
    setSales(mockSales);
    setBusinessName(t('common.demoBusinessName'));
    localStorage.setItem('setupCompleted', 'true');
    setShowWelcomeScreen(false);
    setShowSetupWizard(false);
    // Auto-login as admin for demo experience
    const demoAdmin = mockUsers.find(u => u.role === 'Admin');
    if (demoAdmin) {
      setCurrentUser(demoAdmin);
    }
  };

  const handleStartFresh = () => {
    localStorage.setItem('setupCompleted', 'true');
    setShowWelcomeScreen(false);
  };

  const handleNavigateToApp = () => {
    localStorage.setItem('hasVisitedApp', 'true');
    setShowLandingPage(false);
  };

  const handleBackToLanding = () => {
    setShowLandingPage(true);
    setCurrentUser(null); // Log out user when going back to landing
  };

  // Show Landing Page first for new visitors
  if (showLandingPage) {
    return <LandingPage onNavigateToApp={handleNavigateToApp} />;
  }

  // Show Welcome Screen first
  if (showWelcomeScreen) {
    return (
      <WelcomeScreen
        onStartSetupWizard={handleStartSetupWizard}
        onLoadDemoData={handleLoadDemoData}
        onStartFresh={handleStartFresh}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onBack={() => setShowWelcomeScreen(false)}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  if (showSetupWizard) {
    return (
      <SetupWizard
        onComplete={handleSetupComplete}
        onSkip={handleSkipSetup}
        onLoadDemo={handleLoadDemoData}
        onBack={handleBackToWelcomeFromSetup}
      />
    );
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} users={users} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} onOpenWelcomeScreen={handleOpenWelcomeScreen} />;
  }

  const navigation = [
    { id: 'dashboard' as Page, name: t('navigation.dashboard'), icon: LayoutDashboard, roles: ['admin', 'manager', 'analyst'] },
    { id: 'sales' as Page, name: t('navigation.sales'), icon: ShoppingCart, roles: ['admin', 'manager'] },
    { id: 'products' as Page, name: t('navigation.products'), icon: Package, roles: ['admin', 'manager'] },
    { id: 'reports' as Page, name: t('navigation.reports'), icon: FileText, roles: ['admin', 'manager', 'analyst'] },
    { id: 'data-import' as Page, name: t('navigation.dataImport'), icon: Upload, roles: ['admin', 'manager'] },
    { id: 'user-management' as Page, name: t('navigation.userManagement'), icon: Users, roles: ['admin'] },
    { id: 'gst-invoice' as Page, name: t('navigation.gstInvoice'), icon: Receipt, roles: ['admin', 'manager'] },
    { id: 'gst-reports' as Page, name: t('navigation.gstReports'), icon: FileBarChart, roles: ['admin', 'manager'] }
  ];

  const procurementPages = [
    { id: 'vendors' as Page, name: t('navigation.vendors'), icon: Truck, roles: ['admin', 'manager'] },
    { id: 'purchase-orders' as Page, name: t('navigation.purchaseOrders'), icon: PurchaseOrderIcon, roles: ['admin', 'manager'] },
    { id: 'goods-receipt' as Page, name: t('navigation.goodsReceipt'), icon: PackageCheck, roles: ['admin', 'manager'] },
    { id: 'vendor-payments' as Page, name: t('navigation.vendorPayments'), icon: DollarSign, roles: ['admin', 'manager'] }
  ];

  const accessiblePages = navigation.filter(nav => nav.roles.includes(currentUser.role));
  const unreadAlerts = alerts.filter(a => !a.read).length;

  // Filter data based on selected store
  const getFilteredSales = () => {
    if (selectedStore === 'All Stores') return sales;
    return sales.filter(s => s.storeLocation === selectedStore);
  };

  const availableStores = currentUser.role === 'admin' 
    ? STORES 
    : currentUser.storeLocation 
    ? [currentUser.storeLocation, 'All Stores']
    : STORES;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <div className={`lg:hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-3 sm:px-4 py-3 flex items-center justify-between sticky top-0 z-40`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <LayoutDashboard className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('common.appTitle')}</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} hidden sm:block`}>{businessName || 'Retail Analytics'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`relative p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}
            aria-label="Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                {unreadAlerts > 9 ? '9+' : unreadAlerts}
              </span>
            )}
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <LanguageSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Alerts Panel */}
      {showAlerts && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowAlerts(false)}
          />
          {/* Panel */}
          <div className={`fixed top-14 sm:top-16 right-2 sm:right-4 w-[calc(100vw-16px)] max-w-sm max-h-[70vh] sm:max-h-96 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50`}>
            <div className={`p-3 sm:p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Alerts ({alerts.length})
                </h3>
                <button 
                  onClick={() => setShowAlerts(false)}
                  className={`p-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(70vh-60px)] sm:max-h-80">
              {alerts.length === 0 ? (
                <p className={`p-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No alerts</p>
              ) : (
                alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 sm:p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${alert.read ? (darkMode ? 'bg-gray-900' : 'bg-gray-50') : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium mb-1 ${
                          alert.type === 'low-stock' ? 'text-orange-500' :
                          alert.type === 'dead-stock' ? 'text-red-500' :
                          'text-blue-500'
                        }`}>
                          {alert.type === 'low-stock' ? '🔴 Low Stock' :
                           alert.type === 'dead-stock' ? '⚠️ Dead Stock' :
                           '📅 Restock Due'}
                        </p>
                        <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} break-words`}>
                          {alert.message}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                          {alert.date.toLocaleDateString()}
                        </p>
                      </div>
                      {!alert.read && (
                        <button
                          onClick={() => markAlertAsRead(alert.id)}
                          className={`text-xs px-2 py-1 ${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'} rounded whitespace-nowrap transition-colors`}
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentUser.name}</p>
                <p className={`text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentUser.role}</p>
                {currentUser.storeLocation && (
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} truncate`}>{currentUser.storeLocation}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Store Filter */}
          {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
            <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <label className={`block text-xs sm:text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.filterByStore')}</label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className={`w-full px-3 py-2 text-sm border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-lg focus:ring-2 focus:ring-indigo-500`}
              >
                {availableStores.map(store => (
                  <option key={store} value={store}>
                    {store === 'All Stores' ? t('common.allStores') : store}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <nav className="px-2 py-3">
            {accessiblePages.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors text-sm ${
                    currentPage === item.id
                      ? 'bg-indigo-600 text-white'
                      : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}

            {/* Procurement Section - Collapsible */}
            {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
              <div className="mb-1">
                <button
                  onClick={() => setProcurementExpanded(!procurementExpanded)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{t('procurement.title')}</span>
                  </div>
                  {procurementExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Procurement Submenu */}
                {procurementExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {procurementPages.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentPage(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            currentPage === item.id
                              ? 'bg-indigo-600 text-white'
                              : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 mb-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('common.language')}
                </span>
                <LanguageSwitcher />
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'} transition-colors mt-2 text-sm`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`hidden lg:flex lg:flex-col ${sidebarCollapsed ? 'w-20' : 'w-64 xl:w-72'} min-h-screen ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ease-in-out`}
        >
          {/* Scrollable container - NO SCROLLBAR */}
          <div className="flex-1 p-4 xl:p-6 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Logo & Brand - NOW CLICKABLE TOGGLE */}
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} mb-6 xl:mb-8 transition-all`}>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95 shadow-lg group relative"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <LayoutDashboard className="w-5 h-5 text-white" />
                {/* Pulse ring on hover */}
                <span className="absolute inset-0 rounded-lg bg-indigo-400 animate-ping opacity-0 group-hover:opacity-30"></span>
                
                {/* Arrow indicator */}
                <div className={`absolute -right-1 -bottom-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-md border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}>
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-3 h-3 text-indigo-600" />
                  ) : (
                    <ChevronLeft className="w-3 h-3 text-indigo-600" />
                  )}
                </div>
              </button>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1 transition-opacity duration-200">
                  <h1 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>ShelfIQ</h1>
                  <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{businessName || 'Smart Inventory Intelligence'}</p>
                </div>
              )}
            </div>

            {/* User Profile */}
            {!sidebarCollapsed && (
              <div className={`mb-4 xl:mb-6 p-3 xl:p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg transition-all duration-200`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentUser.name}</p>
                    <p className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentUser.role}</p>
                    {currentUser.storeLocation && (
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} truncate`}>{currentUser.storeLocation}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed User Avatar */}
            {sidebarCollapsed && (
              <div className="mb-4 xl:mb-6 flex justify-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

            {/* Store Filter */}
            {!sidebarCollapsed && (currentUser.role === 'admin' || currentUser.role === 'manager') && (
              <div className="mb-4 xl:mb-6 transition-all duration-200">
                <label className={`block text-xs xl:text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('common.filterByStore')}</label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                >
                  {availableStores.map(store => (
                    <option key={store} value={store}>{store}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1">
              {accessiblePages.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3 xl:px-4'} py-2.5 xl:py-3 rounded-lg transition-all text-sm xl:text-base group relative ${
                      currentPage === item.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.name}</span>}

                    {/* Tooltip for collapsed mode */}
                    {sidebarCollapsed && (
                      <div className={`absolute left-full ml-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-900 text-white'} text-sm font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-xl z-50`}>
                        {item.name}
                        <div className={`absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-[6px] border-transparent border-r-gray-900`} />
                      </div>
                    )}
                  </motion.button>
                );
              })}

              {/* Procurement Section - Collapsible */}
              {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                <div>
                  <button
                    onClick={() => setProcurementExpanded(!procurementExpanded)}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3 xl:px-4'} py-2.5 xl:py-3 rounded-lg transition-all text-sm xl:text-base group relative ${
                      darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={sidebarCollapsed ? t('procurement.title') : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{t('procurement.title')}</span>}
                    </div>
                    {!sidebarCollapsed && (
                      procurementExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}

                    {/* Tooltip for collapsed mode */}
                    {sidebarCollapsed && (
                      <div className={`absolute left-full ml-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-xl z-50`}>
                        {t('procurement.title')}
                        <div className={`absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-[6px] border-transparent border-r-gray-900`} />
                      </div>
                    )}
                  </button>

                  {/* Procurement Submenu */}
                  {procurementExpanded && !sidebarCollapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {procurementPages.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full flex items-center gap-3 px-3 xl:px-4 py-2 xl:py-2.5 rounded-lg transition-all text-sm group relative ${
                              currentPage === item.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Bottom Actions - NO SCROLLBAR */}
          <div className={`p-4 xl:p-6 space-y-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto scrollbar-hide`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={handleBackToLanding}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3 xl:px-4'} py-2.5 xl:py-3 rounded-lg ${darkMode ? 'text-indigo-400 hover:bg-indigo-900/20' : 'text-indigo-600 hover:bg-indigo-50'} transition-colors text-sm xl:text-base group relative`}
              title={sidebarCollapsed ? 'Back to Homepage' : undefined}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">Back to Homepage</span>}
              {sidebarCollapsed && (
                <div className={`absolute left-full ml-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-xl z-50`}>
                  Back to Homepage
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-[6px] border-transparent border-r-gray-900`} />
                </div>
              )}
            </button>
            
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3 xl:px-4'} py-2.5 xl:py-3 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors relative text-sm xl:text-base group`}
              title={sidebarCollapsed ? 'Alerts' : undefined}
            >
              <Bell className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">Alerts</span>}
              {unreadAlerts > 0 && (
                <span className={`${sidebarCollapsed ? 'absolute -top-1 -right-1' : 'absolute right-3 top-1/2 -translate-y-1/2'} min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center`}>
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </span>
              )}
              {sidebarCollapsed && (
                <div className={`absolute left-full ml-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-xl z-50`}>
                  Alerts {unreadAlerts > 0 && `(${unreadAlerts})`}
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-[6px] border-transparent border-r-gray-900`} />
                </div>
              )}
            </button>
            
            <button
              onClick={handleOpenWelcomeScreen}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3 xl:px-4'} py-2.5 xl:py-3 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors text-sm xl:text-base group relative`}
              title={sidebarCollapsed ? 'Setup Wizard' : undefined}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">Setup Wizard</span>}
              {sidebarCollapsed && (
                <div className={`absolute left-full ml-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-xl z-50`}>
                  Setup Wizard
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-[6px] border-transparent border-r-gray-900`} />
                </div>
              )}
            </button>

            <button
              onClick={toggleDarkMode}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3 xl:px-4'} py-2.5 xl:py-3 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors text-sm xl:text-base group relative`}
              title={sidebarCollapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : undefined}
            >
              {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
              {!sidebarCollapsed && <span className="truncate">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              {sidebarCollapsed && (
                <div className={`absolute left-full ml-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-xl z-50`}>
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-[6px] border-transparent border-r-gray-900`} />
                </div>
              )}
            </button>

            <div className={`${sidebarCollapsed ? 'flex justify-center' : ''}`}>
              <LanguageSwitcher />
            </div>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3 xl:px-4'} py-2.5 xl:py-3 rounded-lg ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'} transition-colors text-sm xl:text-base group relative`}
              title={sidebarCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">Logout</span>}
              {sidebarCollapsed && (
                <div className={`absolute left-full ml-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-xl z-50`}>
                  Logout
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-[6px] border-transparent border-r-gray-900`} />
                </div>
              )}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64 xl:ml-72'} transition-all duration-300 ease-in-out relative`}>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {currentPage === 'dashboard' && <Dashboard sales={getFilteredSales()} products={products} selectedStore={selectedStore} darkMode={darkMode} />}
            {currentPage === 'sales' && <SalesManagement sales={getFilteredSales()} products={products} onAddSale={handleAddSale} selectedStore={selectedStore} darkMode={darkMode} />}
            {currentPage === 'products' && <ProductManagement products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} darkMode={darkMode} />}
            {currentPage === 'reports' && <Reports sales={getFilteredSales()} products={products} selectedStore={selectedStore} darkMode={darkMode} />}
            {currentPage === 'data-import' && (
              <DataImport
                products={products}
                sales={sales}
                onImportProducts={handleImportProducts}
                onImportSales={handleImportSales}
                onClearAllData={handleClearAllData}
                darkMode={darkMode}
                onNavigateToDashboard={() => setCurrentPage('dashboard')}
              />
            )}
            {currentPage === 'user-management' && (
              <UserManagement
                users={users}
                onAddUser={handleAddUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                currentUser={currentUser}
                darkMode={darkMode}
                stores={STORES}
              />
            )}
            {currentPage === 'gst-invoice' && (
              <InvoiceMaker
                products={products}
                sales={sales}
                darkMode={darkMode}
              />
            )}
            {currentPage === 'gst-reports' && (
              <GSTReports
                invoices={[]} // TODO: Store generated invoices in state
                darkMode={darkMode}
              />
            )}
            {currentPage === 'vendors' && <VendorManagement />}
            {currentPage === 'purchase-orders' && <PurchaseOrders />}
            {currentPage === 'goods-receipt' && <GoodsReceiptComponent />}
            {currentPage === 'vendor-payments' && <VendorPayments />}
          </div>
        </main>
      </div>
    </div>
  );
}

// Wrap App with Suspense for i18n
function AppWithI18n() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <App />
    </Suspense>
  );
}

export default AppWithI18n;