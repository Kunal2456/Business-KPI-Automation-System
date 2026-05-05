import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  PieChart,
  BarChart3,
  IndianRupee,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  InvoiceWithGST,
  generateGSTSummary,
  generateGSTR1Report,
  formatGSTAmount,
  GST_RATES
} from '../utils/gstCalculations';
import { formatCurrency } from '../utils/kpiCalculations';

interface GSTReportsProps {
  invoices: InvoiceWithGST[];
  darkMode: boolean;
}

export function GSTReports({ invoices, darkMode }: GSTReportsProps) {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filter invoices by period
  const filteredInvoices = invoices.filter(inv => {
    const invDate = new Date(inv.date);
    const invYear = invDate.getFullYear();
    const invMonth = invDate.getMonth();

    if (selectedPeriod === 'month') {
      return invYear === selectedYear && invMonth === selectedMonth;
    } else if (selectedPeriod === 'quarter') {
      const quarter = Math.floor(selectedMonth / 3);
      const invQuarter = Math.floor(invMonth / 3);
      return invYear === selectedYear && invQuarter === quarter;
    } else {
      return invYear === selectedYear;
    }
  });

  const summary = generateGSTSummary(filteredInvoices);
  const gstr1 = generateGSTR1Report(filteredInvoices);

  const handleExportGSTR1 = () => {
    const csvContent = generateGSTR1CSV(gstr1);
    downloadCSV(csvContent, `GSTR1_${selectedYear}_${selectedMonth + 1}.csv`);
  };

  const handleExportGSTR3B = () => {
    const csvContent = generateGSTR3BCSV(summary);
    downloadCSV(csvContent, `GSTR3B_${selectedYear}_${selectedMonth + 1}.csv`);
  };

  const generateGSTR1CSV = (data: any) => {
    let csv = 'GSTR-1 Report\n\n';
    csv += 'Section,Count,Taxable Value,Tax Amount\n';
    csv += `B2B Invoices,${data.b2b.count},${data.b2b.totalTaxableValue},${data.b2b.totalTax}\n`;
    csv += `B2C Large,${data.b2cLarge.count},${data.b2cLarge.totalTaxableValue},${data.b2cLarge.totalTax}\n`;
    csv += `B2C Small,${data.b2cSmall.count},${data.b2cSmall.totalTaxableValue},${data.b2cSmall.totalTax}\n`;
    return csv;
  };

  const generateGSTR3BCSV = (data: any) => {
    let csv = 'GSTR-3B Report\n\n';
    csv += 'Description,Amount\n';
    csv += `Total Taxable Sales,${data.totalTaxableAmount}\n`;
    csv += `Total CGST,${data.totalCGST}\n`;
    csv += `Total SGST,${data.totalSGST}\n`;
    csv += `Total IGST,${data.totalIGST}\n`;
    csv += `Total GST,${data.totalGST}\n`;
    return csv;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getPeriodLabel = () => {
    if (selectedPeriod === 'month') {
      return `${months[selectedMonth]} ${selectedYear}`;
    } else if (selectedPeriod === 'quarter') {
      const quarter = Math.floor(selectedMonth / 3) + 1;
      return `Q${quarter} ${selectedYear}`;
    } else {
      return `${selectedYear}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('gst.title')}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('gst.period')}: {getPeriodLabel()}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportGSTR1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              {t('gst.exportGSTR1')}
            </button>
            <button
              onClick={handleExportGSTR3B}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              {t('gst.exportGSTR3B')}
            </button>
          </div>
        </div>

        {/* Period Selection */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className={`px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>

          {selectedPeriod === 'month' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className={`px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          )}

          {selectedPeriod === 'quarter' && (
            <select
              value={Math.floor(selectedMonth / 3)}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value) * 3)}
              className={`px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value={0}>Q1 (Jan-Mar)</option>
              <option value={1}>Q2 (Apr-Jun)</option>
              <option value={2}>Q3 (Jul-Sep)</option>
              <option value={3}>Q4 (Oct-Dec)</option>
            </select>
          )}

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className={`px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            {[2024, 2025, 2026, 2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('gst.totalSales')}</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(summary.totalSales)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500" />
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {summary.invoiceCount} {t('gst.invoices')}
          </p>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('gst.taxableAmount')}</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(summary.totalTaxableAmount)}
              </p>
            </div>
            <IndianRupee className="w-10 h-10 text-green-500" />
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('gst.beforeTax')}
          </p>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('gst.totalGST')}</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(summary.totalGST)}
              </p>
            </div>
            <PieChart className="w-10 h-10 text-indigo-500" />
          </div>
          <div className={`text-xs mt-2 space-y-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <p>CGST: {formatCurrency(summary.totalCGST)}</p>
            <p>SGST: {formatCurrency(summary.totalSGST)}</p>
            <p>IGST: {formatCurrency(summary.totalIGST)}</p>
          </div>
        </div>

        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('gst.gstRate')}</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {((summary.totalGST / summary.totalTaxableAmount) * 100).toFixed(2)}%
              </p>
            </div>
            <BarChart3 className="w-10 h-10 text-purple-500" />
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('gst.effectiveRate')}
          </p>
        </div>
      </div>

      {/* GSTR-1 Report */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <FileText className="w-5 h-5 inline mr-2" />
          {t('gst.gstr1Title')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* B2B */}
          <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>B2B Invoices</h4>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Business to Business (with GSTIN)</p>
            <div className="mt-3 space-y-1">
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Count: <span className="font-semibold">{gstr1.b2b.count}</span>
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Taxable: <span className="font-semibold">{formatCurrency(gstr1.b2b.totalTaxableValue)}</span>
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Tax: <span className="font-semibold">{formatCurrency(gstr1.b2b.totalTax)}</span>
              </p>
            </div>
          </div>

          {/* B2C Large */}
          <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>B2C Large</h4>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Invoice value {'>'} ₹2.5 Lakh</p>
            <div className="mt-3 space-y-1">
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Count: <span className="font-semibold">{gstr1.b2cLarge.count}</span>
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Taxable: <span className="font-semibold">{formatCurrency(gstr1.b2cLarge.totalTaxableValue)}</span>
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Tax: <span className="font-semibold">{formatCurrency(gstr1.b2cLarge.totalTax)}</span>
              </p>
            </div>
          </div>

          {/* B2C Small */}
          <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-500" />
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>B2C Small</h4>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Invoice value ≤ ₹2.5 Lakh</p>
            <div className="mt-3 space-y-1">
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Count: <span className="font-semibold">{gstr1.b2cSmall.count}</span>
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Taxable: <span className="font-semibold">{formatCurrency(gstr1.b2cSmall.totalTaxableValue)}</span>
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Tax: <span className="font-semibold">{formatCurrency(gstr1.b2cSmall.totalTax)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GST Rate Breakdown */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <PieChart className="w-5 h-5 inline mr-2" />
          {t('gst.rateWiseBreakdown')}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('gst.gstRate')}</th>
                <th className={`text-right p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('gst.taxableAmount')}</th>
                <th className={`text-right p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('gst.gstAmount')}</th>
                <th className={`text-right p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('gst.totalAmount')}</th>
                <th className={`text-right p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('gst.invoices')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.byGSTRate).map(([rate, data]) => (
                data.taxableAmount > 0 && (
                  <tr key={rate} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`p-3 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rate}%</td>
                    <td className={`text-right p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatCurrency(data.taxableAmount)}
                    </td>
                    <td className={`text-right p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatCurrency(data.gstAmount)}
                    </td>
                    <td className={`text-right p-3 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(data.taxableAmount + data.gstAmount)}
                    </td>
                    <td className={`text-right p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {data.invoiceCount}
                    </td>
                  </tr>
                )
              ))}
              <tr className={`border-t-2 ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                <td className={`p-3 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('gst.total')}</td>
                <td className={`text-right p-3 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(summary.totalTaxableAmount)}
                </td>
                <td className={`text-right p-3 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(summary.totalGST)}
                </td>
                <td className={`text-right p-3 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(summary.totalSales)}
                </td>
                <td className={`text-right p-3 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {summary.invoiceCount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
