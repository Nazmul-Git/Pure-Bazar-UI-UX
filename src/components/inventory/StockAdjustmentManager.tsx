import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_OUTLETS } from '../../data/initialData';
import { StockAdjustment } from '../../types';

export const StockAdjustmentManager: React.FC = () => {
  const { adjustments, products, createAdjustment, approveAdjustment, currentUser, settings } = useApp();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Central Warehouse');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantityChange, setQuantityChange] = useState('-2');
  const [reason, setReason] = useState<StockAdjustment['reason']>('Damage');
  const [notes, setNotes] = useState('');

  const threshold = settings.superAdminAdjustmentLimit;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    const qty = parseInt(quantityChange) || 0;
    const costImpact = qty * prod.costPrice;

    createAdjustment({
      location: selectedLocation,
      productId: prod.id,
      productName: prod.name,
      barcode: prod.barcode,
      quantityChange: qty,
      costImpact,
      reason,
      notes,
      requiresSuperAdminApproval: Math.abs(costImpact) > threshold,
      status: Math.abs(costImpact) > threshold && currentUser.role !== 'Super Admin' ? 'Pending Approval' : 'Approved',
      requestedBy: currentUser.fullName,
    });

    setIsNewOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Stock Adjustment & Shrinkage Control [NEW v3.2/3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Log inventory damage, expiry, theft, and discrepancies. Mandatory reason & Super Admin approval &gt; Tk {threshold.toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => setIsNewOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Stock Adjustment</span>
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Adjustment #</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Product & Barcode</th>
              <th className="px-4 py-3 text-center">Qty Delta</th>
              <th className="px-4 py-3 text-right">Cost Impact</th>
              <th className="px-4 py-3">Reason & Notes</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {adjustments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-400">
                  No stock adjustments recorded yet. Click "New Stock Adjustment" above.
                </td>
              </tr>
            ) : (
              adjustments.map(adj => (
                <tr key={adj.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {adj.adjNumber}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {adj.location}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {adj.productName}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">{adj.barcode}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold">
                    <span
                      className={
                        adj.quantityChange < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }
                    >
                      {adj.quantityChange > 0 ? `+${adj.quantityChange}` : adj.quantityChange}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    Tk {Math.abs(adj.costImpact).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {adj.reason}
                    </div>
                    <div className="text-[11px] text-neutral-500 italic">{adj.notes}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        adj.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {adj.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {adj.status === 'Pending Approval' ? (
                      currentUser.role === 'Super Admin' ? (
                        <button
                          onClick={() => approveAdjustment(adj.id)}
                          className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                        >
                          Super Admin Approve
                        </button>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-semibold flex items-center justify-end gap-1">
                          <ShieldAlert className="h-3 w-3" /> Awaiting Super Admin
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] text-neutral-400">
                        Approved by {adj.approvedBy || 'System'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Adjustment Modal */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Record Stock Adjustment
            </h3>

            <form onSubmit={handleCreate} className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Location:*
                </label>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value="Central Warehouse">Central Warehouse (Tejgaon)</option>
                  {INITIAL_OUTLETS.filter(o => o.type === 'Outlet').map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Product:*
                </label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Cost: Tk {p.costPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Qty Delta (- / +):*
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="-1, -5, or +2"
                    value={quantityChange}
                    onChange={e => setQuantityChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Reason (Mandatory):*
                  </label>
                  <select
                    value={reason}
                    onChange={e => setReason(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <option value="Damage">Damage</option>
                    <option value="Expiry">Expiry</option>
                    <option value="Loss / Theft">Loss / Theft</option>
                    <option value="Counting Correction">Counting Correction</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Audit Notes (Mandatory Details):*
                </label>
                <textarea
                  required
                  placeholder="Describe cause of damage or reason for count correction..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Submit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
