import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, DollarSign, Calendar, CheckCircle, Clock, XCircle, AlertCircle, CreditCard, Building2 } from 'lucide-react';
import { VendorPayment, PaymentStatus, PaymentMethod } from '../types';
import { mockVendorPayments } from '../mockVendorData';

export default function VendorPayments() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<VendorPayment[]>(mockVendorPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: '',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'bankTransfer' as PaymentMethod,
    purchaseOrderNumber: '',
    reference: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      vendorName: '',
      amount: '',
      dueDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'bankTransfer' as PaymentMethod,
      purchaseOrderNumber: '',
      reference: '',
      notes: ''
    });
  };

  const handleCreatePayment = () => {
    if (!formData.vendorName || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const newPayment: VendorPayment = {
      id: `PAY${Date.now()}`,
      paymentNumber: `PAY-${Date.now()}`,
      vendorName: formData.vendorName,
      amount: parseFloat(formData.amount),
      currency: 'USD',
      dueDate: formData.dueDate,
      paymentMethod: formData.paymentMethod,
      status: 'pending' as PaymentStatus,
      purchaseOrderNumber: formData.purchaseOrderNumber || undefined,
      reference: formData.reference || undefined,
      notes: formData.notes || undefined
    };

    setPayments([newPayment, ...payments]);
    setShowCreateModal(false);
    resetForm();
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payment.purchaseOrderNumber && payment.purchaseOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'pending':
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'bankTransfer': return <Building2 className="w-4 h-4" />;
      case 'creditCard': return <CreditCard className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (payment: VendorPayment) => {
    if (payment.status === 'completed' || payment.status === 'cancelled') return false;
    return new Date(payment.dueDate) < new Date();
  };

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'scheduled').reduce((sum, p) => sum + p.amount, 0);
  const completedPayments = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const overduePayments = payments.filter(p => isOverdue(p)).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">{t('vendorPayments.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('vendorPayments.trackPayments')}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('vendorPayments.createPayment')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('vendorPayments.totalPayments')}</p>
              <p className="text-2xl mt-1">{formatCurrency(totalPayments)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('vendorPayments.pending')}</p>
              <p className="text-2xl mt-1">{formatCurrency(pendingPayments)}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('vendorPayments.completed')}</p>
              <p className="text-2xl mt-1">{formatCurrency(completedPayments)}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('vendorPayments.overdue')}</p>
              <p className="text-2xl mt-1">{overduePayments}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600 opacity-50" />
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
              placeholder={t('vendorPayments.searchPayments')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="all">{t('vendorPayments.allStatuses')}</option>
              <option value="pending">{t('vendorPayments.status.pending')}</option>
              <option value="scheduled">{t('vendorPayments.status.scheduled')}</option>
              <option value="processing">{t('vendorPayments.status.processing')}</option>
              <option value="completed">{t('vendorPayments.status.completed')}</option>
              <option value="failed">{t('vendorPayments.status.failed')}</option>
              <option value="cancelled">{t('vendorPayments.status.cancelled')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className={`bg-card border rounded-lg overflow-hidden ${isOverdue(payment) ? 'border-red-300' : 'border-border'}`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('vendorPayments.paymentNumber')}</p>
                    <p className="font-medium mt-1">{payment.paymentNumber}</p>
                    {isOverdue(payment) && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {t('vendorPayments.overdue')}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('vendorPayments.vendor')}</p>
                    <p className="mt-1">{payment.vendorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('vendorPayments.amount')}</p>
                    <p className="font-medium mt-1">{formatCurrency(payment.amount, payment.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('vendorPayments.dueDate')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className={`text-sm ${isOverdue(payment) ? 'text-red-600' : ''}`}>
                        {formatDate(payment.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('vendorPayments.method')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="text-sm">{t(`vendorPayments.methods.${payment.paymentMethod}`)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('vendorPayments.statusLabel')}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs mt-1 ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {t(`vendorPayments.status.${payment.status}`)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border text-sm">
                {payment.purchaseOrderNumber && (
                  <div>
                    <p className="text-muted-foreground">
                      {t('vendorPayments.purchaseOrder')}: <span className="text-foreground font-medium">{payment.purchaseOrderNumber}</span>
                    </p>
                  </div>
                )}
                {payment.reference && (
                  <div>
                    <p className="text-muted-foreground">
                      {t('vendorPayments.reference')}: <span className="text-foreground">{payment.reference}</span>
                    </p>
                  </div>
                )}
                {payment.paymentDate && (
                  <div>
                    <p className="text-muted-foreground">
                      {t('vendorPayments.paymentDate')}: <span className="text-foreground">{formatDate(payment.paymentDate)}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Bank Details for Bank Transfers */}
              {payment.bankDetails && payment.paymentMethod === 'bankTransfer' && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium mb-2">{t('vendorPayments.bankDetails')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <p>{t('vendorPayments.bankName')}: <span className="text-foreground">{payment.bankDetails.bankName}</span></p>
                    <p>{t('vendorPayments.accountNumber')}: <span className="text-foreground">{payment.bankDetails.accountNumber}</span></p>
                    <p>{t('vendorPayments.routingNumber')}: <span className="text-foreground">{payment.bankDetails.routingNumber}</span></p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {payment.notes && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    {t('vendorPayments.notes')}: <span className="text-foreground">{payment.notes}</span>
                  </p>
                </div>
              )}

              {/* Approval Info */}
              {payment.approvedBy && payment.approvedAt && (
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <p>
                    {t('vendorPayments.approvedBy')}: <span className="text-foreground">{payment.approvedBy}</span>
                  </p>
                  <p>
                    {t('vendorPayments.approvedAt')}: <span className="text-foreground">{formatDate(payment.approvedAt)}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {payment.status === 'pending' && (
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    {t('vendorPayments.approve')}
                  </button>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
                    {t('vendorPayments.cancel')}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredPayments.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">{t('vendorPayments.noPaymentsFound')}</p>
          </div>
        )}
      </div>

      {/* Create Payment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('vendorPayments.createPayment')}</h2>
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
                  {t('vendorPayments.vendor')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t('vendorPayments.vendorPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('vendorPayments.amount')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('vendorPayments.dueDate')}</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('vendorPayments.method')}</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="bankTransfer">{t('vendorPayments.methods.bankTransfer')}</option>
                  <option value="creditCard">{t('vendorPayments.methods.creditCard')}</option>
                  <option value="cash">{t('vendorPayments.methods.cash')}</option>
                  <option value="check">{t('vendorPayments.methods.check')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('vendorPayments.purchaseOrder')}</label>
                <input
                  type="text"
                  value={formData.purchaseOrderNumber}
                  onChange={(e) => setFormData({ ...formData, purchaseOrderNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="PO-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('vendorPayments.reference')}</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t('vendorPayments.referencePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('vendorPayments.notes')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t('vendorPayments.notesPlaceholder')}
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
                {t('vendorPayments.cancelButton')}
              </button>
              <button
                onClick={handleCreatePayment}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('vendorPayments.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
