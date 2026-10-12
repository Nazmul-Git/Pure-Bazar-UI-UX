import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  Phone,
  Store,
  Wallet,
  CheckCircle,
  FileText,
  BadgeAlert,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RegisterVendorModal } from './RegisterVendorModal';

export const VendorDirectory: React.FC = () => {
  const { vendors, setActiveNav } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const filtered = vendors.filter(
    v =>
      v.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.shareholderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.mobile.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Registered Vendor Directory
          </h2>
          <p className="text-xs text-neutral-500">
            Offline consignment vendors verified with ProbashiHNR shareholder accounts
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Register Vendor (Form A)</span>
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by vendor trade name, shareholder ID, or phone..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white py-1.5 pl-8 pr-3 text-xs dark:border-neutral-800 dark:bg-neutral-900"
        />
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map(vendor => (
          <div
            key={vendor.id}
            className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {vendor.categoryName} ({vendor.commissionAgreementPercent}% Comm)
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {vendor.shopName}
                </h3>
                <div className="text-xs text-neutral-600 dark:text-neutral-300">
                  Proprietor: {vendor.fullName}
                </div>
              </div>

              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                  vendor.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {vendor.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] text-neutral-400">Shareholder ID:</span>
                <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {vendor.shareholderId}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400">Probashi Payout Wallet:</span>
                <div className="font-mono font-medium text-neutral-700 dark:text-neutral-300">
                  {vendor.payoutWalletNumber}
                </div>
              </div>
            </div>

            {/* Financial Performance Mini Card */}
            <div className="rounded-lg bg-neutral-50 p-2.5 text-xs dark:bg-neutral-800/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-neutral-500">Pending Payable:</span>
                <div className="text-sm font-black text-amber-700 dark:text-amber-400 tabular-nums">
                  Tk {vendor.pendingPayable.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500">Lifetime POS Sales:</span>
                <div className="font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                  Tk {vendor.totalSalesValue.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-neutral-400 truncate max-w-[200px]" title={vendor.address}>
                📍 {vendor.address}
              </span>
              <button
                onClick={() => setActiveNav('vendors_statement')}
                className="text-emerald-600 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Monthly Statements</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <RegisterVendorModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  );
};
