import React, { useState } from 'react';
import { ClipboardList, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_OUTLETS } from '../../data/initialData';

export const StockCountManager: React.FC = () => {
  const { products, activeOutlet, createAdjustment, currentUser } = useApp();
  const [selectedAuditLocation, setSelectedAuditLocation] = useState(activeOutlet.id);
  const [countedQuantities, setCountedQuantities] = useState<Record<string, number>>({});
  const [isFinalized, setIsFinalized] = useState(false);

  const isCentral = selectedAuditLocation === 'wh-central';

  const handleCountChange = (productId: string, val: string) => {
    const num = parseInt(val) || 0;
    setCountedQuantities(prev => ({ ...prev, [productId]: num }));
  };

  const handlePostDifferences = () => {
    products.forEach(p => {
      const systemStock = isCentral ? p.centralStock : p.outletStock[selectedAuditLocation] || 0;
      const physicalCount = countedQuantities[p.id] ?? systemStock;
      const difference = physicalCount - systemStock;

      if (difference !== 0) {
        const costImpact = difference * p.costPrice;
        createAdjustment({
          location: isCentral ? 'Central Warehouse' : selectedAuditLocation,
          productId: p.id,
          productName: p.name,
          barcode: p.barcode,
          quantityChange: difference,
          costImpact,
          reason: 'Counting Correction',
          notes: `Periodic physical count audit variance: system had ${systemStock}, counted ${physicalCount}`,
          requiresSuperAdminApproval: Math.abs(costImpact) > 5000,
          status: 'Approved',
          requestedBy: currentUser.fullName,
        });
      }
    });

    setIsFinalized(true);
    alert('Physical count differences successfully posted to Stock Adjustments!');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Stock Count & Physical Audit [NEW v3.2/3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Periodic physical count per outlet/warehouse; shows system vs counted and posts differences as adjustments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedAuditLocation}
            onChange={e => {
              setSelectedAuditLocation(e.target.value);
              setCountedQuantities({});
              setIsFinalized(false);
            }}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-800"
          >
            {INITIAL_OUTLETS.map(o => (
              <option key={o.id} value={o.id}>
                Audit: {o.name}
              </option>
            ))}
          </select>

          <button
            onClick={handlePostDifferences}
            disabled={isFinalized}
            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Post Count Discrepancies
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Product & Barcode</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-center">System Recorded Stock</th>
              <th className="px-4 py-3 text-center">Physically Counted</th>
              <th className="px-4 py-3 text-center">Variance (Delta)</th>
              <th className="px-4 py-3 text-right">Cost Variance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {products.map(p => {
              const systemStock = isCentral ? p.centralStock : p.outletStock[selectedAuditLocation] || 0;
              const physicalCount = countedQuantities[p.id] ?? systemStock;
              const delta = physicalCount - systemStock;

              return (
                <tr key={p.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">{p.barcode}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{p.categoryName}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold">
                    {systemStock} {p.unit}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={physicalCount}
                      onChange={e => handleCountChange(p.id, e.target.value)}
                      className="w-20 rounded border p-1 text-center font-bold dark:bg-neutral-800"
                    />
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold">
                    <span
                      className={
                        delta === 0
                          ? 'text-neutral-400'
                          : delta > 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }
                    >
                      {delta === 0 ? '0' : delta > 0 ? `+${delta}` : delta}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    Tk {(delta * p.costPrice).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
