import React, { useState } from 'react';
import { Boxes, Search, AlertTriangle, ArrowRight, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CentralWarehouseStock: React.FC = () => {
  const { products, setActiveNav } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWhUnits = products.reduce((sum, p) => sum + p.centralStock, 0);
  const totalWhValuation = products.reduce((sum, p) => sum + p.centralStock * p.costPrice, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Central Warehouse Stock (Tejgaon Hub)
          </h2>
          <p className="text-xs text-neutral-500">
            Live central reserve inventory feeding regional retail outlets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav('inventory_grn')}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            + Goods Receive (GRN)
          </button>
          <button
            onClick={() => setActiveNav('inventory_transfers')}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            Dispatch to Outlet
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Total Units in Hub</span>
          <div className="mt-1 text-xl font-black tabular-nums text-neutral-900 dark:text-neutral-100">
            {totalWhUnits.toLocaleString()} Units
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Inventory Valuation (Cost)</span>
          <div className="mt-1 text-xl font-black tabular-nums text-emerald-700 dark:text-emerald-400">
            Tk {totalWhValuation.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Active Catalog SKUs</span>
          <div className="mt-1 text-xl font-black tabular-nums text-neutral-900 dark:text-neutral-100">
            {products.length} SKUs
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Filter Central Warehouse inventory..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white py-1.5 pl-8 pr-3 text-xs dark:border-neutral-800 dark:bg-neutral-900"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Barcode</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3 text-right">Cost</th>
              <th className="px-4 py-3 text-center">Warehouse Stock</th>
              <th className="px-4 py-3 text-right">Valuation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                  {p.name}
                </td>
                <td className="px-4 py-3 font-mono text-neutral-400 text-[11px]">{p.barcode}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{p.categoryName}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800">
                    {p.ownerType}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-500">
                  Tk {p.costPrice}
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                  {p.centralStock} {p.unit}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  Tk {(p.centralStock * p.costPrice).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
