import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OwnerType } from '../../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { categories, vendors, addProduct, addCategory } = useApp();

  const [name, setName] = useState('');
  const [bnName, setBnName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [brand, setBrand] = useState('PureBazar Select');
  const [unit, setUnit] = useState('Pack');
  const [ownerType, setOwnerType] = useState<OwnerType>('Vendor');
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [costPrice, setCostPrice] = useState('');
  const [standardPrice, setStandardPrice] = useState('');
  const [minStockAlert, setMinStockAlert] = useState('10');
  const [initialCentralStock, setInitialCentralStock] = useState('50');

  // Quick Add Category State
  const [isQuickAddCategory, setIsQuickAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatComm, setNewCatComm] = useState('10');

  if (!isOpen) return null;

  const handleQuickAddCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), parseFloat(newCatComm) || 10);
    setIsQuickAddCategory(false);
    setNewCatName('');
  };

  const generateRandomBarcode = () => {
    const randomCode = '8941' + Math.floor(1000000 + Math.random() * 9000000).toString();
    setBarcode(randomCode);
    if (!sku && name) {
      setSku(name.substring(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !standardPrice || !costPrice) {
      alert('Please fill in required fields: Product Name, Cost Price, Standard Price.');
      return;
    }

    const selectedCat = categories.find(c => c.id === categoryId);
    const selectedVendor = vendors.find(v => v.id === vendorId);

    addProduct({
      name,
      bnName: bnName || undefined,
      barcode: barcode || '8941' + Math.floor(1000000 + Math.random() * 9000000),
      sku: sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      categoryId,
      categoryName: selectedCat ? selectedCat.name : 'Groceries',
      brand,
      unit,
      ownerType,
      vendorId: ownerType === 'Vendor' ? vendorId : undefined,
      vendorName: ownerType === 'Vendor' && selectedVendor ? selectedVendor.shopName : undefined,
      costPrice: parseFloat(costPrice),
      standardPrice: parseFloat(standardPrice),
      walletDiscountPercent: 5,
      centralStock: parseFloat(initialCentralStock) || 0,
      outletStock: { 'out-1': 0, 'out-2': 0, 'out-3': 0 },
      minStockAlert: parseInt(minStockAlert) || 10,
      listedOnline: false,
      channel: 'POS',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Add New Product to Catalog
            </h3>
            <p className="text-xs text-neutral-500">
              Configured for offline retail, barcodes, and owner commission logic
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Product Name English & Bengali */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Product Name (English)*
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pure Deshi Ghee 500g"
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Bengali Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. খাঁটি গাওয়া ঘি ৫০০ গ্রাম"
                value={bnName}
                onChange={e => setBnName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* Barcode & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Barcode (EAN-13)*
                </label>
                <button
                  type="button"
                  onClick={generateRandomBarcode}
                  className="text-[10px] text-emerald-600 hover:underline font-semibold"
                >
                  Generate Barcode
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. 89411002003"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                SKU Reference
              </label>
              <input
                type="text"
                placeholder="e.g. GHE-DES-500G"
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* Category Dropdown with Quick Add */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Category (Governs Commission %)*
              </label>
              <button
                type="button"
                onClick={() => setIsQuickAddCategory(prev => !prev)}
                className="text-[11px] text-emerald-600 hover:underline font-semibold flex items-center gap-0.5"
              >
                <Plus className="h-3 w-3" /> Quick Add
              </button>
            </div>

            {isQuickAddCategory ? (
              <div className="flex gap-2 rounded-lg bg-neutral-50 p-2 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 mb-2">
                <input
                  type="text"
                  placeholder="New Category Name..."
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="flex-1 rounded border border-neutral-200 p-1 text-xs dark:bg-neutral-900"
                />
                <input
                  type="number"
                  placeholder="Comm %"
                  value={newCatComm}
                  onChange={e => setNewCatComm(e.target.value)}
                  className="w-16 rounded border border-neutral-200 p-1 text-xs dark:bg-neutral-900"
                />
                <button
                  type="button"
                  onClick={handleQuickAddCategory}
                  className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
                >
                  Save
                </button>
              </div>
            ) : null}

            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.commissionPercent}% PureBazar commission)
                </option>
              ))}
            </select>
          </div>

          {/* Brand & Unit Dropdown */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Brand
              </label>
              <input
                type="text"
                placeholder="e.g. Radhuni, Teer, PureBazar"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Unit of Measure*
              </label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              >
                {['Kg', 'Gram', 'Ltr', 'Pcs', 'Box', 'Pack', 'Dozen'].map(u => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Owner Field: Company or Vendor [NEW v3.2/3.3] */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
            <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Product Stock Owner* [NEW]
            </label>
            <div className="mt-1.5 flex gap-4">
              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="ownerType"
                  value="Vendor"
                  checked={ownerType === 'Vendor'}
                  onChange={() => setOwnerType('Vendor')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Vendor (Consignment Stock)</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="ownerType"
                  value="Company"
                  checked={ownerType === 'Company'}
                  onChange={() => setOwnerType('Company')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Company (PureBazar Direct Purchase)</span>
              </label>
            </div>

            {ownerType === 'Vendor' && (
              <div className="mt-2.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Select Registered Consignment Vendor:
                </label>
                <select
                  value={vendorId}
                  onChange={e => setVendorId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-white p-2 text-xs dark:border-neutral-700 dark:bg-neutral-900"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.shopName} ({v.fullName} - {v.shareholderId})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Cost Price (BDT)*
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 380"
                value={costPrice}
                onChange={e => setCostPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Standard Price*
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 420"
                value={standardPrice}
                onChange={e => setStandardPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
              />
              <span className="text-[10px] text-emerald-600">
                Wallet Price: Tk {standardPrice ? (parseFloat(standardPrice) * 0.95).toFixed(1) : '0'}
              </span>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Min Stock Alert
              </label>
              <input
                type="number"
                value={minStockAlert}
                onChange={e => setMinStockAlert(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-3 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-semibold hover:bg-neutral-100 dark:border-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
