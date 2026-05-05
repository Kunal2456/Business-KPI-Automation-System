/**
 * GST (Goods and Services Tax) Calculations for India
 * Supports CGST, SGST, IGST calculations
 */

// GST Tax Slabs in India
export const GST_RATES = {
  EXEMPT: 0,
  RATE_5: 5,
  RATE_12: 12,
  RATE_18: 18,
  RATE_28: 28
} as const;

export type GSTRate = typeof GST_RATES[keyof typeof GST_RATES];

// Transaction Types
export type TransactionType = 'INTRA_STATE' | 'INTER_STATE';

// GST Breakdown Interface
export interface GSTBreakdown {
  baseAmount: number;
  gstRate: GSTRate;
  transactionType: TransactionType;
  cgst: number;
  sgst: number;
  igst: number;
  totalGST: number;
  totalAmount: number;
}

// Product with GST Interface
export interface ProductWithGST {
  id: string;
  name: string;
  price: number; // Price including GST
  gstRate: GSTRate;
  hsnCode?: string;
  includesGST?: boolean; // Whether price includes GST or not
}

// Invoice with GST
export interface InvoiceWithGST {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerGSTIN?: string;
  customerState: string;
  businessState: string;
  items: Array<{
    product: ProductWithGST;
    quantity: number;
    unitPrice: number;
    gstBreakdown: GSTBreakdown;
    totalAmount: number;
  }>;
  subtotal: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalGST: number;
  grandTotal: number;
  taxableAmount: number;
}

/**
 * Calculate GST breakdown for a given amount
 * @param amount - Base amount (excluding GST)
 * @param gstRate - GST rate percentage (5, 12, 18, 28)
 * @param transactionType - INTRA_STATE or INTER_STATE
 * @returns GST breakdown object
 */
export function calculateGST(
  amount: number,
  gstRate: GSTRate,
  transactionType: TransactionType = 'INTRA_STATE'
): GSTBreakdown {
  const gstAmount = (amount * gstRate) / 100;
  
  const breakdown: GSTBreakdown = {
    baseAmount: amount,
    gstRate,
    transactionType,
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalGST: gstAmount,
    totalAmount: amount + gstAmount
  };

  // For intra-state: Split into CGST + SGST (50-50)
  // For inter-state: IGST (full amount)
  if (transactionType === 'INTRA_STATE') {
    breakdown.cgst = gstAmount / 2;
    breakdown.sgst = gstAmount / 2;
    breakdown.igst = 0;
  } else {
    breakdown.cgst = 0;
    breakdown.sgst = 0;
    breakdown.igst = gstAmount;
  }

  return breakdown;
}

/**
 * Calculate price excluding GST from price including GST
 * @param priceWithGST - Price including GST
 * @param gstRate - GST rate percentage
 * @returns Price excluding GST
 */
export function getPriceExcludingGST(priceWithGST: number, gstRate: GSTRate): number {
  return priceWithGST / (1 + gstRate / 100);
}

/**
 * Calculate price including GST from price excluding GST
 * @param priceExcludingGST - Price excluding GST
 * @param gstRate - GST rate percentage
 * @returns Price including GST
 */
export function getPriceIncludingGST(priceExcludingGST: number, gstRate: GSTRate): number {
  return priceExcludingGST * (1 + gstRate / 100);
}

/**
 * Determine transaction type based on states
 * @param businessState - State where business is registered
 * @param customerState - State where customer is located
 * @returns Transaction type (INTRA_STATE or INTER_STATE)
 */
export function getTransactionType(
  businessState: string,
  customerState: string
): TransactionType {
  return businessState === customerState ? 'INTRA_STATE' : 'INTER_STATE';
}

/**
 * Calculate GST for multiple line items (invoice)
 * @param items - Array of items with quantity and price
 * @param businessState - Business state code
 * @param customerState - Customer state code
 * @returns Complete invoice with GST breakdown
 */
export function calculateInvoiceGST(
  items: Array<{
    product: ProductWithGST;
    quantity: number;
  }>,
  businessState: string,
  customerState: string,
  invoiceNumber: string,
  customerName: string,
  customerGSTIN?: string
): InvoiceWithGST {
  const transactionType = getTransactionType(businessState, customerState);
  
  let subtotal = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalGST = 0;
  let taxableAmount = 0;

  const processedItems = items.map((item) => {
    const { product, quantity } = item;
    
    // Get base price (excluding GST)
    const unitPriceExcludingGST = product.includesGST
      ? getPriceExcludingGST(product.price, product.gstRate)
      : product.price;
    
    const lineTotal = unitPriceExcludingGST * quantity;
    
    // Calculate GST for this line item
    const gstBreakdown = calculateGST(lineTotal, product.gstRate, transactionType);
    
    // Accumulate totals
    subtotal += lineTotal;
    totalCGST += gstBreakdown.cgst;
    totalSGST += gstBreakdown.sgst;
    totalIGST += gstBreakdown.igst;
    totalGST += gstBreakdown.totalGST;
    taxableAmount += lineTotal;

    return {
      product,
      quantity,
      unitPrice: unitPriceExcludingGST,
      gstBreakdown,
      totalAmount: gstBreakdown.totalAmount
    };
  });

  return {
    invoiceNumber,
    date: new Date().toISOString(),
    customerName,
    customerGSTIN,
    customerState,
    businessState,
    items: processedItems,
    subtotal,
    totalCGST,
    totalSGST,
    totalIGST,
    totalGST,
    grandTotal: subtotal + totalGST,
    taxableAmount
  };
}

