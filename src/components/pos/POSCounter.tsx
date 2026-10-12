import React, { useState } from 'react';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  Wallet,
  Banknote,
  CreditCard,
  QrCode,
  UserCheck,
  CheckCircle2,
  X,
  AlertCircle,
  Smartphone,
  Tag,
  Store,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const POSCounter: React.FC = () => {
  const {
    products,
    categories,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    identifiedMember,
    setIdentifiedMember,
    verifyShareholder,
    activePaymentRequest,
    startWalletPayment,
    cancelWalletPayment,
    completeStandardPayment,
    activeOutlet,
    currentUser,
    settings,
    setIsCustomerPhoneModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [memberSearchInput, setMemberSearchInput] = useState('');
  const [memberSearchError, setMemberSearchError] = useState('');
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [cashTendered, setCashTendered] = useState<string>('');

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      (p.bnName && p.bnName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate totals
  const discountPercent = settings.shareholderDiscountPercent;
  let standardTotal = 0;
  cart.forEach(item => {
    standardTotal += item.product.standardPrice * item.quantity;
  });
  const discountAmount = Number(((standardTotal * discountPercent) / 100).toFixed(2));
  const walletTotal = Number((standardTotal - discountAmount).toFixed(2));

  // Handle Shareholder Lookup
  const handleMemberSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberSearchError('');
    if (!memberSearchInput.trim()) return;

    const member = verifyShareholder(memberSearchInput);
    if (!member) {
      setMemberSearchError('Shareholder not found in ProbashiHNR database.');
    }
  };

  // Cash checkout submit
  const handleCashCheckout = () => {
    const tendered = parseFloat(cashTendered) || standardTotal;
    completeStandardPayment('CASH', standardTotal);
    setIsCashModalOpen(false);
    setCashTendered('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6.5rem)]">
      {/* Left Column: Product Catalog & Rapid Scanner (60%) */}
      <div className="flex-1 flex flex-col rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-xs">
        {/* Top Search & Filter Bar */}
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Scan barcode or search product name / SKU (e.g. 89411001001 or Miniket)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-8 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:focus:bg-neutral-900"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-neutral-500 px-2">
              <Barcode className="h-4 w-4 text-emerald-600" />
              <span className="hidden sm:inline">Scanner Active</span>
            </div>
          </div>

          {/* Category Filter Pills (Functional Filter Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              All Categories
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 content-start">
          {filteredProducts.map(product => {
            const currentOutletStock = product.outletStock[activeOutlet.id] || 0;
            const isOutOfStock = currentOutletStock <= 0;
            const inCart = cart.find(c => c.product.id === product.id);

            return (
              <div
                key={product.id}
                onClick={() => !isOutOfStock && addToCart(product, 1)}
                className={`group relative flex flex-col justify-between rounded-lg border p-2.5 transition-all cursor-pointer select-none ${
                  isOutOfStock
                    ? 'border-neutral-200 bg-neutral-100/50 opacity-60 dark:border-neutral-800 dark:bg-neutral-800/40 cursor-not-allowed'
                    : inCart
                    ? 'border-emerald-500 bg-emerald-50/30 dark:border-emerald-600 dark:bg-emerald-950/20'
                    : 'border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-mono text-neutral-400 truncate">
                      {product.barcode}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-1 py-0.2 rounded ${
                        product.ownerType === 'Vendor'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {product.ownerType}
                    </span>
                  </div>

                  <h4 className="mt-1 text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug">
                    {product.name}
                  </h4>
                  {product.bnName && (
                    <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                      {product.bnName}
                    </div>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-neutral-400">
                      Stock: <span className={isOutOfStock ? 'text-rose-600 font-bold' : 'font-medium'}>{currentOutletStock} {product.unit}</span>
                    </div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      Tk {product.standardPrice}
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      Wallet: Tk {(product.standardPrice * 0.95).toFixed(1)}
                    </div>
                  </div>

                  {inCart && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                      {inCart.quantity}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Billing Counter, Shareholder Check & Checkout (40%) */}
      <div className="w-full lg:w-96 flex flex-col rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-xs">
        {/* Shareholder Identification Bar (Part 3) */}
        <div className="p-3 border-b border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-800/40">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              Shareholder Verification (Optional)
            </span>
            {identifiedMember && (
              <button
                onClick={() => setIdentifiedMember(null)}
                className="text-[11px] text-rose-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {identifiedMember ? (
            <div className="rounded-lg bg-emerald-100/60 p-2 text-xs border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  {identifiedMember.fullName}
                </span>
                <span className="font-mono text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-bold">
                  {identifiedMember.shareholderId}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300">
                <span>Mob: {identifiedMember.mobile}</span>
                <span className="font-semibold">5% Discount Unlocked</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleMemberSearch} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Enter ID (PBN-89210) or Mobile..."
                value={memberSearchInput}
                onChange={e => setMemberSearchInput(e.target.value)}
                className="flex-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
              />
              <button
                type="submit"
                className="rounded-md bg-neutral-800 px-3 py-1 text-xs font-semibold text-white hover:bg-neutral-700 dark:bg-neutral-200 dark:text-neutral-900"
              >
                Verify
              </button>
            </form>
          )}

          {memberSearchError && (
            <div className="mt-1 text-[11px] text-rose-600 font-medium">
              {memberSearchError}
            </div>
          )}
        </div>

        {/* Bill Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-neutral-100 dark:divide-neutral-800">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Tag className="h-8 w-8 mb-2 stroke-1" />
              <p className="text-xs font-medium">Cart is currently empty</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Scan barcode or tap products from the left to build bill
              </p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="py-2 flex items-center justify-between text-xs gap-2">
                <div className="flex-1 truncate">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Tk {item.product.standardPrice} / {item.product.unit} · {item.product.ownerType}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="h-6 w-6 rounded border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center font-bold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="h-6 w-6 rounded border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="w-16 text-right font-bold tabular-nums">
                  Tk {(item.product.standardPrice * item.quantity).toFixed(0)}
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-neutral-400 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pricing Calculation Summary (Part 3 Dual Pricing Rule) */}
        <div className="border-t border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30 space-y-2">
          {/* Active Wallet Payment Pending Modal Inside POS */}
          {activePaymentRequest && activePaymentRequest.status === 'PENDING' ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/40">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                <span className="flex items-center gap-1.5">
                  <QrCode className="h-4 w-4" /> Probashi Wallet Payment Pending
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono">
                  3 Min Expiry
                </span>
              </div>

              <div className="my-2 flex items-center justify-between bg-white dark:bg-neutral-900 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-400">Customer 6-Digit Pay Code:</span>
                  <div className="text-xl font-black tracking-widest text-emerald-600 tabular-nums">
                    {activePaymentRequest.payCode}
                  </div>
                </div>
                <button
                  onClick={() => setIsCustomerPhoneModalOpen(true)}
                  className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 flex items-center gap-1"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Open Pay Phone</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  Wallet Price: Tk {activePaymentRequest.walletAmount.toFixed(2)}
                </span>
                <button
                  onClick={cancelWalletPayment}
                  className="text-[11px] text-rose-600 hover:underline font-semibold"
                >
                  Cancel Request
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Dual Price Comparison */}
              <div className="rounded-lg bg-white p-2.5 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 space-y-1 text-xs">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Standard Price (Cash/Card):</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    Tk {standardTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Shareholder 5% Discount:</span>
                  <span className="tabular-nums">- Tk {discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-100 dark:border-neutral-800 pt-1 text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Wallet className="h-4 w-4" /> Wallet Price:
                  </span>
                  <span className="tabular-nums">Tk {walletTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* 1. Probashi Wallet (5% Discount Auto Applied) */}
                <button
                  onClick={startWalletPayment}
                  disabled={cart.length === 0}
                  className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-lime-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-lime-700 disabled:opacity-40 transition-colors"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Pay with Probashi Wallet (Tk {walletTotal.toFixed(2)})</span>
                </button>

                {/* 2. Cash Button */}
                <button
                  onClick={() => setIsCashModalOpen(true)}
                  disabled={cart.length === 0}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 disabled:opacity-40"
                >
                  <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Cash (Tk {identifiedMember ? walletTotal.toFixed(2) : standardTotal.toFixed(2)})</span>
                </button>

                {/* 3. Card / bKash Button */}
                <button
                  onClick={() => completeStandardPayment('CARD', standardTotal)}
                  disabled={cart.length === 0}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 disabled:opacity-40"
                >
                  <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                  <span>Card / bKash</span>
                </button>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full text-center text-[11px] text-neutral-400 hover:text-neutral-600 pt-1"
                >
                  Discard Current Cart
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Cash Payment Drawer / Modal */}
      {isCashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xs rounded-xl bg-white p-4 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Cash Payment Checkout
            </h3>
            <div className="mt-2 text-xs text-neutral-500">
              Amount Due:{' '}
              <span className="font-bold text-neutral-900 dark:text-neutral-100">
                Tk {identifiedMember ? walletTotal.toFixed(2) : standardTotal.toFixed(2)}
              </span>
            </div>

            <div className="mt-3">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Cash Tendered by Customer (BDT):
              </label>
              <input
                type="number"
                placeholder="e.g. 1000 or 2000"
                value={cashTendered}
                onChange={e => setCashTendered(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-base font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
                autoFocus
              />
            </div>

            {parseFloat(cashTendered) > (identifiedMember ? walletTotal : standardTotal) && (
              <div className="mt-2 rounded bg-emerald-50 p-2 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                Change Return: Tk{' '}
                {(
                  parseFloat(cashTendered) - (identifiedMember ? walletTotal : standardTotal)
                ).toFixed(2)}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsCashModalOpen(false)}
                className="flex-1 rounded-lg border border-neutral-200 py-1.5 text-xs font-semibold hover:bg-neutral-100 dark:border-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCashCheckout}
                className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
