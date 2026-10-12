import React, { useState } from 'react';
import { Search, UserCheck, Wallet, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShareholderMember } from '../../types';

export const MemberSearch: React.FC = () => {
  const { shareholders, orders, setIdentifiedMember, setActiveNav } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<ShareholderMember | null>(shareholders[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    const found = shareholders.find(
      s =>
        s.shareholderId.toLowerCase() === query ||
        s.mobile.includes(query) ||
        s.fullName.toLowerCase().includes(query)
    );
    if (found) {
      setSelectedMember(found);
    } else {
      alert('No shareholder found in Probashi database matching query.');
    }
  };

  const memberOrders = selectedMember
    ? orders.filter(o => o.memberId === selectedMember.shareholderId)
    : [];

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Shareholder Member Search & Purchase History
        </h2>
        <p className="text-xs text-neutral-500">
          Look up ProbashiHNR shareholder credentials, verify wallet status, and inspect PureBazar billing history
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Enter Shareholder ID (e.g. PBN-89210) or Mobile Number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-3 text-xs dark:border-neutral-800 dark:bg-neutral-900"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          Check Member
        </button>
      </form>

      {/* Shareholder Quick Picker */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        <span className="text-neutral-400 text-[11px]">Quick Profiles:</span>
        {shareholders.map(s => (
          <button
            key={s.shareholderId}
            onClick={() => setSelectedMember(s)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedMember?.shareholderId === s.shareholderId
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            {s.fullName} ({s.shareholderId})
          </button>
        ))}
      </div>

      {/* Member Profile Display */}
      {selectedMember && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Member Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-800 dark:text-emerald-300">
                  {selectedMember.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedMember.fullName}
                  </h3>
                  <div className="text-[11px] font-mono text-emerald-600 font-bold">
                    {selectedMember.shareholderId}
                  </div>
                </div>
              </div>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {selectedMember.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-neutral-400">Mobile Phone:</span>
                <div className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                  {selectedMember.mobile}
                </div>
              </div>

              {/* Wallet Balances Card */}
              <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/40 space-y-2 border border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                    Current Balance (POS Bill Pay):
                  </span>
                  <div className="text-lg font-black tabular-nums text-emerald-700 dark:text-emerald-400">
                    Tk {selectedMember.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-[10px] text-neutral-400 block line-through">
                    Generation Bonus: Tk {selectedMember.generationBonusBalance.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    🔒 Protected. Per spec, PureBazar never debits Generation Bonus.
                  </span>
                </div>
              </div>

              {/* Lifetime Savings at PureBazar */}
              <div className="rounded-xl bg-lime-50/70 p-3 text-xs dark:bg-lime-950/20 border border-lime-200/50 dark:border-lime-900/30">
                <div className="flex justify-between">
                  <span className="text-lime-800 dark:text-lime-300 font-medium">PureBazar Spend:</span>
                  <span className="font-bold tabular-nums">Tk {selectedMember.totalPureBazarSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1 text-emerald-700 dark:text-emerald-400 font-bold">
                  <span>5% Discount Saved:</span>
                  <span className="tabular-nums">Tk {selectedMember.totalDiscountSaved.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIdentifiedMember(selectedMember);
                setActiveNav('pos_counter');
              }}
              className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Build Bill for Member at POS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Member's Purchase Invoices at PureBazar (Right 2 cols) */}
          <div className="md:col-span-2 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
            <div className="flex items-center justify-between border-b pb-2 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                PureBazar Purchase Invoices ({memberOrders.length})
              </h3>
            </div>

            {memberOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                No past orders recorded for this member yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {memberOrders.map(order => (
                  <div key={order.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                        {order.receiptNumber} · {order.outletName}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {order.createdAt} · {order.items.length} items
                      </div>
                      {order.probashiTxnId && (
                        <div className="text-[10px] font-mono text-emerald-600 mt-0.5">
                          Probashi Txn: {order.probashiTxnId}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-neutral-900 dark:text-neutral-100">
                        Tk {order.finalPaidAmount.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        Saved Tk {order.discountAmount.toFixed(2)} (5%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
