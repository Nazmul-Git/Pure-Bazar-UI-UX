import React from 'react';
import { Banknote, CheckCircle, Send, ArrowRight, ShieldCheck, History } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MonthlyPayout: React.FC = () => {
  const { monthlyStatements, executeVendorPayout, payouts, setActiveNav } = useApp();

  const approvedStatements = monthlyStatements.filter(s => s.status === 'Approved');

  const handlePayoutAll = () => {
    approvedStatements.forEach(s => {
      executeVendorPayout(s.id);
    });
    alert(`Successfully processed ${approvedStatements.length} vendor wallet payouts via Probashi API!`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Monthly Vendor Payout Approval [NEW v3.2/3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Approve and credit net payable to vendor's ProbashiHNR wallet through API (single or batch)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {approvedStatements.length > 0 && (
            <button
              onClick={handlePayoutAll}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Approve All Batch ({approvedStatements.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveNav('vendors_payout_history')}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <History className="h-3.5 w-3.5" />
            <span>Payout History</span>
          </button>
        </div>
      </div>

      {approvedStatements.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
          <h3 className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            All Approved Statements Settled
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            There are no pending statements awaiting payout disbursement. Generate statements in "Monthly Statements & Receipts".
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
              <tr>
                <th className="px-4 py-3">Statement #</th>
                <th className="px-4 py-3">Vendor Trade Name</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3 text-right">Net Payable Due</th>
                <th className="px-4 py-3 text-center">API Target Wallet</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {approvedStatements.map(stmt => (
                <tr key={stmt.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {stmt.statementNumber}
                  </td>
                  <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                    {stmt.vendorName}
                  </td>
                  <td className="px-4 py-3 font-mono text-neutral-500">{stmt.month}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    Tk {stmt.netPayable.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      Probashi Account
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        const res = executeVendorPayout(stmt.id);
                        if (res.success) {
                          alert(`Payout credited to ${stmt.vendorName}! Probashi Txn: ${res.txnId}`);
                        }
                      }}
                      className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                    >
                      <Send className="h-3 w-3" />
                      <span>Execute API Payout</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
