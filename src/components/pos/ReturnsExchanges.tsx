import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Wallet,
  Receipt,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const ReturnsExchanges: React.FC = () => {
  const { orders, refundOrder } = useApp();
  const [searchInvoice, setSearchInvoice] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Customer changed mind / sealed package');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    const query = searchInvoice.trim().toLowerCase();
    const found = orders.find(
      o =>
        o.receiptNumber.toLowerCase().includes(query) ||
        o.orderNumber.toLowerCase().includes(query) ||
        (o.probashiTxnId && o.probashiTxnId.toLowerCase().includes(query))
    );
    if (found) {
      setSelectedOrder(found);
    } else {
      setSelectedOrder(null);
      alert('Invoice not found. Please verify the receipt number.');
    }
  };

  const handleProcessReturn = () => {
    if (!selectedOrder) return;
    const ok = refundOrder(selectedOrder.id, returnReason);
    if (ok) {
      setSuccessMessage(
        `Invoice ${selectedOrder.receiptNumber} successfully refunded! Stock has been returned to outlet, vendor ledger reversed, and wallet refund API executed.`
      );
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Returns & Exchanges Counter
        </h2>
        <p className="text-xs text-neutral-500">
          Process customer item returns with automatic stock replenishment and Probashi wallet reversal
        </p>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Invoice Search Card */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-xs font-semibold uppercase text-neutral-400 mb-2">
          Step 1: Locate Original POS Invoice
        </h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Receipt className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Enter Receipt Number (e.g. PB-REC-991201 or PB-REC-991202)..."
              value={searchInvoice}
              onChange={e => setSearchInvoice(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-xs dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Find Invoice
          </button>
        </form>

        {/* Quick picks from recent orders */}
        <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
          <span>Recent Receipts:</span>
          {orders.slice(0, 3).map(o => (
            <button
              key={o.id}
              onClick={() => setSelectedOrder(o)}
              className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-mono hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              {o.receiptNumber} ({o.paymentMethod})
            </button>
          ))}
        </div>
      </div>

      {/* Return Confirmation & Execution */}
      {selectedOrder && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
            <div>
              <span className="text-xs text-neutral-400">Selected Invoice:</span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                {selectedOrder.receiptNumber}
              </h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                selectedOrder.paymentStatus === 'PAID'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              Status: {selectedOrder.paymentStatus}
            </span>
          </div>

          {selectedOrder.paymentStatus === 'REFUNDED' ? (
            <div className="rounded-lg bg-neutral-100 p-3 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              This order has already been refunded.
            </div>
          ) : (
            <>
              {/* Order Items Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Items to Return to Outlet Stock:
                </h4>
                <div className="divide-y divide-neutral-100 border rounded-lg overflow-hidden dark:divide-neutral-800 dark:border-neutral-800 text-xs">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between bg-neutral-50/50 dark:bg-neutral-800/30">
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} · Price: Tk {item.unitStandardPrice} · Owner: {item.ownerType}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-right">
                        Tk {item.totalStandardPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Method & Rules Notice */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4" /> Refund Routing:
                </div>
                {selectedOrder.paymentMethod === 'WALLET' ? (
                  <p>
                    Original bill was paid via <strong>ProbashiHNR Wallet</strong>. The refund of{' '}
                    <strong>Tk {selectedOrder.finalPaidAmount.toFixed(2)}</strong> will be credited directly back to shareholder{' '}
                    <strong>{selectedOrder.memberName} ({selectedOrder.memberId})</strong> Current Balance via Probashi Reversal API.
                  </p>
                ) : (
                  <p>
                    Original bill was paid in <strong>{selectedOrder.paymentMethod}</strong>. Cashier will disburse cash from the drawer.
                  </p>
                )}
              </div>

              {/* Mandatory Reason */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Return Reason (Mandatory):
                </label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value="Customer changed mind / sealed package">Customer changed mind / sealed package</option>
                  <option value="Wrong item picked / exchanged">Wrong item picked / exchanged</option>
                  <option value="Packaging defect discovered at home">Packaging defect discovered at home</option>
                  <option value="Billing discrepancy correction">Billing discrepancy correction</option>
                </select>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-semibold hover:bg-neutral-100 dark:border-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessReturn}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Execute Refund of Tk {selectedOrder.finalPaidAmount.toFixed(2)}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