/**
 * Validate GST number (GSTIN format)
 * Format: 22AAAAA0000A1Z5
 * @param gstin - GST Identification Number
 * @returns true if valid, false otherwise
 */
export function validateGSTIN(gstin: string): boolean {
  if (!gstin) return false;
  
  // GSTIN format: 15 characters
  // First 2: State code (01-37)
  // Next 10: PAN
  // Next 1: Entity number (1-9, A-Z)
  // Next 1: Z (default)
  // Last 1: Check digit (0-9, A-Z)
  const gstinRegex = /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  
  return gstinRegex.test(gstin.toUpperCase());
}

/**
 * Validate HSN code (Harmonized System of Nomenclature)
 * @param hsnCode - HSN code (4, 6, or 8 digits)
 * @returns true if valid, false otherwise
 */
export function validateHSNCode(hsnCode: string): boolean {
  if (!hsnCode) return false;
  
  // HSN can be 4, 6, or 8 digits
  const hsnRegex = /^[0-9]{4}$|^[0-9]{6}$|^[0-9]{8}$/;
  
  return hsnRegex.test(hsnCode);
}

/**
 * Format GST amount for display
 * @param amount - GST amount
 * @returns Formatted string with currency
 */
export function formatGSTAmount(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Generate GST summary for reporting
 * @param invoices - Array of invoices
 * @returns GST summary report
 */
export function generateGSTSummary(invoices: InvoiceWithGST[]): {
  totalSales: number;
  totalTaxableAmount: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalGST: number;
  invoiceCount: number;
  byGSTRate: Record<GSTRate, {
    taxableAmount: number;
    gstAmount: number;
    invoiceCount: number;
  }>;
} {
  const summary = {
    totalSales: 0,
    totalTaxableAmount: 0,
    totalCGST: 0,
    totalSGST: 0,
    totalIGST: 0,
    totalGST: 0,
    invoiceCount: invoices.length,
    byGSTRate: {} as Record<GSTRate, {
      taxableAmount: number;
      gstAmount: number;
      invoiceCount: number;
    }>
  };

  // Initialize GST rate breakdown
  Object.values(GST_RATES).forEach(rate => {
    summary.byGSTRate[rate] = {
      taxableAmount: 0,
      gstAmount: 0,
      invoiceCount: 0
    };
  });

  invoices.forEach(invoice => {
    summary.totalSales += invoice.grandTotal;
    summary.totalTaxableAmount += invoice.taxableAmount;
    summary.totalCGST += invoice.totalCGST;
    summary.totalSGST += invoice.totalSGST;
    summary.totalIGST += invoice.totalIGST;
    summary.totalGST += invoice.totalGST;

    // Breakdown by GST rate
    invoice.items.forEach(item => {
      const rate = item.product.gstRate;
      summary.byGSTRate[rate].taxableAmount += item.gstBreakdown.baseAmount;
      summary.byGSTRate[rate].gstAmount += item.gstBreakdown.totalGST;
    });

    // Count unique GST rates in invoice
    const uniqueRates = new Set(invoice.items.map(item => item.product.gstRate));
    uniqueRates.forEach(rate => {
      summary.byGSTRate[rate].invoiceCount += 1;
    });
  });

  return summary;
}

/**
 * Indian State Codes for GST
 */
export const INDIAN_STATES = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman and Diu',
  '26': 'Dadra and Nagar Haveli',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh'
} as const;

/**
 * Get state name from state code
 */
export function getStateName(stateCode: string): string {
  return INDIAN_STATES[stateCode as keyof typeof INDIAN_STATES] || 'Unknown State';
}

/**
 * Calculate Input Tax Credit (ITC)
 * For B2B transactions where GST can be claimed back
 * @param purchaseAmount - Amount paid including GST
 * @param gstRate - GST rate on purchase
 * @returns ITC claimable amount
 */
export function calculateITC(purchaseAmount: number, gstRate: GSTRate): number {
  const baseAmount = getPriceExcludingGST(purchaseAmount, gstRate);
  const gstAmount = purchaseAmount - baseAmount;
  return gstAmount;
}

/**
 * Generate GSTR-1 report data (Outward supplies)
 * @param invoices - Sales invoices for the period
 * @returns GSTR-1 report data
 */
export function generateGSTR1Report(invoices: InvoiceWithGST[]) {
  // B2B (Business to Business) - with GSTIN
  const b2b = invoices.filter(inv => inv.customerGSTIN);
  
  // B2C Large (Business to Consumer) - invoice value > ₹2.5 lakh
  const b2cLarge = invoices.filter(inv => !inv.customerGSTIN && inv.grandTotal > 250000);
  
  // B2C Small (Business to Consumer) - invoice value ≤ ₹2.5 lakh
  const b2cSmall = invoices.filter(inv => !inv.customerGSTIN && inv.grandTotal <= 250000);

  return {
    b2b: {
      count: b2b.length,
      totalTaxableValue: b2b.reduce((sum, inv) => sum + inv.taxableAmount, 0),
      totalTax: b2b.reduce((sum, inv) => sum + inv.totalGST, 0),
      invoices: b2b
    },
    b2cLarge: {
      count: b2cLarge.length,
      totalTaxableValue: b2cLarge.reduce((sum, inv) => sum + inv.taxableAmount, 0),
      totalTax: b2cLarge.reduce((sum, inv) => sum + inv.totalGST, 0)
    },
    b2cSmall: {
      count: b2cSmall.length,
      totalTaxableValue: b2cSmall.reduce((sum, inv) => sum + inv.taxableAmount, 0),
      totalTax: b2cSmall.reduce((sum, inv) => sum + inv.totalGST, 0)
    }
  };
}
