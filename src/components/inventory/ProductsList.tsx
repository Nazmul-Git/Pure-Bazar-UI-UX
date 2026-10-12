import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Barcode,
  Printer,
  AlertTriangle,
  Boxes,
  Store,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddProductModal } from './AddProductModal';
import { Product } from '../../types';

export const ProductsList: React.FC = () => {
  const { products, categories, activeOutlet, setActiveNav } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOwner = selectedOwner === 'ALL' || p.ownerType === selectedOwner;
    const matchesCategory = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    return matchesSearch && matchesOwner && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Products Catalog & Central Inventory
          </h2>
          <p className="text-xs text-neutral-500">
            Manage company-owned and vendor consignment products, pricing rules, and outlet stock
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav('inventory_barcodes')}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Barcodes</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, barcode, or SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-3 text-xs dark:border-neutral-700 dark:bg-neutral-800"
          />
        </div>

        {/* Owner filter */}
        <select
          value={selectedOwner}
          onChange={e => setSelectedOwner(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="ALL">All Owners</option>
          <option value="Company">Company Owned</option>
          <option value="Vendor">Vendor Consignment</option>
        </select>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="ALL">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
              <tr>
                <th className="px-4 py-3">Product & Barcode</th>
                <th className="px-4 py-3">Category & Brand</th>
                <th className="px-4 py-3">Stock Owner</th>
                <th className="px-4 py-3 text-right">Cost Price</th>
                <th className="px-4 py-3 text-right">Standard Price</th>
                <th className="px-4 py-3 text-right">Wallet Price (5%)</th>
                <th className="px-4 py-3 text-center">Central Warehouse</th>
                <th className="px-4 py-3 text-center">Outlet Stock</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredProducts.map(p => {
                const totalOutletStock = Object.values(p.outletStock).reduce((a, b) => a + b, 0);
                const totalStock = p.centralStock + totalOutletStock;
                const isLow = totalStock <= p.minStockAlert;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {p.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                        <span>{p.barcode}</span>
                        <span>·</span>
                        <span>{p.sku}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-800 dark:text-neutral-200">
                        {p.categoryName}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {p.brand} ({p.unit})
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.ownerType === 'Vendor'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {p.ownerType}
                      </span>
                      {p.vendorName && (
                        <div className="text-[10px] text-neutral-500 truncate max-w-[140px] mt-0.5" title={p.vendorName}>
                          {p.vendorName}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-500">
                      Tk {p.costPrice.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                      Tk {p.standardPrice.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                      Tk {(p.standardPrice * 0.95).toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-center font-mono font-bold tabular-nums">
                      <span className="rounded bg-neutral-100 px-2 py-0.5 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {p.centralStock} {p.unit}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center font-mono tabular-nums">
                      <span title={`Dhanmondi: ${p.outletStock['out-1'] || 0}, Gulshan: ${p.outletStock['out-2'] || 0}, Uttara: ${p.outletStock['out-3'] || 0}`}>
                        {totalOutletStock} {p.unit}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          <AlertTriangle className="h-3 w-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
