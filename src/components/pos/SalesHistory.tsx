import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Printer,
  RotateCcw,
  CheckCircle,
  Clock,
  Wallet,
  Banknote,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const SalesHistory: React.FC = () => {
  const { orders, setReceiptModalOrder, setActiveNav } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.memberName && o.memberName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.probashiTxnId && o.probashiTxnId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod = selectedMethod === 'ALL' || o.paymentMethod === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            POS Sales & Transaction History
          </h2>
          <p className="text-xs text-neutral-500">
            Audit offline POS sales, Probashi wallet receipts, and cashier invoices
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Method Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 text-xs dark:border-neutral-800 dark:bg-neutral-900">
            {['ALL', 'WALLET', 'CASH', 'CARD'].map(m => (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedMethod === m
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
                }`}
              >
                {m === 'ALL' ? 'All Methods' : m}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search order #, receipt, member, txn..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white py-1.5 pl-8 pr-3 text-xs dark:border-neutral-800 dark:bg-neutral-900"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
              <tr>
                <th className="px-4 py-3">Order / Receipt #</th>
                <th className="px-4 py-3">Outlet / Cashier</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Customer / Shareholder</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3 text-right">Standard Total</th>
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Paid Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-neutral-400">
                    No sales matching search criteria
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono">
                        {order.receiptNumber}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {order.orderNumber}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-800 dark:text-neutral-200">
                        {order.outletName}
                      </div>
                      <div className="text-[11px] text-neutral-400">{order.cashierName}</div>
                    </td>

                    <td className="px-4 py-3 text-neutral-500 font-mono text-[11px]">
                      {order.createdAt}
                    </td>

                    <td className="px-4 py-3">
                      {order.memberName ? (
                        <div>
                          <div className="font-medium text-emerald-700 dark:text-emerald-400">
                            {order.memberName}
                          </div>
                          <div className="text-[10px] font-mono text-neutral-400">
                            ID: {order.memberId}
                          </div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">Walk-in Customer</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {order.paymentMethod === 'WALLET' ? (
                          <span className="inline-flex items-center gap-1 font-bold text-lime-700 dark:text-lime-400">
                            <Wallet className="h-3.5 w-3.5" /> Probashi
                          </span>
                        ) : order.paymentMethod === 'CASH' ? (
                          <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
                            <Banknote className="h-3.5 w-3.5" /> Cash
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-400">
                            <CreditCard className="h-3.5 w-3.5" /> {order.paymentMethod}
                          </span>
                        )}
                      </div>
                      {order.probashiTxnId && (
                        <div className="text-[10px] font-mono text-neutral-400 truncate max-w-[120px]" title={order.probashiTxnId}>
                          {order.probashiTxnId}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-600 dark:text-neutral-300">
                      Tk {order.standardTotal.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      {order.discountAmount > 0 ? `- Tk ${order.discountAmount.toFixed(2)}` : 'Tk 0.00'}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-neutral-900 dark:text-white">
                      Tk {order.finalPaidAmount.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : order.paymentStatus === 'REFUNDED'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 rounded hover:bg-neutral-100 text-neutral-600 dark:hover:bg-neutral-800 dark:text-neutral-400"
                          title="View order breakdown"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setReceiptModalOrder(order)}
                          className="p-1 rounded hover:bg-neutral-100 text-neutral-600 dark:hover:bg-neutral-800 dark:text-neutral-400"
                          title="Reprint thermal receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Breakdown Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Bill Breakdown: {selectedOrder.receiptNumber}
                </h3>
                <p className="text-xs text-neutral-500 font-mono">{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between">
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {item.quantity} × Tk {item.unitStandardPrice} · Owner: {item.ownerType}
                        {item.vendorName ? ` (${item.vendorName})` : ''}
                      </div>
                      {item.ownerType === 'Vendor' && (
                        <div className="text-[10px] text-neutral-400">
                          Comm: Tk {item.commissionAmount} | Vendor Payable: Tk {item.vendorPayable}
                        </div>
                      )}
                    </div>
                    <div className="text-right font-mono font-bold">
                      Tk {item.totalStandardPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-1 text-xs border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between">
                  <span>Standard Total:</span>
                  <span className="font-mono">Tk {selectedOrder.standardTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Shareholder Discount:</span>
                  <span className="font-mono">- Tk {selectedOrder.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t">
                  <span>Final Paid Amount:</span>
                  <span className="font-mono">Tk {selectedOrder.finalPaidAmount.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.probashiTxnId && (
                <div className="rounded-lg bg-emerald-50 p-2 text-[11px] text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <div>Probashi Txn: {selectedOrder.probashiTxnId}</div>
                  <div>Shareholder: {selectedOrder.memberName} ({selectedOrder.memberId})</div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setReceiptModalOrder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50 dark:border-neutral-700"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
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
