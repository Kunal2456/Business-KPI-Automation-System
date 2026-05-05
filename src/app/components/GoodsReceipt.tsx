import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Package, CheckCircle, XCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { GoodsReceipt, GoodsReceiptStatus } from '../types';
import { mockGoodsReceipts } from '../mockVendorData';

export default function GoodsReceiptComponent() {
  const { t } = useTranslation();
  const [receipts, setReceipts] = useState<GoodsReceipt[]>(mockGoodsReceipts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoodsReceiptStatus | 'all'>('all');
  const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    purchaseOrderNumber: '',
    vendorName: '',
    receiptDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Current User',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      purchaseOrderNumber: '',
      vendorName: '',
      receiptDate: new Date().toISOString().split('T')[0],
      receivedBy: 'Current User',
      notes: ''
    });
  };

  const handleCreateReceipt = () => {
    if (!formData.purchaseOrderNumber || !formData.vendorName) {
      alert('Please fill in all required fields');
      return;
    }

    const newReceipt: GoodsReceipt = {
      id: `GRN${Date.now()}`,
      receiptNumber: `GRN-${Date.now()}`,
      purchaseOrderNumber: formData.purchaseOrderNumber,
      vendorName: formData.vendorName,
      receiptDate: formData.receiptDate,
      receivedBy: formData.receivedBy,
      status: 'pending' as GoodsReceiptStatus,
      items: [],
      notes: formData.notes
    };

    setReceipts([newReceipt, ...receipts]);
    setShowCreateModal(false);
    resetForm();
  };

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.purchaseOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: GoodsReceiptStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partiallyReceived': return 'bg-orange-100 text-orange-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'qualityCheck': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalReceipts = receipts.length;
  const pendingInspection = receipts.filter(r => r.status === 'received' || r.status === 'qualityCheck').length;
  const approved = receipts.filter(r => r.status === 'approved').length;
  const rejected = receipts.filter(r => r.status === 'rejected').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">{t('goodsReceipt.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('goodsReceipt.trackIncomingShipments')}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('goodsReceipt.createReceipt')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('goodsReceipt.totalReceipts')}</p>
              <p className="text-2xl mt-1">{totalReceipts}</p>
            </div>
            <Package className="w-8 h-8 text-primary opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('goodsReceipt.pendingInspection')}</p>
              <p className="text-2xl mt-1">{pendingInspection}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('goodsReceipt.approved')}</p>
              <p className="text-2xl mt-1">{approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('goodsReceipt.rejected')}</p>
              <p className="text-2xl mt-1">{rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('goodsReceipt.searchReceipts')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as GoodsReceiptStatus | 'all')}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="all">{t('goodsReceipt.allStatuses')}</option>
              <option value="pending">{t('goodsReceipt.status.pending')}</option>
              <option value="partiallyReceived">{t('goodsReceipt.status.partiallyReceived')}</option>
              <option value="received">{t('goodsReceipt.status.received')}</option>
              <option value="qualityCheck">{t('goodsReceipt.status.qualityCheck')}</option>
              <option value="approved">{t('goodsReceipt.status.approved')}</option>
              <option value="rejected">{t('goodsReceipt.status.rejected')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      <div className="space-y-4">
        {filteredReceipts.map((receipt) => (
          <div key={receipt.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('goodsReceipt.receiptNumber')}</p>
                    <p className="font-medium mt-1">{receipt.receiptNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('goodsReceipt.purchaseOrder')}</p>
                    <p className="mt-1">{receipt.purchaseOrderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('goodsReceipt.vendor')}</p>
                    <p className="mt-1">{receipt.vendorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('goodsReceipt.receiptDate')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(receipt.receiptDate)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('goodsReceipt.statusLabel')}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs mt-1 ${getStatusColor(receipt.status)}`}>
                      {t(`goodsReceipt.status.${receipt.status}`)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left">{t('goodsReceipt.product')}</th>
                      <th className="px-4 py-2 text-right">{t('goodsReceipt.ordered')}</th>
                      <th className="px-4 py-2 text-right">{t('goodsReceipt.received')}</th>
                      <th className="px-4 py-2 text-right">{t('goodsReceipt.accepted')}</th>
                      <th className="px-4 py-2 text-right">{t('goodsReceipt.rejected')}</th>
                      <th className="px-4 py-2 text-center">{t('goodsReceipt.qualityStatus')}</th>
                      <th className="px-4 py-2 text-left">{t('goodsReceipt.batch')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {receipt.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium">{item.productName}</p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">{item.orderedQuantity} {item.unit}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={item.receivedQuantity < item.orderedQuantity ? 'text-orange-600' : ''}>
                            {item.receivedQuantity} {item.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-green-600">{item.acceptedQuantity} {item.unit}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={item.rejectedQuantity > 0 ? 'text-red-600' : 'text-muted-foreground'}>
                            {item.rejectedQuantity} {item.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 ${getQualityStatusColor(item.qualityStatus)}`}>
                            {item.qualityStatus === 'passed' && <CheckCircle className="w-4 h-4" />}
                            {item.qualityStatus === 'failed' && <XCircle className="w-4 h-4" />}
                            {item.qualityStatus === 'pending' && <Clock className="w-4 h-4" />}
                            {t(`goodsReceipt.quality.${item.qualityStatus}`)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-0.5 text-xs">
                            {item.batchNumber && <p className="text-muted-foreground">{item.batchNumber}</p>}
                            {item.expiryDate && (
                              <p className="text-orange-600">
                                {t('goodsReceipt.expires')}: {formatDate(item.expiryDate)}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Info */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('goodsReceipt.receivedBy')}: <span className="text-foreground">{receipt.receivedBy}</span></p>
                </div>
                {receipt.inspectedBy && (
                  <div>
                    <p className="text-muted-foreground">{t('goodsReceipt.inspectedBy')}: <span className="text-foreground">{receipt.inspectedBy}</span></p>
                    {receipt.inspectionDate && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(receipt.inspectionDate)}
                      </p>
                    )}
                  </div>
                )}
                {receipt.notes && (
                  <div>
                    <p className="text-muted-foreground">{t('goodsReceipt.notes')}:</p>
                    <p className="text-xs text-foreground mt-0.5">{receipt.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredReceipts.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">{t('goodsReceipt.noReceiptsFound')}</p>
          </div>
        )}
      </div>

      {/* Create Receipt Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('goodsReceipt.createReceipt')}</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('goodsReceipt.purchaseOrder')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.purchaseOrderNumber}
                  onChange={(e) => setFormData({ ...formData, purchaseOrderNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="PO-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('goodsReceipt.vendor')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t('goodsReceipt.vendorPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('goodsReceipt.receiptDate')}</label>
                <input
                  type="date"
                  value={formData.receiptDate}
                  onChange={(e) => setFormData({ ...formData, receiptDate: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('goodsReceipt.receivedBy')}</label>
                <input
                  type="text"
                  value={formData.receivedBy}
                  onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('goodsReceipt.notes')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t('goodsReceipt.notesPlaceholder')}
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {t('goodsReceipt.cancel')}
              </button>
              <button
                onClick={handleCreateReceipt}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('goodsReceipt.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
