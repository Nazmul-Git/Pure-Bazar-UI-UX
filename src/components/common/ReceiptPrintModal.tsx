import React from 'react';
import { X, Printer, CheckCircle, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PureBazarLogo } from './PureBazarLogo';

export const ReceiptPrintModal: React.FC = () => {
  const { receiptModalOrder, setReceiptModalOrder, settings } = useApp();

  if (!receiptModalOrder) return null;

  const order = receiptModalOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Bill Paid Successfully</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setReceiptModalOrder(null)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-neutral-800 dark:text-neutral-200 print:p-0 print:text-black">
          {/* Receipt Header */}
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-1">
              <PureBazarLogo size="sm" />
            </div>
            <p className="text-[11px] whitespace-pre-line text-neutral-600 dark:text-neutral-400">
              {settings.receiptHeader}
            </p>
            {settings.enableVatInvoice && (
              <p className="text-[10px] text-neutral-500">{settings.vatTaxNumber}</p>
            )}
            <div className="my-2 border-b border-dashed border-neutral-300 dark:border-neutral-700" />
          </div>

          {/* Bill Meta */}
          <div className="space-y-0.5 text-[11px]">
            <div className="flex justify-between">
              <span>Invoice:</span>
              <span className="font-bold">{order.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Order #:</span>
              <span>{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{order.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span>Outlet:</span>
              <span>{order.outletName}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier:</span>
              <span>{order.cashierName}</span>
            </div>
            {order.memberId && (
              <div className="mt-1 rounded bg-neutral-100 p-1 dark:bg-neutral-800 text-[10px]">
                <div className="font-bold text-emerald-700 dark:text-emerald-400">
                  Shareholder: {order.memberName}
                </div>
                <div>ID: {order.memberId} | Mob: {order.memberMobile}</div>
              </div>
            )}
          </div>

          <div className="my-2 border-b border-dashed border-neutral-300 dark:border-neutral-700" />

          {/* Line Items */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-neutral-500">
              <span>Item & Qty</span>
              <span>Total</span>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="text-[11px]">
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {item.productName}
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>
                    {item.quantity} x Tk {item.unitStandardPrice.toFixed(2)}
                  </span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    Tk {item.totalStandardPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="my-2 border-b border-dashed border-neutral-300 dark:border-neutral-700" />

          {/* Calculations */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Standard Total:</span>
              <span>Tk {order.standardTotal.toFixed(2)}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold dark:text-emerald-400">
                <span>Shareholder Discount (5%):</span>
                <span>- Tk {order.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between border-t border-neutral-300 pt-1 text-sm font-extrabold text-neutral-900 dark:border-neutral-700 dark:text-white">
              <span>Net Payable:</span>
              <span>Tk {order.finalPaidAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-neutral-600 dark:text-neutral-400 pt-1">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase">{order.paymentMethod}</span>
            </div>

            {order.probashiTxnId && (
              <div className="rounded border border-emerald-300/60 bg-emerald-50/50 p-1.5 text-[10px] dark:border-emerald-800/60 dark:bg-emerald-950/30">
                <div className="font-bold text-emerald-800 dark:text-emerald-300">
                  ProbashiHNR Verified:
                </div>
                <div className="text-[9px] text-neutral-600 dark:text-neutral-400 truncate">
                  Txn ID: {order.probashiTxnId}
                </div>
                <div className="text-[9px] text-neutral-600 dark:text-neutral-400">
                  Pay Code: {order.probashiPayCode || 'N/A'}
                </div>
              </div>
            )}
          </div>

          <div className="my-3 border-b border-dashed border-neutral-300 dark:border-neutral-700" />

          {/* Footer Notes */}
          <div className="text-center text-[10px] whitespace-pre-line text-neutral-500">
            {settings.receiptFooter}
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-neutral-200 p-3 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
          <button
            onClick={() => setReceiptModalOrder(null)}
            className="w-full rounded-xl bg-neutral-900 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Close & Start Next Bill
          </button>
        </div>
      </div>
    </div>
  );
};
