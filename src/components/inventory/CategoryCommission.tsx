import React, { useState } from 'react';
import {
  Percent,
  Plus,
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CategoryCommission: React.FC = () => {
  const { categories, addCategory, updateCategoryCommission, settings } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatComm, setNewCatComm] = useState('10');
  const [newCatDesc, setNewCatDesc] = useState('');

  const discountPercent = settings.shareholderDiscountPercent;

  const handleStartEdit = (catId: string, currentComm: number) => {
    setEditingId(catId);
    setEditValue(currentComm.toString());
  };

  const handleSaveEdit = (catId: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      updateCategoryCommission(catId, val);
    }
    setEditingId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), parseFloat(newCatComm) || 10, newCatDesc.trim());
    setIsAddOpen(false);
    setNewCatName('');
    setNewCatComm('10');
    setNewCatDesc('');
  };

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Category & Commission Architecture [UPDATED v3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Configure PureBazar commission margin per product category for vendor consignment stock
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Critical Mathematical Logic Callout (Part 2 & Part 3B) */}
      <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 text-xs dark:border-amber-900/60 dark:bg-amber-950/30">
        <div className="flex items-start gap-2.5">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-amber-900 dark:text-amber-200">
            <h4 className="font-bold text-sm">
              Commission vs Shareholder Discount Recovery Rule:
            </h4>
            <p className="leading-relaxed">
              PureBazar bears the <strong>{discountPercent}% shareholder discount</strong> on every wallet payment. The vendor payable is <em>never reduced</em> by the shareholder discount (Vendor Payable = Standard Price − Category Commission %).
            </p>
            <div className="mt-2 rounded-lg bg-white/80 dark:bg-neutral-900/80 p-2.5 font-mono text-[11px] border border-amber-200 dark:border-neutral-800">
              <div>• <strong>Vendor Payable</strong> = Standard Price − Commission %</div>
              <div>• <strong>Company Net Revenue</strong> = Category Commission % − Shareholder Discount ({discountPercent}%)</div>
              <div className="text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                Recommendation: Set each category commission strictly above {discountPercent}% to ensure positive net profit!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Category Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center">PureBazar Commission %</th>
              <th className="px-4 py-3 text-center">Shareholder Discount</th>
              <th className="px-4 py-3 text-center">Company Net Margin</th>
              <th className="px-4 py-3 text-center">Worked Example (Tk 1,000 Bill)</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {categories.map(cat => {
              const isEditing = editingId === cat.id;
              const netMargin = cat.commissionPercent - discountPercent;
              const isRisky = netMargin <= 0;

              return (
                <tr
                  key={cat.id}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                    {cat.name}
                  </td>

                  <td className="px-4 py-3 text-neutral-500">
                    {cat.description || 'General retail goods'}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="w-16 rounded border border-neutral-300 p-1 text-center font-bold dark:border-neutral-700 dark:bg-neutral-800"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          className="rounded bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span className="font-mono font-extrabold text-sm text-neutral-900 dark:text-neutral-100 tabular-nums">
                        {cat.commissionPercent}%
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center font-mono text-neutral-500">
                    {discountPercent}% (Borne by PureBazar)
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-mono tabular-nums ${
                        isRisky
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {netMargin > 0 ? `+${netMargin}%` : `${netMargin}%`}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                    <div>Vendor gets: Tk {1000 - (1000 * cat.commissionPercent) / 100}</div>
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">
                      Company nets: Tk {1000 * (netMargin / 100)}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(cat.id, cat.commissionPercent)}
                        className="text-emerald-600 hover:underline font-semibold"
                      >
                        Edit %
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Create New Product Category
            </h3>

            <form onSubmit={handleCreateCategory} className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Category Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Cosmetics"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  PureBazar Commission %:
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="50"
                  value={newCatComm}
                  onChange={e => setNewCatComm(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
                />
                <span className="text-[10px] text-neutral-500">
                  Must be above {discountPercent}% to recover shareholder discount
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Description:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Skin care, hair care products"
                  value={newCatDesc}
                  onChange={e => setNewCatDesc(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
