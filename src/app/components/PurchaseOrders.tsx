import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, FileText, Calendar, TrendingUp, Clock, CheckCircle, XCircle, ChevronDown, Eye } from 'lucide-react';
import { PurchaseOrder, PurchaseOrderStatus } from '../types';
import { mockPurchaseOrders } from '../mockVendorData';

export default function PurchaseOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleApproveOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? {
            ...order,
            status: 'approved' as PurchaseOrderStatus,
            approvedBy: 'Current User',
            approvedAt: new Date().toISOString()
          }
        : order
    ));
  };

  const handleDeclineOrder = (orderId: string) => {
    if (confirm(t('purchaseOrders.confirmDecline'))) {
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, status: 'rejected' as PurchaseOrderStatus }
          : order
      ));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      case 'partiallyReceived': return 'bg-orange-100 text-orange-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'completed':
      case 'received':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

  const totalOrderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'approved').length;
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'received').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">{t('purchaseOrders.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('purchaseOrders.managePurchaseOrders')}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          {t('purchaseOrders.createPO')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('purchaseOrders.totalOrders')}</p>
              <p className="text-2xl mt-1">{orders.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('purchaseOrders.pendingOrders')}</p>
              <p className="text-2xl mt-1">{pendingOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('purchaseOrders.completed')}</p>
              <p className="text-2xl mt-1">{completedOrders}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('purchaseOrders.totalValue')}</p>
              <p className="text-2xl mt-1">{formatCurrency(totalOrderValue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
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
              placeholder={t('purchaseOrders.searchOrders')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PurchaseOrderStatus | 'all')}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="all">{t('purchaseOrders.allStatuses')}</option>
              <option value="draft">{t('purchaseOrders.status.draft')}</option>
              <option value="pending">{t('purchaseOrders.status.pending')}</option>
              <option value="approved">{t('purchaseOrders.status.approved')}</option>
              <option value="sent">{t('purchaseOrders.status.sent')}</option>
              <option value="partiallyReceived">{t('purchaseOrders.status.partiallyReceived')}</option>
              <option value="received">{t('purchaseOrders.status.received')}</option>
              <option value="completed">{t('purchaseOrders.status.completed')}</option>
              <option value="cancelled">{t('purchaseOrders.status.cancelled')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('purchaseOrders.orderNumber')}</p>
                    <p className="font-medium mt-1">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('purchaseOrders.vendor')}</p>
                    <p className="mt-1">{order.vendorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('purchaseOrders.orderDate')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(order.orderDate)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('purchaseOrders.statusLabel')}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs mt-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {t(`purchaseOrders.status.${order.status}`)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{t('purchaseOrders.totalAmount')}</p>
                    <p className="font-medium mt-1">{formatCurrency(order.totalAmount, order.currency)}</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <div className="border-t border-border p-6 bg-muted/20">
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">{t('purchaseOrders.deliveryInfo')}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><span className="font-medium text-foreground">{t('purchaseOrders.expectedDate')}:</span> {formatDate(order.expectedDeliveryDate)}</p>
                        {order.actualDeliveryDate && (
                          <p><span className="font-medium text-foreground">{t('purchaseOrders.actualDate')}:</span> {formatDate(order.actualDeliveryDate)}</p>
                        )}
                        <p><span className="font-medium text-foreground">{t('purchaseOrders.address')}:</span></p>
                        <p className="pl-4">
                          {order.deliveryAddress.street}<br />
                          {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}<br />
                          {order.deliveryAddress.country}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3">{t('purchaseOrders.paymentInfo')}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><span className="font-medium text-foreground">{t('purchaseOrders.paymentTerms')}:</span> {t(`vendors.terms.${order.paymentTerms}`)}</p>
                        <p><span className="font-medium text-foreground">{t('purchaseOrders.subtotal')}:</span> {formatCurrency(order.subtotal, order.currency)}</p>
                        <p><span className="font-medium text-foreground">{t('purchaseOrders.tax')}:</span> {formatCurrency(order.taxAmount, order.currency)}</p>
                        <p><span className="font-medium text-foreground">{t('purchaseOrders.discount')}:</span> {formatCurrency(order.discountAmount, order.currency)}</p>
                        <p><span className="font-medium text-foreground">{t('purchaseOrders.shipping')}:</span> {formatCurrency(order.shippingCost, order.currency)}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3">{t('purchaseOrders.metadata')}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><span className="font-medium text-foreground">{t('purchaseOrders.createdBy')}:</span> {order.createdBy}</p>
                        <p><span className="font-medium text-foreground">{t('purchaseOrders.createdAt')}:</span> {formatDate(order.createdAt)}</p>
                        {order.approvedBy && (
                          <>
                            <p><span className="font-medium text-foreground">{t('purchaseOrders.approvedBy')}:</span> {order.approvedBy}</p>
                            <p><span className="font-medium text-foreground">{t('purchaseOrders.approvedAt')}:</span> {formatDate(order.approvedAt!)}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">{t('purchaseOrders.items')}</h3>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-2 text-left">{t('purchaseOrders.product')}</th>
                            <th className="px-4 py-2 text-right">{t('purchaseOrders.quantity')}</th>
                            <th className="px-4 py-2 text-right">{t('purchaseOrders.unitPrice')}</th>
                            <th className="px-4 py-2 text-right">{t('purchaseOrders.discount')}</th>
                            <th className="px-4 py-2 text-right">{t('purchaseOrders.tax')}</th>
                            <th className="px-4 py-2 text-right">{t('purchaseOrders.total')}</th>
                            <th className="px-4 py-2 text-right">{t('purchaseOrders.received')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {order.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3">
                                <p className="font-medium">{item.productName}</p>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">{item.quantity} {item.unit}</td>
                              <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice, order.currency)}</td>
                              <td className="px-4 py-3 text-right">{formatCurrency(item.discount, order.currency)}</td>
                              <td className="px-4 py-3 text-right">{formatCurrency(item.tax, order.currency)}</td>
                              <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.total, order.currency)}</td>
                              <td className="px-4 py-3 text-right">
                                <span className={item.receivedQuantity >= item.quantity ? 'text-green-600' : 'text-orange-600'}>
                                  {item.receivedQuantity} / {item.quantity}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">{t('purchaseOrders.notes')}</h3>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{order.notes}</p>
                    </div>
                  )}

                  {/* Approve/Decline Buttons */}
                  {(order.status === 'pending' || order.status === 'draft') && (
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {t('purchaseOrders.approve')}
                      </button>
                      <button
                        onClick={() => handleDeclineOrder(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        {t('purchaseOrders.decline')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">{t('purchaseOrders.noOrdersFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
