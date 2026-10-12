import React, { useState } from 'react';
import { Printer, Barcode, CheckSquare, Square, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PureBazarLogo } from '../common/PureBazarLogo';

export const BarcodeLabelGenerator: React.FC = () => {
  const { products } = useApp();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    products.slice(0, 4).map(p => p.id)
  );
  const [labelCopies, setLabelCopies] = useState<number>(2);

  const toggleProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedProductIds.length === products.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map(p => p.id));
    }
  };

  const handlePrintLabels = () => {
    window.print();
  };

  const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Barcode & Price Label Generator
          </h2>
          <p className="text-xs text-neutral-500">
            Thermal barcode sticker batch printing (TSPL / ESC-POS 50mm × 30mm compatible)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <span>Copies per SKU:</span>
            <input
              type="number"
              min="1"
              max="20"
              value={labelCopies}
              onChange={e => setLabelCopies(parseInt(e.target.value) || 1)}
              className="w-14 rounded-md border p-1 text-center font-bold dark:bg-neutral-800"
            />
          </div>

          <button
            onClick={handlePrintLabels}
            disabled={selectedProducts.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs disabled:opacity-40"
          >
            <Printer className="h-4 w-4" />
            <span>Print {selectedProducts.length * labelCopies} Labels</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SKU Selector (Left) */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
          <div className="flex items-center justify-between border-b pb-2 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Select SKUs to Print ({selectedProductIds.length}/{products.length})
            </span>
            <button
              onClick={selectAll}
              className="text-[11px] text-emerald-600 hover:underline font-semibold"
            >
              {selectedProductIds.length === products.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="max-h-[500px] overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {products.map(p => {
              const isSelected = selectedProductIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggleProduct(p.id)}
                  className="py-2 px-1 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded"
                >
                  <div className="flex items-center gap-2 truncate">
                    {isSelected ? (
                      <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-neutral-300 shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {p.barcode} · Tk {p.standardPrice}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Sticker Print Sheet Preview (Right 2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-neutral-100 p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-950">
          <div className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-3">
            Thermal Label Sheet Preview (Printable):
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 print:grid-cols-2">
            {selectedProducts.flatMap(product =>
              Array.from({ length: labelCopies }).map((_, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="flex flex-col justify-between rounded-lg border-2 border-neutral-300 bg-white p-2.5 shadow-sm text-neutral-950 font-sans select-none"
                  style={{ minHeight: '135px' }}
                >
                  {/* Label Header */}
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="text-[10px] font-black uppercase text-emerald-800">
                      PURE BAZAR
                    </span>
                    <span className="text-[9px] font-bold text-neutral-500 font-mono">
                      {product.unit}
                    </span>
                  </div>

                  {/* Product Title */}
                  <div className="my-1 text-left">
                    <div className="text-[11px] font-bold leading-tight line-clamp-2">
                      {product.name}
                    </div>
                    {product.bnName && (
                      <div className="text-[9px] text-neutral-600 truncate mt-0.5">
                        {product.bnName}
                      </div>
                    )}
                  </div>

                  {/* Pricing Dual */}
                  <div className="flex items-baseline justify-between bg-neutral-50 p-1 rounded my-1 border border-neutral-200">
                    <div>
                      <span className="text-[8px] text-neutral-500 block uppercase">Standard</span>
                      <span className="text-xs font-bold tabular-nums">Tk {product.standardPrice}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-emerald-700 block font-bold uppercase">
                        Wallet (5% off)
                      </span>
                      <span className="text-xs font-extrabold text-emerald-800 tabular-nums">
                        Tk {(product.standardPrice * 0.95).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Simulated EAN-13 Barcode */}
                  <div className="text-center pt-1 border-t">
                    <div className="flex justify-center tracking-widest text-neutral-800 h-6 items-center">
                      <Barcode className="h-6 w-32 stroke-1" />
                    </div>
                    <div className="text-[9px] font-mono tracking-widest font-bold">
                      {product.barcode}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
