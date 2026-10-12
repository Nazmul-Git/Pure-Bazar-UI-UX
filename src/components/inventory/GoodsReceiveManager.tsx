import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  CheckCircle,
  Clock,
  Printer,
  AlertTriangle,
  FileText,
  Search,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoodsReceiveNote, GRNItem } from '../../types';

export const GoodsReceiveManager: React.FC = () => {
  const { grns, products, vendors, createGRN, approveGRN, currentUser } = useApp();
  const [isNewGRNOpen, setIsNewGRNOpen] = useState(false);
  const [selectedGrnForPrint, setSelectedGrnForPrint] = useState<GoodsReceiveNote | null>(null);

  // New GRN Form State
  const [grnType, setGrnType] = useState<'Vendor Consignment' | 'Company Purchase'>('Vendor Consignment');
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || '');
  const [challanNumber, setChallanNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Items in new GRN
  const [grnItems, setGrnItems] = useState<GRNItem[]>([]);
  const [itemSearchTerm, setItemSearchTerm] = useState('');

  // Products available to add (if vendor selected, prefer products from that vendor)
  const availableProducts = products.filter(p => {
    if (grnType === 'Vendor Consignment') {
      return p.vendorId === selectedVendorId;
    }
    return p.ownerType === 'Company';
  });

  const handleAddProductToGRN = (prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    if (grnItems.some(i => i.productId === prod.id)) return;

    const newItem: GRNItem = {
      productId: prod.id,
      productName: prod.name,
      barcode: prod.barcode,
      unit: prod.unit,
      currentStock: prod.centralStock,
      deliveredQty: 10,
      acceptedQty: 10,
      rejectedQty: 0,
      costPrice: prod.costPrice,
      salePrice: prod.standardPrice,
      totalCost: 10 * prod.costPrice,
    };

    setGrnItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (productId: string, updates: Partial<GRNItem>) => {
    setGrnItems(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          const updated = { ...item, ...updates };
          if ('deliveredQty' in updates || 'rejectedQty' in updates) {
            updated.acceptedQty = Math.max(0, updated.deliveredQty - (updated.rejectedQty || 0));
          }
          updated.totalCost = updated.acceptedQty * updated.costPrice;
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setGrnItems(prev => prev.filter(i => i.productId !== productId));
  };

  const handleSubmitGRN = (e: React.FormEvent) => {
    e.preventDefault();
    if (grnItems.length === 0) {
      alert('Please add at least one product line to the GRN.');
      return;
    }
    if (!challanNumber.trim()) {
      alert('Vendor Challan / Delivery Slip number is mandatory.');
      return;
    }

    const vendor = vendors.find(v => v.id === selectedVendorId);

    createGRN({
      type: grnType,
      vendorId: grnType === 'Vendor Consignment' ? selectedVendorId : undefined,
      vendorName: grnType === 'Vendor Consignment' && vendor ? vendor.shopName : undefined,
      challanNumber: challanNumber.trim(),
      receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      receivedBy: currentUser.fullName,
      status: 'Draft',
      notes,
      items: grnItems,
    });

    setIsNewGRNOpen(false);
    setGrnItems([]);
    setChallanNumber('');
    setNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Goods Receive Note (GRN) [NEW v3.2/3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Intake consignment goods or direct purchases into Central Warehouse without barcode duplication
          </p>
        </div>

        <button
          onClick={() => setIsNewGRNOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New GRN Intake</span>
        </button>
      </div>

      {/* GRN List Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">GRN #</th>
              <th className="px-4 py-3">Challan / Slip #</th>
              <th className="px-4 py-3">Source / Vendor</th>
              <th className="px-4 py-3">Items & Quantities</th>
              <th className="px-4 py-3">Date Received</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {grns.map(grn => {
              const totalAccepted = grn.items.reduce((sum, i) => sum + i.acceptedQty, 0);
              const totalCost = grn.items.reduce((sum, i) => sum + i.totalCost, 0);

              return (
                <tr
                  key={grn.id}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {grn.grnNumber}
                  </td>

                  <td className="px-4 py-3 font-mono text-neutral-600 dark:text-neutral-300">
                    {grn.challanNumber}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {grn.vendorName || grn.type}
                    </div>
                    <div className="text-[10px] text-neutral-400">By {grn.receivedBy}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {grn.items.length} product line(s) · {totalAccepted} units accepted
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      Total Cost: Tk {totalCost.toLocaleString()}
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono text-neutral-500 text-[11px]">
                    {grn.receivedDate}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        grn.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : grn.status === 'Draft'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {grn.status}
                    </span>
                    {grn.approvedBy && (
                      <div className="text-[9px] text-neutral-400 mt-0.5">{grn.approvedBy}</div>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {grn.status === 'Draft' && (
                        <button
                          onClick={() => approveGRN(grn.id)}
                          className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-xs"
                          title="Approve GRN to increment central stock"
                        >
                          <Check className="h-3 w-3" />
                          <span>Approve & Credit Stock</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedGrnForPrint(grn)}
                        className="p-1 rounded hover:bg-neutral-100 text-neutral-600 dark:hover:bg-neutral-800 dark:text-neutral-400"
                        title="Print Challan / GRN receipt"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New GRN Modal */}
      {isNewGRNOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Create Goods Receive Note (GRN)
                </h3>
                <p className="text-xs text-neutral-500">
                  Part 4A: Restocks existing product barcodes without duplicates
                </p>
              </div>
              <button onClick={() => setIsNewGRNOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitGRN} className="mt-4 space-y-4">
              {/* Type & Vendor Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Intake Type:
                  </label>
                  <select
                    value={grnType}
                    onChange={e => {
                      setGrnType(e.target.value as any);
                      setGrnItems([]);
                    }}
                    className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <option value="Vendor Consignment">Vendor Consignment</option>
                    <option value="Company Purchase">Company Purchase</option>
                  </select>
                </div>

                {grnType === 'Vendor Consignment' && (
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Consignment Vendor:*
                    </label>
                    <select
                      value={selectedVendorId}
                      onChange={e => {
                        setSelectedVendorId(e.target.value);
                        setGrnItems([]);
                      }}
                      className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      {vendors.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.shopName} ({v.fullName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Vendor Challan Number */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Vendor Delivery Challan / Slip Number (Mandatory):*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CH-RAFIQ-452 or INV-99120"
                  value={challanNumber}
                  onChange={e => setChallanNumber(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              {/* Add Existing Products to this GRN */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Step 2: Select Existing Product to Restock:
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {availableProducts.length} vendor items available
                  </span>
                </div>

                <div className="flex gap-2">
                  <select
                    className="flex-1 rounded-lg border border-neutral-200 bg-white p-2 text-xs dark:border-neutral-700 dark:bg-neutral-900"
                    id="selectProductGRN"
                  >
                    {availableProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Current Central Stock: {p.centralStock} {p.unit})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const sel = (document.getElementById('selectProductGRN') as HTMLSelectElement)?.value;
                      if (sel) handleAddProductToGRN(sel);
                    }}
                    className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    + Add to Delivery
                  </button>
                </div>
              </div>

              {/* Items Table in GRN */}
              {grnItems.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Delivered Lines & Physical Inspection:
                  </label>
                  <div className="divide-y divide-neutral-100 border rounded-lg overflow-hidden dark:divide-neutral-800 dark:border-neutral-800 text-xs">
                    {grnItems.map(item => (
                      <div key={item.productId} className="p-3 bg-white dark:bg-neutral-900 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-neutral-900 dark:text-neutral-100">
                              {item.productName}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              Barcode: {item.barcode} · Current Stock: {item.currentStock} {item.unit}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-rose-600 hover:underline text-xs"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-neutral-500">Delivered Qty:</span>
                            <input
                              type="number"
                              min="1"
                              value={item.deliveredQty}
                              onChange={e =>
                                handleUpdateItem(item.productId, {
                                  deliveredQty: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full rounded border p-1 font-bold dark:bg-neutral-800"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-rose-500 font-semibold">Rejected Qty (Damaged):</span>
                            <input
                              type="number"
                              min="0"
                              value={item.rejectedQty}
                              onChange={e =>
                                handleUpdateItem(item.productId, {
                                  rejectedQty: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full rounded border p-1 text-rose-600 font-bold dark:bg-neutral-800"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-emerald-600 font-semibold">Accepted Qty:</span>
                            <div className="rounded bg-emerald-50 p-1 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {item.acceptedQty} {item.unit}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-neutral-500">Cost Price (BDT):</span>
                            <input
                              type="number"
                              value={item.costPrice}
                              onChange={e =>
                                handleUpdateItem(item.productId, {
                                  costPrice: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full rounded border p-1 dark:bg-neutral-800"
                            />
                          </div>
                        </div>

                        {item.rejectedQty > 0 && (
                          <input
                            type="text"
                            placeholder="Rejection Reason (e.g. Broken seal, expired)..."
                            value={item.rejectionReason || ''}
                            onChange={e =>
                              handleUpdateItem(item.productId, { rejectionReason: e.target.value })
                            }
                            className="w-full rounded border border-rose-200 p-1 text-[11px] text-rose-800 dark:bg-neutral-800"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Receiver Notes:
                </label>
                <textarea
                  placeholder="Packaging condition, transport details..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewGRNOpen(false)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Save as Draft GRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable GRN Challan View */}
      {selectedGrnForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 border font-mono text-xs space-y-4">
            <div className="text-center border-b pb-3">
              <h3 className="font-bold text-sm">PUREBAZAR GOODS RECEIVE NOTE (GRN)</h3>
              <p className="text-[11px] text-neutral-500">
                GRN #{selectedGrnForPrint.grnNumber} · Challan #{selectedGrnForPrint.challanNumber}
              </p>
              <p className="text-[10px] text-neutral-400">
                Vendor: {selectedGrnForPrint.vendorName || selectedGrnForPrint.type}
              </p>
            </div>

            <div className="space-y-1 text-[11px]">
              <div>Date Received: {selectedGrnForPrint.receivedDate}</div>
              <div>Receiver: {selectedGrnForPrint.receivedBy}</div>
              <div>Status: {selectedGrnForPrint.status}</div>
              {selectedGrnForPrint.notes && <div>Notes: {selectedGrnForPrint.notes}</div>}
            </div>

            <div className="border-t pt-2 space-y-1">
              <div className="font-bold text-[10px] flex justify-between">
                <span>Product</span>
                <span>Delivered / Accepted</span>
              </div>
              {selectedGrnForPrint.items.map((i, idx) => (
                <div key={idx} className="flex justify-between border-b py-1">
                  <div>
                    <div>{i.productName}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">Barcode: {i.barcode}</div>
                  </div>
                  <div className="text-right">
                    <div>Delivered: {i.deliveredQty} {i.unit}</div>
                    <div className="font-bold text-emerald-600">Accepted: {i.acceptedQty} {i.unit}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
              >
                <Printer className="h-3.5 w-3.5" /> Print GRN
              </button>
              <button
                onClick={() => setSelectedGrnForPrint(null)}
                className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
