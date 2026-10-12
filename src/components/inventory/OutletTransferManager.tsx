import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Plus,
  CheckCircle,
  Truck,
  PackageCheck,
  AlertTriangle,
  Clock,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_OUTLETS } from '../../data/initialData';

export const OutletTransferManager: React.FC = () => {
  const { transfers, products, createTransfer, dispatchTransfer, receiveTransfer, currentUser } = useApp();
  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);
  const [targetOutletId, setTargetOutletId] = useState('out-1');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [transferQty, setTransferQty] = useState('10');
  const [notes, setNotes] = useState('');

  const outletOptions = INITIAL_OUTLETS.filter(o => o.type === 'Outlet');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProductId);
    const targetOutlet = INITIAL_OUTLETS.find(o => o.id === targetOutletId);
    if (!prod || !targetOutlet) return;

    const qty = parseInt(transferQty) || 1;

    createTransfer({
      fromLocation: 'Central Warehouse (Tejgaon)',
      toOutletId: targetOutlet.id,
      toOutletName: targetOutlet.name,
      requestDate: new Date().toISOString().substring(0, 10),
      requestedBy: currentUser.fullName,
      status: 'Requested',
      notes,
      items: [
        {
          productId: prod.id,
          productName: prod.name,
          barcode: prod.barcode,
          unit: prod.unit,
          requestedQty: qty,
          dispatchedQty: qty,
          receivedQty: qty,
        },
      ],
    });

    setIsNewTransferOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Outlet Stock Transfer (Warehouse to Outlets)
          </h2>
          <p className="text-xs text-neutral-500">
            Track requisition, dispatch from Central Warehouse, and delivery confirmation by outlet cashiers
          </p>
        </div>

        <button
          onClick={() => setIsNewTransferOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Stock Requisition</span>
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Transfer #</th>
              <th className="px-4 py-3">Destination Outlet</th>
              <th className="px-4 py-3">Items Transferred</th>
              <th className="px-4 py-3">Requested By</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Workflow Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {transfers.map(tr => (
              <tr key={tr.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {tr.transferNumber}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {tr.toOutletName}
                  </div>
                  <div className="text-[10px] text-neutral-400">From: {tr.fromLocation}</div>
                </td>
                <td className="px-4 py-3">
                  {tr.items.map((i, idx) => (
                    <div key={idx} className="font-medium text-neutral-900 dark:text-neutral-100">
                      {i.productName} ({i.requestedQty} {i.unit})
                    </div>
                  ))}
                  {tr.notes && <div className="text-[10px] text-neutral-400 italic">Note: {tr.notes}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="text-neutral-700 dark:text-neutral-300">{tr.requestedBy}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">{tr.requestDate}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      tr.status === 'Received'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : tr.status === 'Dispatched'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {tr.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {tr.status === 'Requested' && (
                      <button
                        onClick={() => dispatchTransfer(tr.id)}
                        className="flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                        title="Dispatch from Central Warehouse"
                      >
                        <Truck className="h-3 w-3" /> Dispatch
                      </button>
                    )}
                    {tr.status === 'Dispatched' && (
                      <button
                        onClick={() => receiveTransfer(tr.id)}
                        className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                        title="Confirm receipt at outlet"
                      >
                        <PackageCheck className="h-3 w-3" /> Outlet Confirm
                      </button>
                    )}
                    {tr.status === 'Received' && (
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Stock Credited
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Requisition Modal */}
      {isNewTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              New Stock Requisition (Warehouse to Outlet)
            </h3>

            <form onSubmit={handleCreate} className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Destination Outlet:*
                </label>
                <select
                  value={targetOutletId}
                  onChange={e => setTargetOutletId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {outletOptions.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Select Product from Central Warehouse:*
                </label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Warehouse Stock: {p.centralStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Transfer Quantity:*
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferQty}
                  onChange={e => setTransferQty(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Notes:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekend stock replenishment"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTransferOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
