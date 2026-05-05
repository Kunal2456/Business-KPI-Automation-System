import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Printer } from 'lucide-react';
import {
  InvoiceWithGST,
  formatGSTAmount,
  validateGSTIN
} from '../utils/gstCalculations';

interface GSTInvoiceProps {
  invoice: InvoiceWithGST;
  businessName: string;
  businessGSTIN: string;
  businessAddress: string;
  darkMode?: boolean;
  onDownload?: () => void;
  onPrint?: () => void;
}

export function GSTInvoice({
  invoice,
  businessName,
  businessGSTIN,
  businessAddress,
  darkMode = false,
  onDownload,
  onPrint
}: GSTInvoiceProps) {
  const { t } = useTranslation();
  const isIntraState = invoice.businessState === invoice.customerState;

  return (
    <div className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg p-8`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-300 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t('invoice.tax_invoice')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('invoice.invoiceNo')}: {invoice.invoiceNumber}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('invoice.date')}: {new Date(invoice.date).toLocaleDateString('en-IN')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrint}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
            title={t('sales.printInvoice')}
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
            title={t('reports.downloadPdf')}
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Business & Customer Details */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* From */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">{t('common.name')}:</h3>
          <div className="text-sm">
            <p className="font-bold text-base">{businessName}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{businessAddress}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <span className="font-semibold">{t('invoice.gstin')}:</span> {businessGSTIN}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{t('common.state')}:</span> {invoice.businessState}
            </p>
          </div>
        </div>

        {/* To */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">{t('invoice.billedTo')}:</h3>
          <div className="text-sm">
            <p className="font-bold text-base">{invoice.customerName}</p>
            {invoice.customerGSTIN && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-semibold">{t('invoice.gstin')}:</span> {invoice.customerGSTIN}
                {validateGSTIN(invoice.customerGSTIN) && (
                  <span className="ml-2 text-green-600">✓ Valid</span>
                )}
              </p>
            )}
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{t('common.state')}:</span> {invoice.customerState}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {isIntraState ? '(Intra-State Supply)' : '(Inter-State Supply)'}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-700">
              <th className="text-left py-3 px-2">{t('invoice.itemDescription')}</th>
              <th className="text-left py-3 px-2">{t('invoice.hsnSac')}</th>
              <th className="text-right py-3 px-2">{t('invoice.qty')}</th>
              <th className="text-right py-3 px-2">{t('invoice.rate')}</th>
              <th className="text-right py-3 px-2">{t('invoice.gstRate')}</th>
              <th className="text-right py-3 px-2">{t('invoice.taxableValue')}</th>
              {isIntraState ? (
                <>
                  <th className="text-right py-3 px-2">{t('invoice.cgst')}</th>
                  <th className="text-right py-3 px-2">{t('invoice.sgst')}</th>
                </>
              ) : (
                <th className="text-right py-3 px-2">{t('invoice.igst')}</th>
              )}
              <th className="text-right py-3 px-2">{t('common.total')}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-3 px-2">{item.product.name}</td>
                <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                  {item.product.hsnCode || '-'}
                </td>
                <td className="text-right py-3 px-2">{item.quantity}</td>
                <td className="text-right py-3 px-2">
                  {formatGSTAmount(item.unitPrice)}
                </td>
                <td className="text-right py-3 px-2">{item.product.gstRate}%</td>
                <td className="text-right py-3 px-2">
                  {formatGSTAmount(item.gstBreakdown.baseAmount)}
                </td>
                {isIntraState ? (
                  <>
                    <td className="text-right py-3 px-2">
                      {formatGSTAmount(item.gstBreakdown.cgst)}
                    </td>
                    <td className="text-right py-3 px-2">
                      {formatGSTAmount(item.gstBreakdown.sgst)}
                    </td>
                  </>
                ) : (
                  <td className="text-right py-3 px-2">
                    {formatGSTAmount(item.gstBreakdown.igst)}
                  </td>
                )}
                <td className="text-right py-3 px-2 font-semibold">
                  {formatGSTAmount(item.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-full md:w-1/2">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-600 dark:text-gray-400">{t('invoice.totalTaxableValue')}:</span>
              <span className="font-semibold">{formatGSTAmount(invoice.taxableAmount)}</span>
            </div>

            {isIntraState ? (
              <>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">{t('invoice.cgst')}:</span>
                  <span>{formatGSTAmount(invoice.totalCGST)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">{t('invoice.sgst')}:</span>
                  <span>{formatGSTAmount(invoice.totalSGST)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">{t('invoice.igst')}:</span>
                <span>{formatGSTAmount(invoice.totalIGST)}</span>
              </div>
            )}

            <div className="flex justify-between py-3 border-t-2 border-gray-300 dark:border-gray-700">
              <span className="font-bold text-base">{t('sales.grandTotal')}:</span>
              <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                {formatGSTAmount(invoice.grandTotal)}
              </span>
            </div>

            <div className="flex justify-between py-2 bg-gray-50 dark:bg-gray-800 px-3 rounded">
              <span className="text-gray-600 dark:text-gray-400">Total GST:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatGSTAmount(invoice.totalGST)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GST Declaration */}
      <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Declaration:</strong> This is a computer-generated invoice and does not require a physical signature.
          All disputes are subject to jurisdiction of courts in {invoice.businessState}.
        </p>
        {invoice.customerGSTIN && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            <strong>Note:</strong> This is a B2B supply. Recipient is entitled to claim Input Tax Credit (ITC) on this invoice.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Generated by ShelfIQ - Smart Inventory Intelligence
        </p>
      </div>
    </div>
  );
}

// GST Summary Component
interface GSTSummaryProps {
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalGST: number;
  taxableAmount: number;
  darkMode?: boolean;
}

export function GSTSummary({
  totalCGST,
  totalSGST,
  totalIGST,
  totalGST,
  taxableAmount,
  darkMode = false
}: GSTSummaryProps) {
  const { t } = useTranslation();
  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold">{t('reports.summary')}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">{t('invoice.totalTaxableValue')}</span>
          <span className="font-semibold">{formatGSTAmount(taxableAmount)}</span>
        </div>

        {totalCGST > 0 && (
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">{t('invoice.cgst')}</span>
            <span className="text-blue-600 dark:text-blue-400">{formatGSTAmount(totalCGST)}</span>
          </div>
        )}

        {totalSGST > 0 && (
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">{t('invoice.sgst')}</span>
            <span className="text-green-600 dark:text-green-400">{formatGSTAmount(totalSGST)}</span>
          </div>
        )}

        {totalIGST > 0 && (
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">{t('invoice.igst')}</span>
            <span className="text-purple-600 dark:text-purple-400">{formatGSTAmount(totalIGST)}</span>
          </div>
        )}

        <div className="flex justify-between py-3 border-t-2 border-gray-300 dark:border-gray-700">
          <span className="font-bold">Total GST</span>
          <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
            {formatGSTAmount(totalGST)}
          </span>
        </div>
      </div>
    </div>
  );
}

// GST Rate Badge Component
interface GSTRateBadgeProps {
  rate: number;
}

export function GSTRateBadge({ rate }: GSTRateBadgeProps) {
  const colorMap: Record<number, string> = {
    0: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    5: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    12: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    18: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    28: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  };

  const colorClass = colorMap[rate] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${colorClass}`}>
      GST {rate}%
    </span>
  );
}
