import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfitLossReport: React.FC = () => {
  const { orders, expenses } = useApp();

  let grossRevenue = 0;
  let ownStockMargin = 0;
  let vendorCommissionRevenue = 0;
  let discountsBorne = 0;

  orders.forEach(o => {
    if (o.paymentStatus === 'PAID') {
      grossRevenue += o.finalPaidAmount;
      discountsBorne += o.discountAmount;

      o.items.forEach(i => {
        if (i.ownerType === 'Company') {
          ownStockMargin += i.companyNet;
        } else {
          vendorCommissionRevenue += i.commissionAmount;
        }
      });
    }
  });

  const totalOperatingExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const salaryCost = expenses.filter(e => e.category === 'Salary').reduce((sum, e) => sum + e.amount, 0);
  const nonSalaryCost = totalOperatingExpenses - salaryCost;

  // Formula per Part 2: net result = commission revenue + own-stock margin - expenses
  const netProfitOrLoss = (vendorCommissionRevenue + ownStockMargin - discountsBorne) - totalOperatingExpenses;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Monthly Profit & Loss Statement (P&L) [NEW v3.2/3.3]
        </h2>
        <p className="text-xs text-neutral-500">
          Consolidated formula: Vendor Commission Revenue + Own-Stock Margin − Shareholder Discount − Operating Expenses
        </p>
      </div>

      {/* P&L Statement Card */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        {/* Section 1: Inflow */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase text-neutral-400">
            1. Operating Gross Inflow & Margins
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span>Gross POS Retail Revenue:</span>
              <span className="font-mono font-bold">Tk {grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
              <span className="pl-4">+ Vendor Consignment Commission Earned:</span>
              <span className="font-mono">Tk {vendorCommissionRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
              <span className="pl-4">+ PureBazar Company Owned Stock Margin:</span>
              <span className="font-mono">Tk {ownStockMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800 text-lime-700 dark:text-lime-400">
              <span className="pl-4">− Shareholder 5% Discount (Borne by PureBazar):</span>
              <span className="font-mono font-bold">- Tk {discountsBorne.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Outflow (Expenses) */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold uppercase text-neutral-400">
            2. Operating Expenses & Facility Overhead
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800 text-rose-700 dark:text-rose-400">
              <span>Staff Salary Payouts (from Payroll):</span>
              <span className="font-mono font-bold">- Tk {salaryCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800 text-rose-700 dark:text-rose-400">
              <span>Facility Rent, Electricity, Transport & Maintenance:</span>
              <span className="font-mono font-bold">- Tk {nonSalaryCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 font-bold border-t border-neutral-200 dark:border-neutral-800">
              <span>Total Operating Expenses:</span>
              <span className="font-mono text-rose-600">- Tk {totalOperatingExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Net Result */}
        <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Net Operating Result (P&L):
            </span>
            <div
              className={`text-2xl font-black tabular-nums mt-1 ${
                netProfitOrLoss >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'
              }`}
            >
              Tk {netProfitOrLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
              netProfitOrLoss >= 0
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {netProfitOrLoss >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{netProfitOrLoss >= 0 ? 'Net Operating Profit' : 'Net Operating Deficit'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
