import React from 'react';
import { History, CheckCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PayoutHistory: React.FC = () => {
  const { payouts } = useApp();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Vendor Payout History Archive
        </h2>
        <p className="text-xs text-neutral-500">
          All vendor wallet disbursements processed through ProbashiHNR API with transaction IDs
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Batch Number</th>
              <th className="px-4 py-3">Vendor Trade Name</th>
              <th className="px-4 py-3">Probashi Wallet</th>
              <th className="px-4 py-3">Statement Ref</th>
              <th className="px-4 py-3 text-right">Amount Credited</th>
              <th className="px-4 py-3">Probashi Txn ID</th>
              <th className="px-4 py-3">Date Processed</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {payouts.map(po => (
              <tr key={po.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {po.payoutBatchNumber}
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  {po.vendorName}
                </td>
                <td className="px-4 py-3 font-mono text-neutral-600 dark:text-neutral-400">
                  {po.probashiWalletNumber}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-neutral-500">
                  {po.statementNumber}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  Tk {po.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {po.probashiTxnId}
                </td>
                <td className="px-4 py-3 text-neutral-500 text-[11px]">{po.processedAt}</td>
                <td className="px-4 py-3 text-center">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {po.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
