import React, { useState } from 'react';
import {
  Clock,
  Banknote,
  Wallet,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Lock,
  Unlock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CashierShiftClose: React.FC = () => {
  const { activeShift, closeActiveShift, openNewShift, activeOutlet, currentUser } = useApp();
  const [actualCashInput, setActualCashInput] = useState('');
  const [notes, setNotes] = useState('');
  const [newOpeningCash, setNewOpeningCash] = useState('5000');
  const [isZReportModalOpen, setIsZReportModalOpen] = useState(false);

  const actualCash = parseFloat(actualCashInput) || 0;
  const variance = actualCash - activeShift.expectedCashInDrawer;

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualCashInput) {
      alert('Please enter the physically counted cash in drawer.');
      return;
    }
    closeActiveShift(actualCash, notes);
    setIsZReportModalOpen(true);
  };

  const handleStartShift = (e: React.FormEvent) => {
    e.preventDefault();
    const opening = parseFloat(newOpeningCash) || 0;
    openNewShift(opening);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Cashier Shift & Day Close (Z-Report)
        </h2>
        <p className="text-xs text-neutral-500">
          Reconcile physical cash drawer with offline sales breakdown per payment method
        </p>
      </div>

      {activeShift.status === 'CLOSED' ? (
        /* Shift is currently closed - Prompt to start new shift */
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Shift is Currently Closed
            </h3>
            <p className="text-xs text-neutral-500">
              Last shift ended at {activeShift.endTime}. Start a new shift to accept POS billing.
            </p>
          </div>

          <form onSubmit={handleStartShift} className="max-w-xs mx-auto space-y-3">
            <div className="text-left">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Opening Drawer Float (BDT):
              </label>
              <input
                type="number"
                value={newOpeningCash}
                onChange={e => setNewOpeningCash(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-sm font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5"
            >
              <Unlock className="h-4 w-4" />
              <span>Open New Cashier Shift</span>
            </button>
          </form>
        </div>
      ) : (
        /* Active Shift Summary & Day Close Form */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Shift Metrics Column (Left 2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                    Shift ID: {activeShift.id}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {activeShift.outletName} — Cashier: {activeShift.cashierName}
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  OPEN
                </span>
              </div>

              {/* Breakdown by Payment Channel */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/40">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <Banknote className="h-4 w-4 text-amber-600" />
                    <span>Opening Cash Drawer</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                    Tk {activeShift.openingCash.toFixed(2)}
                  </div>
                </div>

                <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/40">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <Banknote className="h-4 w-4 text-emerald-600" />
                    <span>Cash Sales Collected</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                    Tk {activeShift.cashSalesTotal.toFixed(2)}
                  </div>
                </div>

                <div className="rounded-lg bg-lime-50/60 p-3 dark:bg-lime-950/20 border border-lime-200/50 dark:border-lime-900/30">
                  <div className="flex items-center gap-1.5 text-lime-800 dark:text-lime-300 mb-1 font-semibold">
                    <Wallet className="h-4 w-4 text-lime-600" />
                    <span>Probashi Wallet (Auto-Settled)</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums text-lime-900 dark:text-lime-200">
                    Tk {activeShift.walletSalesTotal.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-lime-700/80 dark:text-lime-400">
                    Credited directly to merchant account
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50/60 p-3 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30">
                  <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 mb-1 font-semibold">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>Card & bKash Digital</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums text-blue-900 dark:text-blue-200">
                    Tk {(activeShift.cardSalesTotal + activeShift.bKashSalesTotal).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-blue-700/80 dark:text-blue-400">
                    POS terminal slip settlement
                  </div>
                </div>
              </div>

              {/* Total Shift Summary */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500">Gross Shift Sales ({activeShift.billCount} Bills):</span>
                  <div className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">
                    Tk {activeShift.totalSales.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500">Expected Physical Cash in Drawer:</span>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                    Tk {activeShift.expectedCashInDrawer.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Close Shift Form (Right 1 col) */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
            <form onSubmit={handleCloseShift} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  End of Day Cash Count
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Count physical bills & coins in cash drawer
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Actual Counted Cash (BDT):
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5940"
                  value={actualCashInput}
                  onChange={e => setActualCashInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-base font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
                  required
                />
              </div>

              {actualCashInput && (
                <div
                  className={`rounded-lg p-2.5 text-xs font-semibold ${
                    variance === 0
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : variance > 0
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <div className="flex justify-between">
                    <span>Cash Difference:</span>
                    <span className="font-mono">
                      {variance === 0 ? 'Tk 0.00 (Balanced)' : `Tk ${variance.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Closing Notes / Discrepancy Note:
                </label>
                <textarea
                  placeholder="Optional shift notes..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Lock className="h-4 w-4" />
                <span>Close Shift & Generate Z-Report</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Z-Report Modal */}
      {isZReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">
            <div className="text-center space-y-1 pb-3 border-b border-dashed">
              <h3 className="font-bold text-sm">PUREBAZAR DAY CLOSE (Z-REPORT)</h3>
              <p className="text-[11px] text-neutral-500">
                {activeShift.outletName} · Shift ID: {activeShift.id}
              </p>
              <p className="text-[10px] text-neutral-400">Cashier: {activeShift.cashierName}</p>
            </div>

            <div className="py-3 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Opening Cash:</span>
                <span>Tk {activeShift.openingCash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cash Sales:</span>
                <span>Tk {activeShift.cashSalesTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Expected Drawer Cash:</span>
                <span>Tk {activeShift.expectedCashInDrawer.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual Counted Cash:</span>
                <span>Tk {activeShift.closingCashActual?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Variance:</span>
                <span>Tk {activeShift.cashVariance?.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed my-1" />
              <div className="flex justify-between font-semibold text-emerald-700">
                <span>Probashi Wallet:</span>
                <span>Tk {activeShift.walletSalesTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Card & bKash:</span>
                <span>Tk {(activeShift.cardSalesTotal + activeShift.bKashSalesTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-1 border-t">
                <span>TOTAL SHIFT SALES:</span>
                <span>Tk {activeShift.totalSales.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Z-Report</span>
              </button>
              <button
                onClick={() => setIsZReportModalOpen(false)}
                className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
