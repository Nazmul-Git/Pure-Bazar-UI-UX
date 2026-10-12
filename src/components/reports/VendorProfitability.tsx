import React from 'react';
import { Download, Users2, DollarSign, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VendorProfitability: React.FC = () => {
  const { vendors, vendorLedgers } = useApp();

  const vendorStats = vendors.map(v => {
    const ledgers = vendorLedgers.filter(vl => vl.vendorId === v.id);
    const totalSales = ledgers.reduce((s, l) => s + l.standardPrice, 0) || v.totalSalesValue;
    const totalCommission = ledgers.reduce((s, l) => s + l.commissionAmount, 0) || v.totalCommissionPaid;
    // Estimated 5% discount borne by company on their sales
    const discountBorne = totalSales * 0.05;
    const companyNetMargin = totalCommission - discountBorne;

    return {
      vendor: v,
      totalSales,
      totalCommission,
      discountBorne,
      companyNetMargin,
    };
  });

  const exportCSV = () => {
    let csv = 'Vendor Name,Shareholder ID,Category,Total Sales (BDT),PureBazar Commission (BDT),Discount Borne (BDT),Company Net Margin (BDT)\n';
    vendorStats.forEach(vs => {
      csv += `"${vs.vendor.shopName}","${vs.vendor.shareholderId}","${vs.vendor.categoryName}",${vs.totalSales},${vs.totalCommission},${vs.discountBorne},${vs.companyNetMargin}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PureBazar_Vendor_Profitability.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Vendor Profitability & Margin Ranking
          </h2>
          <p className="text-xs text-neutral-500">
            Determine which consignment supplier earns the highest net margin after discount recovery
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV / Excel</span>
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Vendor Trade Name</th>
              <th className="px-4 py-3">Shareholder ID</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Gross Sales Turnover</th>
              <th className="px-4 py-3 text-right">PureBazar Comm Earned</th>
              <th className="px-4 py-3 text-right">Discount Borne (5%)</th>
              <th className="px-4 py-3 text-right font-bold">Company Net Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {vendorStats.map(({ vendor, totalSales, totalCommission, discountBorne, companyNetMargin }) => (
              <tr key={vendor.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                  {vendor.shopName}
                </td>
                <td className="px-4 py-3 font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  {vendor.shareholderId}
                </td>
                <td className="px-4 py-3 text-neutral-500">{vendor.categoryName}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-800 dark:text-neutral-200">
                  Tk {totalSales.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                  Tk {totalCommission.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-lime-700 dark:text-lime-400">
                  Tk {discountBorne.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  Tk {companyNetMargin.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
