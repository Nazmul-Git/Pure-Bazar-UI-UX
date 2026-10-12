import React, { useState } from 'react';
import { Plus, Tag, Scale, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BrandUnitManager: React.FC = () => {
  const [brands, setBrands] = useState([
    { id: 'b1', name: 'Rafiq Agro', code: 'RAFIQ', count: 2 },
    { id: 'b2', name: 'Shuddho Organic', code: 'SHUDDHO', count: 1 },
    { id: 'b3', name: 'PureBazar Choice', code: 'PBC', count: 3 },
    { id: 'b4', name: 'Natore Ghee', code: 'NATORE', count: 1 },
    { id: 'b5', name: 'Bangla Pure', code: 'BANGLA', count: 2 },
  ]);

  const [units, setUnits] = useState([
    { id: 'u1', name: 'Kg', description: 'Kilogram (Weight measurement)' },
    { id: 'u2', name: 'Gram', description: 'Gram (Fine weight measurement)' },
    { id: 'u3', name: 'Ltr', description: 'Liter (Liquid volume)' },
    { id: 'u4', name: 'Pcs', description: 'Pieces (Individual units)' },
    { id: 'u5', name: 'Box', description: 'Carton / Box container' },
    { id: 'u6', name: 'Pack', description: 'Sealed Consumer Pack' },
    { id: 'u7', name: 'Dozen', description: '12 Pieces bundle' },
  ]);

  const [newBrandName, setNewBrandName] = useState('');
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitDesc, setNewUnitDesc] = useState('');

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    setBrands(prev => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        name: newBrandName.trim(),
        code: newBrandName.substring(0, 4).toUpperCase(),
        count: 0,
      },
    ]);
    setNewBrandName('');
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) return;
    setUnits(prev => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        name: newUnitName.trim(),
        description: newUnitDesc.trim() || 'Unit measurement',
      },
    ]);
    setNewUnitName('');
    setNewUnitDesc('');
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Brand & Unit of Measure Management
        </h2>
        <p className="text-xs text-neutral-500">
          Preloaded catalog taxonomies for retail packaging and barcode labeling
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brands Column */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
          <div className="flex items-center justify-between border-b pb-2 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Tag className="h-4 w-4 text-emerald-600" />
              <span>Registered Brands ({brands.length})</span>
            </div>
          </div>

          <form onSubmit={handleAddBrand} className="flex gap-2">
            <input
              type="text"
              placeholder="New Brand Name..."
              value={newBrandName}
              onChange={e => setNewBrandName(e.target.value)}
              className="flex-1 rounded-lg border border-neutral-200 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800"
            />
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              + Add Brand
            </button>
          </form>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {brands.map(b => (
              <div key={b.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">{b.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">Code: {b.code}</div>
                </div>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {b.count} products
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Units Column */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
          <div className="flex items-center justify-between border-b pb-2 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Scale className="h-4 w-4 text-emerald-600" />
              <span>Units of Measure ({units.length})</span>
            </div>
          </div>

          <form onSubmit={handleAddUnit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Unit code (e.g. Bag, Bundle)..."
                value={newUnitName}
                onChange={e => setNewUnitName(e.target.value)}
                className="flex-1 rounded-lg border border-neutral-200 p-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                + Add Unit
              </button>
            </div>
          </form>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {units.map(u => (
              <div key={u.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                    {u.name}
                  </div>
                  <div className="text-[10px] text-neutral-400">{u.description}</div>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
