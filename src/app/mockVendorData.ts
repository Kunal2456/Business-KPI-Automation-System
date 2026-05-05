import {
  Vendor,
  PurchaseOrder,
  GoodsReceipt,
  VendorPayment,
  ProcurementMetrics
} from './types';

export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    companyName: 'Global Supplies Inc.',
    contactPerson: 'John Smith',
    email: 'john.smith@globalsupplies.com',
    phone: '+1 555-0101',
    category: 'rawMaterials',
    status: 'active',
    paymentTerms: 'net30',
    taxId: 'TAX-123456',
    website: 'https://globalsupplies.com',
    address: {
      street: '123 Industrial Blvd',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    bankDetails: {
      bankName: 'First National Bank',
      accountNumber: '****5678',
      routingNumber: '021000021',
      swiftCode: 'FNBAUS33'
    },
    rating: 4.5,
    totalOrders: 156,
    totalSpent: 450000,
    outstandingBalance: 35000,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2026-04-28T14:30:00Z'
  },
  {
    id: 'v2',
    companyName: 'Premium Packaging Solutions',
    contactPerson: 'Sarah Johnson',
    email: 'sarah.j@premiumpack.com',
    phone: '+1 555-0202',
    category: 'finishedGoods',
    status: 'active',
    paymentTerms: 'net15',
    taxId: 'TAX-789012',
    website: 'https://premiumpack.com',
    address: {
      street: '456 Commerce Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA'
    },
    bankDetails: {
      bankName: 'Pacific Bank',
      accountNumber: '****9012',
      routingNumber: '122000247',
      swiftCode: 'PACBUS66'
    },
    rating: 4.8,
    totalOrders: 203,
    totalSpent: 680000,
    outstandingBalance: 52000,
    createdAt: '2023-11-20T09:00:00Z',
    updatedAt: '2026-04-30T11:15:00Z'
  },
  {
    id: 'v3',
    companyName: 'Tech Equipment Co.',
    contactPerson: 'Michael Chen',
    email: 'mchen@techequip.com',
    phone: '+1 555-0303',
    category: 'equipment',
    status: 'active',
    paymentTerms: 'net45',
    taxId: 'TAX-345678',
    website: 'https://techequip.com',
    address: {
      street: '789 Tech Park Dr',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA'
    },
    bankDetails: {
      bankName: 'Silicon Valley Bank',
      accountNumber: '****3456',
      routingNumber: '121140399',
      swiftCode: 'SVBKUS6S'
    },
    rating: 4.2,
    totalOrders: 87,
    totalSpent: 920000,
    outstandingBalance: 125000,
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2026-04-29T16:45:00Z'
  },
  {
    id: 'v4',
    companyName: 'Logistics Services Ltd.',
    contactPerson: 'Emma Williams',
    email: 'ewilliams@logisticsltd.com',
    phone: '+1 555-0404',
    category: 'services',
    status: 'active',
    paymentTerms: 'immediate',
    taxId: 'TAX-901234',
    address: {
      street: '321 Transport Way',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA'
    },
    rating: 4.6,
    totalOrders: 124,
    totalSpent: 285000,
    outstandingBalance: 0,
    createdAt: '2024-02-05T10:30:00Z',
    updatedAt: '2026-04-30T09:20:00Z'
  },
  {
    id: 'v5',
    companyName: 'Quality Materials Group',
    contactPerson: 'Robert Martinez',
    email: 'rmartinez@qualitymat.com',
    phone: '+1 555-0505',
    category: 'rawMaterials',
    status: 'pending',
    paymentTerms: 'net30',
    taxId: 'TAX-567890',
    website: 'https://qualitymat.com',
    address: {
      street: '654 Manufacturing Rd',
      city: 'Houston',
      state: 'TX',
      postalCode: '77001',
      country: 'USA'
    },
    rating: 4.0,
    totalOrders: 12,
    totalSpent: 45000,
    outstandingBalance: 8000,
    createdAt: '2026-03-15T14:00:00Z',
    updatedAt: '2026-04-25T10:00:00Z'
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po1',
    orderNumber: 'PO-2026-001',
    vendorId: 'v1',
    vendorName: 'Global Supplies Inc.',
    status: 'received',
    orderDate: '2026-04-15T10:00:00Z',
    expectedDeliveryDate: '2026-04-25T00:00:00Z',
    actualDeliveryDate: '2026-04-24T14:30:00Z',
    items: [
      {
        id: 'poi1',
        productId: 'p101',
        productName: 'Industrial Steel Sheets',
        description: '2mm thickness, galvanized',
        quantity: 500,
        unit: 'sheets',
        unitPrice: 45.00,
        tax: 2250.00,
        discount: 0,
        total: 22500.00,
        receivedQuantity: 500,
        remainingQuantity: 0
      },
      {
        id: 'poi2',
        productId: 'p102',
        productName: 'Aluminum Rods',
        description: '12mm diameter, 6m length',
        quantity: 200,
        unit: 'pieces',
        unitPrice: 32.50,
        tax: 650.00,
        discount: 325,
        total: 6500.00,
        receivedQuantity: 200,
        remainingQuantity: 0
      }
    ],
    subtotal: 29000.00,
    taxAmount: 2900.00,
    discountAmount: 325.00,
    shippingCost: 500.00,
    totalAmount: 31075.00,
    currency: 'USD',
    paymentTerms: 'net30',
    deliveryAddress: {
      street: '100 Warehouse Blvd',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      country: 'USA'
    },
    notes: 'Urgent delivery required for production line',
    approvedBy: 'Manager01',
    approvedAt: '2026-04-16T09:00:00Z',
    createdBy: 'User01',
    createdAt: '2026-04-15T10:00:00Z',
    updatedAt: '2026-04-24T14:30:00Z'
  },
  {
    id: 'po2',
    orderNumber: 'PO-2026-002',
    vendorId: 'v2',
    vendorName: 'Premium Packaging Solutions',
    status: 'partiallyReceived',
    orderDate: '2026-04-20T11:30:00Z',
    expectedDeliveryDate: '2026-05-05T00:00:00Z',
    items: [
      {
        id: 'poi3',
        productId: 'p201',
        productName: 'Cardboard Boxes - Large',
        description: '60x40x40cm, double-walled',
        quantity: 1000,
        unit: 'boxes',
        unitPrice: 3.50,
        tax: 350.00,
        discount: 0,
        total: 3500.00,
        receivedQuantity: 600,
        remainingQuantity: 400
      },
      {
        id: 'poi4',
        productId: 'p202',
        productName: 'Bubble Wrap Rolls',
        description: '1.5m x 100m, small bubbles',
        quantity: 50,
        unit: 'rolls',
        unitPrice: 25.00,
        tax: 125.00,
        discount: 62.50,
        total: 1250.00,
        receivedQuantity: 50,
        remainingQuantity: 0
      }
    ],
    subtotal: 4750.00,
    taxAmount: 475.00,
    discountAmount: 62.50,
    shippingCost: 150.00,
    totalAmount: 5312.50,
    currency: 'USD',
    paymentTerms: 'net15',
    deliveryAddress: {
      street: '100 Warehouse Blvd',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      country: 'USA'
    },
    approvedBy: 'Manager01',
    approvedAt: '2026-04-20T12:00:00Z',
    createdBy: 'User02',
    createdAt: '2026-04-20T11:30:00Z',
    updatedAt: '2026-04-28T10:15:00Z'
  },
  {
    id: 'po3',
    orderNumber: 'PO-2026-003',
    vendorId: 'v3',
    vendorName: 'Tech Equipment Co.',
    status: 'approved',
    orderDate: '2026-04-28T14:00:00Z',
    expectedDeliveryDate: '2026-05-15T00:00:00Z',
    items: [
      {
        id: 'poi5',
        productId: 'p301',
        productName: 'Industrial Robot Arm',
        description: 'Model XR-500, 6-axis',
        quantity: 2,
        unit: 'units',
        unitPrice: 45000.00,
        tax: 9000.00,
        discount: 0,
        total: 90000.00,
        receivedQuantity: 0,
        remainingQuantity: 2
      }
    ],
    subtotal: 90000.00,
    taxAmount: 9000.00,
    discountAmount: 0,
    shippingCost: 2000.00,
    totalAmount: 101000.00,
    currency: 'USD',
    paymentTerms: 'net45',
    deliveryAddress: {
      street: '100 Warehouse Blvd',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      country: 'USA'
    },
    notes: 'Installation and training required',
    approvedBy: 'Manager02',
    approvedAt: '2026-04-29T09:00:00Z',
    createdBy: 'User03',
    createdAt: '2026-04-28T14:00:00Z',
    updatedAt: '2026-04-29T09:00:00Z'
  },
  {
    id: 'po4',
    orderNumber: 'PO-2026-004',
    vendorId: 'v1',
    vendorName: 'Global Supplies Inc.',
    status: 'pending',
    orderDate: '2026-04-30T09:00:00Z',
    expectedDeliveryDate: '2026-05-10T00:00:00Z',
    items: [
      {
        id: 'poi6',
        productId: 'p103',
        productName: 'Copper Wire',
        description: '2.5mm², insulated',
        quantity: 1000,
        unit: 'meters',
        unitPrice: 1.80,
        tax: 180.00,
        discount: 0,
        total: 1800.00,
        receivedQuantity: 0,
        remainingQuantity: 1000
      }
    ],
    subtotal: 1800.00,
    taxAmount: 180.00,
    discountAmount: 0,
    shippingCost: 75.00,
    totalAmount: 2055.00,
    currency: 'USD',
    paymentTerms: 'net30',
    deliveryAddress: {
      street: '100 Warehouse Blvd',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      country: 'USA'
    },
    createdBy: 'User01',
    createdAt: '2026-04-30T09:00:00Z',
    updatedAt: '2026-04-30T09:00:00Z'
  }
];

