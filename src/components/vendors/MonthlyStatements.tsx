import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Plus,
  CheckCircle,
  Clock,
  ArrowRight,
  Send,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VendorMonthlyStatement } from '../../types';

export const MonthlyStatements: React.FC = () => {
  const {
    monthlyStatements,
    vendors,
    generateMonthlyStatement,
    approveMonthlyStatement,
    executeVendorPayout,
    setActiveNav,
  } = useApp();

  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || '');
  const [targetMonth, setTargetMonth] = useState('2026-10');
  const [selectedStatementForPrint, setSelectedStatementForPrint] = useState<VendorMonthlyStatement | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateMonthlyStatement(selectedVendorId, targetMonth);
    setIsGenerateOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Monthly Vendor Statements & Receipts [NEW v3.2/3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Official monthly audit report: opening stock, received GRN, sold, closing stock, commission, and net payable
          </p>
        </div>

        <button
          onClick={() => setIsGenerateOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Generate Statement</span>
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Statement #</th>
              <th className="px-4 py-3">Vendor Trade Name</th>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3 text-right">Received Stock</th>
              <th className="px-4 py-3 text-right">Gross Sales</th>
              <th className="px-4 py-3 text-right">PureBazar Comm</th>
              <th className="px-4 py-3 text-right">Net Payable</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {monthlyStatements.map(stmt => (
              <tr key={stmt.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {stmt.statementNumber}
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  {stmt.vendorName}
                </td>
                <td className="px-4 py-3 font-mono text-neutral-500">{stmt.month}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-500">
                  Tk {stmt.receivedStockValue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                  Tk {stmt.grossSalesValue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-500">
                  Tk {stmt.commissionTotal.toLocaleString()} ({stmt.commissionPercent}%)
                </td>
                <td className="px-4 py-3 text-right font-mono font-black tabular-nums text-emerald-700 dark:text-emerald-400">
                  Tk {stmt.netPayable.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      stmt.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : stmt.status === 'Approved'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {stmt.status}
                  </span>
                  {stmt.probashiTxnId && (
                    <div className="text-[9px] font-mono text-neutral-400 mt-0.5">
                      {stmt.probashiTxnId}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {stmt.status === 'Draft' && (
                      <button
                        onClick={() => approveMonthlyStatement(stmt.id)}
                        className="rounded bg-blue-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                      >
                        Approve
                      </button>
                    )}
                    {stmt.status === 'Approved' && (
                      <button
                        onClick={() => {
                          const res = executeVendorPayout(stmt.id);
                          if (res.success) {
                            alert(`Payout successfully credited to vendor Probashi wallet! Txn: ${res.txnId}`);
                          }
                        }}
                        className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                      >
                        <Send className="h-3 w-3" /> Payout
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedStatementForPrint(stmt)}
                      className="p-1 rounded hover:bg-neutral-100 text-neutral-600 dark:hover:bg-neutral-800 dark:text-neutral-400"
                      title="Print official statement"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate Statement Modal */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Generate Vendor Monthly Statement
            </h3>

            <form onSubmit={handleGenerate} className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Vendor:*
                </label>
                <select
                  value={selectedVendorId}
                  onChange={e => setSelectedVendorId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.shopName} ({v.fullName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Billing Month:*
                </label>
                <input
                  type="month"
                  value={targetMonth}
                  onChange={e => setTargetMonth(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Generate Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Statement Modal */}
      {selectedStatementForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 border font-mono text-xs space-y-4">
            <div className="text-center border-b pb-3">
              <h3 className="font-bold text-sm">PUREBAZAR CONSIGNMENT STATEMENT & RECEIPT</h3>
              <p className="text-[11px] text-neutral-500">
                Statement #{selectedStatementForPrint.statementNumber} · Period: {selectedStatementForPrint.month}
              </p>
              <p className="text-[10px] text-neutral-400">
                Vendor: {selectedStatementForPrint.vendorName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-lg text-[11px]">
              <div>Opening Stock: Tk {selectedStatementForPrint.openingStockValue.toLocaleString()}</div>
              <div>Received (GRN): Tk {selectedStatementForPrint.receivedStockValue.toLocaleString()}</div>
              <div>Sold Stock: Tk {selectedStatementForPrint.soldStockValue.toLocaleString()}</div>
              <div>Closing Stock: Tk {selectedStatementForPrint.closingStockValue.toLocaleString()}</div>
            </div>

            <div className="border-t pt-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Gross POS Sales Value:</span>
                <span className="font-bold">Tk {selectedStatementForPrint.grossSalesValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>PureBazar Commission ({selectedStatementForPrint.commissionPercent}%):</span>
                <span>- Tk {selectedStatementForPrint.commissionTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-1 font-bold text-sm text-emerald-700 dark:text-emerald-400">
                <span>Net Payable to Vendor:</span>
                <span>Tk {selectedStatementForPrint.netPayable.toLocaleString()}</span>
              </div>
              {selectedStatementForPrint.probashiTxnId && (
                <div className="mt-2 rounded bg-emerald-50 p-2 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Probashi Payout Txn: {selectedStatementForPrint.probashiTxnId}
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <button
                onClick={() => setSelectedStatementForPrint(null)}
                className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
