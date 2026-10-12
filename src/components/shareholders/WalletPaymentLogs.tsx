import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WalletPaymentLogs: React.FC = () => {
  const { walletLogs } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filtered = walletLogs.filter(
    l => selectedStatus === 'ALL' || l.status === selectedStatus
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            ProbashiHNR Wallet Payment Logs
          </h2>
          <p className="text-xs text-neutral-500">
            Immutable audit of every wallet payment attempt: SUCCESS, FAILED, EXPIRED, CANCELLED, REFUNDED
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 text-xs dark:border-neutral-800 dark:bg-neutral-900">
          {['ALL', 'SUCCESS', 'FAILED', 'EXPIRED', 'REFUNDED'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedStatus === st
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Payment ID (pid)</th>
              <th className="px-4 py-3">Shareholder</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Reason / Probashi Txn</th>
              <th className="px-4 py-3">Cashier & Outlet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.map(log => (
              <tr key={log.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-mono text-[11px] text-neutral-500">{log.timestamp}</td>
                <td className="px-4 py-3 font-mono text-neutral-800 dark:text-neutral-200">
                  {log.orderNumber}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-neutral-400">{log.paymentId}</td>
                <td className="px-4 py-3 font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                  {log.memberId || 'Guest'}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-neutral-900 dark:text-white">
                  Tk {log.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'SUCCESS'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : log.status === 'FAILED'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : log.status === 'REFUNDED'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {log.probashiTxnId && (
                    <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {log.probashiTxnId}
                    </div>
                  )}
                  {log.reason && (
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                      {log.reason}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  <div>{log.cashier}</div>
                  <div className="text-[10px] text-neutral-400">{log.outlet}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
