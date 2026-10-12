import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RegisterVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterVendorModal: React.FC<RegisterVendorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, registerVendor, shareholders, settings } = useApp();

  const [shareholderId, setShareholderId] = useState('PBN-89210');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [payoutWalletNumber, setPayoutWalletNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [apiResult, setApiResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleShareholderSelect = (shId: string) => {
    setShareholderId(shId);
    const found = shareholders.find(s => s.shareholderId === shId);
    if (found) {
      setFullName(found.fullName);
      setMobile(found.mobile);
      setPayoutWalletNumber(found.mobile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiResult(null);

    if (!termsAccepted) {
      alert('You must accept the vendor consignment terms and conditions.');
      return;
    }

    const cat = categories.find(c => c.id === categoryId);

    const res = registerVendor({
      shareholderId: shareholderId.trim(),
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      shopName: shopName.trim(),
      address: address.trim(),
      categoryId,
      categoryName: cat ? cat.name : 'Groceries',
      commissionAgreementPercent: cat ? cat.commissionPercent : 10,
      payoutWalletNumber: payoutWalletNumber.trim() || mobile.trim(),
      termsAccepted: true,
      termsVersion: settings.vendorTermsVersion,
      status: 'Active',
    });

    setApiResult(res);

    if (res.success) {
      setTimeout(() => {
        onClose();
        setApiResult(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Register Vendor: Form A [NEW v3.2/3.3]
            </h3>
            <p className="text-xs text-neutral-500">
              On save: calls Probashi Member Verify API. Fails if shareholder is invalid.
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {apiResult && (
          <div
            className={`my-3 rounded-xl p-3 text-xs font-semibold flex items-center gap-2 ${
              apiResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            {apiResult.success ? (
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{apiResult.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          {/* Shareholder ID Selection */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Associated Shareholder Member ID:*
              </label>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Live Probashi Check
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. PBN-89210"
                value={shareholderId}
                onChange={e => setShareholderId(e.target.value)}
                className="flex-1 rounded-lg border border-neutral-200 p-2 text-xs font-mono font-bold dark:border-neutral-700 dark:bg-neutral-900"
              />
              <select
                onChange={e => handleShareholderSelect(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
              >
                <option value="">Select Existing...</option>
                {shareholders.map(s => (
                  <option key={s.shareholderId} value={s.shareholderId}>
                    {s.shareholderId} - {s.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Full Name:*
              </label>
              <input
                type="text"
                required
                placeholder="Vendor proprietor name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Mobile Number:*
              </label>
              <input
                type="text"
                required
                placeholder="017xxxxxxxx"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Shop / Business Trade Name:*
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shuddho Organic Mustard & Oil Ltd"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Business Address:*
            </label>
            <input
              type="text"
              required
              placeholder="Factory or wholesale hub address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Product Category:*
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.commissionPercent}% commission)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Payout Wallet Account (Probashi):*
              </label>
              <input
                type="text"
                required
                placeholder="Probashi mobile account #"
                value={payoutWalletNumber}
                onChange={e => setPayoutWalletNumber(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-snug">
                I accept the <strong>PureBazar Vendor Consignment Terms ({settings.vendorTermsVersion})</strong>.
                Consignment payouts will be settled monthly to the registered ProbashiHNR account.
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t pt-3 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-xs font-semibold hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Verify & Register Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
