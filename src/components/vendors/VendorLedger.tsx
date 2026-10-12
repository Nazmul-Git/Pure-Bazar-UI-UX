import React, { useState } from 'react';
import { FileSpreadsheet, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VendorLedger: React.FC = () => {
  const { vendorLedgers, vendors } = useApp();
  const [selectedVendorId, setSelectedVendorId] = useState<string>('ALL');

  const filtered = vendorLedgers.filter(
    vl => selectedVendorId === 'ALL' || vl.vendorId === selectedVendorId
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Vendor Ledger & Earnings
          </h2>
          <p className="text-xs text-neutral-500">
            Automated line-by-line consignment sales postings, commission deductions, and net payable
          </p>
        </div>

        <select
          value={selectedVendorId}
          onChange={e => setSelectedVendorId(e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="ALL">All Consignment Vendors</option>
          {vendors.map(v => (
            <option key={v.id} value={v.id}>
              {v.shopName}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Posting Date</th>
              <th className="px-4 py-3">Vendor Trade Name</th>
              <th className="px-4 py-3">Order / Reference #</th>
              <th className="px-4 py-3">Entry Type</th>
              <th className="px-4 py-3 text-right">Standard Sale</th>
              <th className="px-4 py-3 text-center">Comm %</th>
              <th className="px-4 py-3 text-right">PureBazar Comm</th>
              <th className="px-4 py-3 text-right">Net Payable to Vendor</th>
              <th className="px-4 py-3 text-center">Payout Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-neutral-400">
                  No ledger lines for this selection.
                </td>
              </tr>
            ) : (
              filtered.map(vl => (
                <tr key={vl.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3 font-mono text-[11px] text-neutral-500">{vl.date}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                    {vl.vendorName}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-neutral-500">
                    {vl.orderNumber || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        vl.type === 'SALE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : vl.type === 'RETURN'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {vl.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    Tk {vl.standardPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold">
                    {vl.commissionPercent}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-neutral-600 dark:text-neutral-400 tabular-nums">
                    Tk {vl.commissionAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    Tk {vl.vendorPayable.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[10px] font-semibold text-neutral-500">
                      {vl.payoutStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