export const mockGoodsReceipts: GoodsReceipt[] = [
  {
    id: 'gr1',
    receiptNumber: 'GRN-2026-001',
    purchaseOrderId: 'po1',
    purchaseOrderNumber: 'PO-2026-001',
    vendorId: 'v1',
    vendorName: 'Global Supplies Inc.',
    status: 'approved',
    receiptDate: '2026-04-24T14:30:00Z',
    items: [
      {
        id: 'gri1',
        purchaseOrderItemId: 'poi1',
        productId: 'p101',
        productName: 'Industrial Steel Sheets',
        orderedQuantity: 500,
        receivedQuantity: 500,
        acceptedQuantity: 495,
        rejectedQuantity: 5,
        unit: 'sheets',
        batchNumber: 'BATCH-2026-04-001',
        qualityStatus: 'passed',
        notes: '5 sheets had minor surface defects'
      },
      {
        id: 'gri2',
        purchaseOrderItemId: 'poi2',
        productId: 'p102',
        productName: 'Aluminum Rods',
        orderedQuantity: 200,
        receivedQuantity: 200,
        acceptedQuantity: 200,
        rejectedQuantity: 0,
        unit: 'pieces',
        batchNumber: 'BATCH-2026-04-002',
        qualityStatus: 'passed'
      }
    ],
    receivedBy: 'Warehouse01',
    inspectedBy: 'QC01',
    inspectionDate: '2026-04-24T16:00:00Z',
    notes: 'All items inspected and approved with minor defects noted',
    createdAt: '2026-04-24T14:30:00Z',
    updatedAt: '2026-04-24T16:00:00Z'
  },
  {
    id: 'gr2',
    receiptNumber: 'GRN-2026-002',
    purchaseOrderId: 'po2',
    purchaseOrderNumber: 'PO-2026-002',
    vendorId: 'v2',
    vendorName: 'Premium Packaging Solutions',
    status: 'partiallyReceived',
    receiptDate: '2026-04-28T10:15:00Z',
    items: [
      {
        id: 'gri3',
        purchaseOrderItemId: 'poi3',
        productId: 'p201',
        productName: 'Cardboard Boxes - Large',
        orderedQuantity: 1000,
        receivedQuantity: 600,
        acceptedQuantity: 600,
        rejectedQuantity: 0,
        unit: 'boxes',
        batchNumber: 'BATCH-2026-04-003',
        qualityStatus: 'passed',
        notes: 'First shipment of split delivery'
      },
      {
        id: 'gri4',
        purchaseOrderItemId: 'poi4',
        productId: 'p202',
        productName: 'Bubble Wrap Rolls',
        orderedQuantity: 50,
        receivedQuantity: 50,
        acceptedQuantity: 50,
        rejectedQuantity: 0,
        unit: 'rolls',
        batchNumber: 'BATCH-2026-04-004',
        qualityStatus: 'passed'
      }
    ],
    receivedBy: 'Warehouse02',
    inspectedBy: 'QC02',
    inspectionDate: '2026-04-28T11:00:00Z',
    notes: 'Partial delivery - remaining 400 boxes expected next week',
    createdAt: '2026-04-28T10:15:00Z',
    updatedAt: '2026-04-28T11:00:00Z'
  }
];

