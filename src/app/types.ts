// Vendor Management Types

export type VendorStatus = 'active' | 'inactive' | 'pending' | 'blocked';
export type VendorCategory = 'rawMaterials' | 'finishedGoods' | 'services' | 'equipment';
export type PaymentTerms = 'immediate' | 'net15' | 'net30' | 'net45' | 'net60';
export type PurchaseOrderStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'sent' | 'partiallyReceived' | 'received' | 'completed' | 'cancelled';
export type GoodsReceiptStatus = 'pending' | 'partiallyReceived' | 'received' | 'qualityCheck' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PaymentMethod = 'bankTransfer' | 'check' | 'cash' | 'creditCard' | 'other';

export interface Vendor {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: VendorCategory;
  status: VendorStatus;
  paymentTerms: PaymentTerms;
  taxId?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    swiftCode?: string;
  };
  notes?: string;
  rating?: number;
  totalOrders: number;
  totalSpent: number;
  outstandingBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  tax: number;
  discount: number;
  total: number;
  receivedQuantity: number;
  remainingQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  paymentTerms: PaymentTerms;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceiptItem {
  id: string;
  purchaseOrderItemId: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  batchNumber?: string;
  expiryDate?: string;
  qualityStatus: 'pending' | 'passed' | 'failed';
  notes?: string;
}

export interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  vendorId: string;
  vendorName: string;
  status: GoodsReceiptStatus;
  receiptDate: string;
  items: GoodsReceiptItem[];
  receivedBy: string;
  inspectedBy?: string;
  inspectionDate?: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VendorPayment {
  id: string;
  paymentNumber: string;
  vendorId: string;
  vendorName: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  dueDate: string;
  paymentDate?: string;
  reference?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
  };
  notes?: string;
  attachments?: string[];
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcurementMetrics {
  totalVendors: number;
  activeVendors: number;
  totalPurchaseOrders: number;
  pendingOrders: number;
  totalSpent: number;
  outstandingPayments: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number;
  topVendorsBySpend: Array<{
    vendorId: string;
    vendorName: string;
    totalSpent: number;
  }>;
  spendByCategory: Array<{
    category: VendorCategory;
    amount: number;
    percentage: number;
  }>;
}
