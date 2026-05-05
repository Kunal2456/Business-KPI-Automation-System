import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Building2, Mail, Phone, MapPin, Star, TrendingUp, AlertCircle, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Vendor, VendorStatus, VendorCategory } from '../types';
import { mockVendors } from '../mockVendorData';

export default function VendorManagement() {
  const { t } = useTranslation();
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VendorStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<VendorCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: 'rawMaterials' as VendorCategory,
    paymentTerms: 'net30',
    status: 'active' as VendorStatus,
    website: ''
  });

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      category: 'rawMaterials' as VendorCategory,
      paymentTerms: 'net30',
      status: 'active' as VendorStatus,
      website: ''
    });
    setEditingVendor(null);
  };

  const handleAddVendor = () => {
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const newVendor: Vendor = {
      id: `V${Date.now()}`,
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      category: formData.category,
      paymentTerms: formData.paymentTerms,
      status: formData.status,
      website: formData.website,
      totalOrders: 0,
      totalSpent: 0,
      outstandingBalance: 0,
      rating: 0,
      onTimeDeliveryRate: 0
    };

    setVendors([...vendors, newVendor]);
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateVendor = () => {
    if (!editingVendor || !formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setVendors(vendors.map(v =>
      v.id === editingVendor.id
        ? { ...v, ...formData }
        : v
    ));
    setShowAddModal(false);
    resetForm();
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      companyName: vendor.companyName,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address || '',
      category: vendor.category,
      paymentTerms: vendor.paymentTerms,
      status: vendor.status,
      website: vendor.website || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm(t('vendors.confirmDelete'))) {
      setVendors(vendors.filter(v => v.id !== vendorId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">{t('vendors.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('vendors.manageVendors')}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('vendors.addVendor')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('vendors.totalVendors')}</p>
              <p className="text-2xl mt-1">{vendors.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-primary opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('vendors.activeVendors')}</p>
              <p className="text-2xl mt-1">{vendors.filter(v => v.status === 'active').length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('vendors.totalSpent')}</p>
              <p className="text-2xl mt-1">{formatCurrency(vendors.reduce((sum, v) => sum + v.totalSpent, 0))}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('vendors.outstandingBalance')}</p>
              <p className="text-2xl mt-1">{formatCurrency(vendors.reduce((sum, v) => sum + v.outstandingBalance, 0))}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('vendors.searchVendors')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VendorStatus | 'all')}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="all">{t('vendors.allStatuses')}</option>
              <option value="active">{t('vendors.status.active')}</option>
              <option value="inactive">{t('vendors.status.inactive')}</option>
              <option value="pending">{t('vendors.status.pending')}</option>
              <option value="blocked">{t('vendors.status.blocked')}</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as VendorCategory | 'all')}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="all">{t('vendors.allCategories')}</option>
              <option value="rawMaterials">{t('vendors.categories.rawMaterials')}</option>
              <option value="finishedGoods">{t('vendors.categories.finishedGoods')}</option>
              <option value="services">{t('vendors.categories.services')}</option>
              <option value="equipment">{t('vendors.categories.equipment')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {t('vendors.vendor')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {t('vendors.contact')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {t('vendors.category')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {t('vendors.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {t('vendors.paymentTerms')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {t('vendors.totalOrders')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {t('vendors.totalSpent')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {t('vendors.outstandingBalance')}
                </th>
                <th className="px-6 py-3 text-right text-xs uppercase tracking-wider text-muted-foreground">
                  {t('vendors.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{vendor.companyName}</p>
                          {vendor.website && (
                            <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {vendor.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{vendor.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{vendor.phone}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{vendor.contactPerson}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{t(`vendors.categories.${vendor.category}`)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(vendor.status)}`}>
                      {t(`vendors.status.${vendor.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{t(`vendors.terms.${vendor.paymentTerms}`)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{vendor.totalOrders}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{formatCurrency(vendor.totalSpent)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${vendor.outstandingBalance > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                      {formatCurrency(vendor.outstandingBalance)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditVendor(vendor)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">{t('vendors.noVendorsFound')}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {editingVendor ? t('vendors.editVendor') : t('vendors.addVendor')}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('vendors.companyName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={t('vendors.companyNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('vendors.contactPerson')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={t('vendors.contactPersonPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('vendors.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={t('vendors.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('vendors.phone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={t('vendors.phonePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('vendors.website')}</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={t('vendors.websitePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('vendors.category')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as VendorCategory })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="rawMaterials">{t('vendors.categories.rawMaterials')}</option>
                    <option value="finishedGoods">{t('vendors.categories.finishedGoods')}</option>
                    <option value="services">{t('vendors.categories.services')}</option>
                    <option value="equipment">{t('vendors.categories.equipment')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('vendors.paymentTerms')}</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="net15">{t('vendors.terms.net15')}</option>
                    <option value="net30">{t('vendors.terms.net30')}</option>
                    <option value="net45">{t('vendors.terms.net45')}</option>
                    <option value="net60">{t('vendors.terms.net60')}</option>
                    <option value="immediate">{t('vendors.terms.immediate')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('vendors.status')}</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as VendorStatus })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="active">{t('vendors.status.active')}</option>
                    <option value="inactive">{t('vendors.status.inactive')}</option>
                    <option value="pending">{t('vendors.status.pending')}</option>
                    <option value="blocked">{t('vendors.status.blocked')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('vendors.address')}</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t('vendors.addressPlaceholder')}
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {t('vendors.cancel')}
              </button>
              <button
                onClick={editingVendor ? handleUpdateVendor : handleAddVendor}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingVendor ? t('vendors.update') : t('vendors.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