export const mockVendorPayments: VendorPayment[] = [
  {
    id: 'vp1',
    paymentNumber: 'PAY-2026-001',
    vendorId: 'v1',
    vendorName: 'Global Supplies Inc.',
    purchaseOrderId: 'po1',
    purchaseOrderNumber: 'PO-2026-001',
    amount: 31075.00,
    currency: 'USD',
    paymentMethod: 'bankTransfer',
    status: 'scheduled',
    dueDate: '2026-05-24T00:00:00Z',
    reference: 'INV-GS-2026-045',
    bankDetails: {
      bankName: 'First National Bank',
      accountNumber: '****5678',
      routingNumber: '021000021'
    },
    notes: 'Payment for PO-2026-001',
    createdBy: 'Finance01',
    createdAt: '2026-04-25T10:00:00Z',
    updatedAt: '2026-04-25T10:00:00Z'
  },
  {
    id: 'vp2',
    paymentNumber: 'PAY-2026-002',
    vendorId: 'v2',
    vendorName: 'Premium Packaging Solutions',
    amount: 12500.00,
    currency: 'USD',
    paymentMethod: 'bankTransfer',
    status: 'completed',
    dueDate: '2026-04-20T00:00:00Z',
    paymentDate: '2026-04-19T15:30:00Z',
    reference: 'INV-PPS-2026-112',
    bankDetails: {
      bankName: 'Pacific Bank',
      accountNumber: '****9012',
      routingNumber: '122000247'
    },
    notes: 'Early payment to utilize discount',
    createdBy: 'Finance01',
    approvedBy: 'Manager02',
    approvedAt: '2026-04-18T14:00:00Z',
    createdAt: '2026-04-15T11:00:00Z',
    updatedAt: '2026-04-19T15:30:00Z'
  },
  {
    id: 'vp3',
    paymentNumber: 'PAY-2026-003',
    vendorId: 'v4',
    vendorName: 'Logistics Services Ltd.',
    amount: 8500.00,
    currency: 'USD',
    paymentMethod: 'creditCard',
    status: 'completed',
    dueDate: '2026-04-25T00:00:00Z',
    paymentDate: '2026-04-25T09:00:00Z',
    reference: 'INV-LOG-2026-078',
    notes: 'Monthly logistics services payment',
    createdBy: 'Finance02',
    approvedBy: 'Manager01',
    approvedAt: '2026-04-24T16:00:00Z',
    createdAt: '2026-04-22T10:00:00Z',
    updatedAt: '2026-04-25T09:00:00Z'
  },
  {
    id: 'vp4',
    paymentNumber: 'PAY-2026-004',
    vendorId: 'v2',
    vendorName: 'Premium Packaging Solutions',
    purchaseOrderId: 'po2',
    purchaseOrderNumber: 'PO-2026-002',
    amount: 5312.50,
    currency: 'USD',
    paymentMethod: 'bankTransfer',
    status: 'pending',
    dueDate: '2026-05-05T00:00:00Z',
    reference: 'INV-PPS-2026-125',
    bankDetails: {
      bankName: 'Pacific Bank',
      accountNumber: '****9012',
      routingNumber: '122000247'
    },
    createdBy: 'Finance01',
    createdAt: '2026-04-28T14:00:00Z',
    updatedAt: '2026-04-28T14:00:00Z'
  }
];

export const mockProcurementMetrics: ProcurementMetrics = {
  totalVendors: 5,
  activeVendors: 4,
  totalPurchaseOrders: 4,
  pendingOrders: 1,
  totalSpent: 2380000,
  outstandingPayments: 220000,
  averageOrderValue: 34860.63,
  onTimeDeliveryRate: 94.5,
  topVendorsBySpend: [
    { vendorId: 'v3', vendorName: 'Tech Equipment Co.', totalSpent: 920000 },
    { vendorId: 'v2', vendorName: 'Premium Packaging Solutions', totalSpent: 680000 },
    { vendorId: 'v1', vendorName: 'Global Supplies Inc.', totalSpent: 450000 }
  ],
  spendByCategory: [
    { category: 'equipment', amount: 920000, percentage: 38.7 },
    { category: 'finishedGoods', amount: 680000, percentage: 28.6 },
    { category: 'rawMaterials', amount: 495000, percentage: 20.8 },
    { category: 'services', amount: 285000, percentage: 12.0 }
  ]
};
