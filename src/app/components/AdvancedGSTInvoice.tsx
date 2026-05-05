import { useTranslation } from 'react-i18next';
import { InvoiceWithGST } from '../utils/gstCalculations';
import { formatCurrency } from '../utils/kpiCalculations';
import { StoreLocation } from '../utils/gstinLookup';

interface AdvancedGSTInvoiceProps {
  invoice: InvoiceWithGST;
  store: StoreLocation;
  customerAddress?: string;
  customerEmail?: string;
  customerPhone?: string;
  reverseCharge?: boolean;
  placeOfSupply?: string;
  transportMode?: string;
  vehicleNumber?: string;
  dateOfSupply?: string;
  eWayBillNo?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  terms?: string[];
  signature?: string;
  declarationText?: string;
}

export function AdvancedGSTInvoice({
  invoice,
  store,
  customerAddress,
  customerEmail,
  customerPhone,
  reverseCharge = false,
  placeOfSupply,
  transportMode,
  vehicleNumber,
  dateOfSupply,
  eWayBillNo,
  bankDetails,
  terms,
  signature,
  declarationText
}: AdvancedGSTInvoiceProps) {
  const { t } = useTranslation();
  const isInterState = invoice.businessState !== invoice.customerState;
  const today = new Date();
  const invoiceDate = new Date(invoice.date);

  // Helper to convert number to words (for legal amount)
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';

    const lakhs = Math.floor(num / 100000);
    const thousands = Math.floor((num % 100000) / 1000);
    const hundreds = Math.floor((num % 1000) / 100);
    const remainder = Math.floor(num % 100);

    let result = '';

    if (lakhs > 0) {
      result += ones[lakhs] + ' Lakh ';
    }
    if (thousands > 0) {
      if (thousands < 10) {
        result += ones[thousands] + ' Thousand ';
      } else {
        const tensPlace = Math.floor(thousands / 10);
        const onesPlace = thousands % 10;
        result += tens[tensPlace] + ' ' + ones[onesPlace] + ' Thousand ';
      }
    }
    if (hundreds > 0) {
      result += ones[hundreds] + ' Hundred ';
    }
    if (remainder > 0) {
      if (remainder < 10) {
        result += ones[remainder];
      } else if (remainder < 20) {
        result += teens[remainder - 10];
      } else {
        const tensPlace = Math.floor(remainder / 10);
        const onesPlace = remainder % 10;
        result += tens[tensPlace] + ' ' + ones[onesPlace];
      }
    }

    return result.trim();
  };

  const amountInWords = `Rupees ${numberToWords(Math.floor(invoice.grandTotal))} Only`;

  return (
    <div className="bg-white text-black p-8 max-w-[210mm] mx-auto" style={{ fontSize: '12px' }}>
      {/* Header */}
      <div className="border-2 border-black">
        {/* Top Header */}
        <div className="border-b-2 border-black p-4 bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-indigo-600 mb-1">{store.name}</h1>
            <p className="text-sm">{store.address}, {store.city}, {store.state} - {store.pincode}</p>
            <p className="text-sm">
              {store.phone && `Phone: ${store.phone}`}
              {store.email && ` | Email: ${store.email}`}
            </p>
            {store.gstin && (
              <p className="text-sm font-semibold mt-1">GSTIN: {store.gstin}</p>
            )}
          </div>
        </div>

        {/* Tax Invoice Label */}
        <div className="border-b-2 border-black p-2 bg-indigo-600 text-white text-center">
          <h2 className="text-xl font-bold">{t('invoice.tax_invoice')}</h2>
          {reverseCharge && (
            <p className="text-sm">({t('invoice.reverseCharge')} Applicable)</p>
          )}
        </div>

        {/* Invoice Details & Customer Details */}
        <div className="grid grid-cols-2 border-b-2 border-black">
          {/* Invoice Details */}
          <div className="border-r-2 border-black p-3">
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="font-semibold py-1">{t('invoice.invoiceNo')}:</td>
                  <td className="text-right">{invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1">{t('invoice.date')}:</td>
                  <td className="text-right">{invoiceDate.toLocaleDateString('en-IN')}</td>
                </tr>
                {dateOfSupply && (
                  <tr>
                    <td className="font-semibold py-1">Date of Supply:</td>
                    <td className="text-right">{dateOfSupply}</td>
                  </tr>
                )}
                <tr>
                  <td className="font-semibold py-1">{t('invoice.placeOfSupply')}:</td>
                  <td className="text-right">{placeOfSupply || invoice.customerState}</td>
                </tr>
                {reverseCharge && (
                  <tr>
                    <td className="font-semibold py-1">{t('invoice.reverseCharge')}:</td>
                    <td className="text-right">{t('common.yes')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Customer Details */}
          <div className="p-3">
            <h3 className="font-bold text-sm mb-2">{t('invoice.billedTo')}:</h3>
            <p className="font-semibold">{invoice.customerName}</p>
            {customerAddress && <p className="text-xs mt-1">{customerAddress}</p>}
            {invoice.customerGSTIN && (
              <p className="text-xs mt-1 font-semibold">{t('invoice.gstin')}: {invoice.customerGSTIN}</p>
            )}
            {customerPhone && <p className="text-xs">{t('common.phone')}: {customerPhone}</p>}
            {customerEmail && <p className="text-xs">{t('common.email')}: {customerEmail}</p>}
            <p className="text-xs mt-1">{t('common.state')}: {invoice.customerState}</p>
          </div>
        </div>

        {/* Transport Details (if applicable) */}
        {(transportMode || vehicleNumber || eWayBillNo) && (
          <div className="border-b-2 border-black p-3 bg-gray-50">
            <h3 className="font-bold text-sm mb-2">Transport Details:</h3>
            <div className="grid grid-cols-3 gap-4 text-xs">
              {transportMode && (
                <div>
                  <span className="font-semibold">Mode: </span>
                  {transportMode}
                </div>
              )}
              {vehicleNumber && (
                <div>
                  <span className="font-semibold">Vehicle No: </span>
                  {vehicleNumber}
                </div>
              )}
              {eWayBillNo && (
                <div>
                  <span className="font-semibold">E-Way Bill: </span>
                  {eWayBillNo}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items Table */}
        <div className="border-b-2 border-black">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black">
                <th className="border-r border-black p-2 text-left w-8">#</th>
                <th className="border-r border-black p-2 text-left">{t('invoice.itemDescription')}</th>
                <th className="border-r border-black p-2 text-center w-20">{t('invoice.hsnSac')}</th>
                <th className="border-r border-black p-2 text-center w-16">{t('invoice.qty')}</th>
                <th className="border-r border-black p-2 text-right w-20">{t('invoice.rate')}</th>
                <th className="border-r border-black p-2 text-right w-20">{t('invoice.amount')}</th>
                <th className="border-r border-black p-2 text-center w-16">{t('invoice.gstRate')}</th>
                {isInterState ? (
                  <th className="border-r border-black p-2 text-right w-20">{t('invoice.igst')}</th>
                ) : (
                  <>
                    <th className="border-r border-black p-2 text-right w-20">{t('invoice.cgst')}</th>
                    <th className="border-r border-black p-2 text-right w-20">{t('invoice.sgst')}</th>
                  </>
                )}
                <th className="p-2 text-right w-24">{t('common.total')}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="border-r border-gray-300 p-2">{index + 1}</td>
                  <td className="border-r border-gray-300 p-2">{item.product.name}</td>
                  <td className="border-r border-gray-300 p-2 text-center">{item.product.hsnCode || '-'}</td>
                  <td className="border-r border-gray-300 p-2 text-center">{item.quantity}</td>
                  <td className="border-r border-gray-300 p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="border-r border-gray-300 p-2 text-right">{formatCurrency(item.gstBreakdown.baseAmount)}</td>
                  <td className="border-r border-gray-300 p-2 text-center">{item.product.gstRate}%</td>
                  {isInterState ? (
                    <td className="border-r border-gray-300 p-2 text-right">{formatCurrency(item.gstBreakdown.igst)}</td>
                  ) : (
                    <>
                      <td className="border-r border-gray-300 p-2 text-right">{formatCurrency(item.gstBreakdown.cgst)}</td>
                      <td className="border-r border-gray-300 p-2 text-right">{formatCurrency(item.gstBreakdown.sgst)}</td>
                    </>
                  )}
                  <td className="p-2 text-right font-semibold">{formatCurrency(item.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax Summary */}
        <div className="border-b-2 border-black bg-gray-50 p-3">
          <div className="grid grid-cols-2 gap-8">
            {/* Tax Breakdown */}
            <div>
              <h3 className="font-bold text-sm mb-2">Tax Breakdown:</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left p-1">HSN/SAC</th>
                    <th className="text-right p-1">Taxable Amt</th>
                    <th className="text-center p-1">Rate</th>
                    {isInterState ? (
                      <th className="text-right p-1">IGST</th>
                    ) : (
                      <>
                        <th className="text-right p-1">CGST</th>
                        <th className="text-right p-1">SGST</th>
                      </>
                    )}
                    <th className="text-right p-1">Total Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-1">{item.product.hsnCode || '-'}</td>
                      <td className="text-right p-1">{formatCurrency(item.gstBreakdown.baseAmount)}</td>
                      <td className="text-center p-1">{item.product.gstRate}%</td>
                      {isInterState ? (
                        <td className="text-right p-1">{formatCurrency(item.gstBreakdown.igst)}</td>
                      ) : (
                        <>
                          <td className="text-right p-1">{formatCurrency(item.gstBreakdown.cgst)}</td>
                          <td className="text-right p-1">{formatCurrency(item.gstBreakdown.sgst)}</td>
                        </>
                      )}
                      <td className="text-right p-1 font-semibold">{formatCurrency(item.gstBreakdown.totalGST)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="font-semibold p-2">{t('invoice.totalTaxableValue')}:</td>
                    <td className="text-right p-2">{formatCurrency(invoice.taxableAmount)}</td>
                  </tr>
                  {isInterState ? (
                    <tr className="border-b border-gray-300">
                      <td className="font-semibold p-2">{t('invoice.igst')}:</td>
                      <td className="text-right p-2">{formatCurrency(invoice.totalIGST)}</td>
                    </tr>
                  ) : (
                    <>
                      <tr className="border-b border-gray-300">
                        <td className="font-semibold p-2">{t('invoice.cgst')}:</td>
                        <td className="text-right p-2">{formatCurrency(invoice.totalCGST)}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="font-semibold p-2">{t('invoice.sgst')}:</td>
                        <td className="text-right p-2">{formatCurrency(invoice.totalSGST)}</td>
                      </tr>
                    </>
                  )}
                  <tr className="border-b-2 border-black bg-indigo-50">
                    <td className="font-bold p-2 text-base">{t('sales.grandTotal')}:</td>
                    <td className="text-right p-2 font-bold text-base">{formatCurrency(invoice.grandTotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-2 text-xs italic">
                      <strong>Amount in Words:</strong><br />
                      {amountInWords}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        {bankDetails && (
          <div className="border-b-2 border-black p-3">
            <h3 className="font-bold text-sm mb-2">{t('invoice.bankDetails')}:</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p><span className="font-semibold">{t('invoice.bankName')}:</span> {bankDetails.bankName}</p>
                <p><span className="font-semibold">{t('invoice.accountNumber')}:</span> {bankDetails.accountNumber}</p>
              </div>
              <div>
                <p><span className="font-semibold">{t('invoice.ifscCode')}:</span> {bankDetails.ifscCode}</p>
                <p><span className="font-semibold">{t('invoice.branch')}:</span> {bankDetails.branch}</p>
              </div>
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        {terms && terms.length > 0 && (
          <div className="border-b-2 border-black p-3 bg-gray-50">
            <h3 className="font-bold text-sm mb-2">{t('invoice.termsAndConditions')}:</h3>
            <ol className="text-xs list-decimal list-inside space-y-1">
              {terms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Declaration & Signature */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-8">
            {/* Declaration */}
            <div className="text-xs">
              <h3 className="font-bold mb-2">Declaration:</h3>
              <p className="italic">
                {declarationText || 
                  "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct."}
              </p>
            </div>

            {/* Signature */}
            <div className="text-xs text-right">
              <p className="font-bold mb-12">For {store.name}</p>
              {signature && (
                <div className="mb-2">
                  <img src={signature} alt="Signature" className="h-12 ml-auto" />
                </div>
              )}
              <p className="border-t border-black inline-block px-4 pt-1">{t('invoice.authorizedSignature')}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black p-2 bg-indigo-600 text-white text-center text-xs">
          <p>This is a computer-generated invoice and does not require a physical signature</p>
        </div>
      </div>
    </div>
  );
}
