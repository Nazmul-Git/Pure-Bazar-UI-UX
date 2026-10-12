import React from 'react';
import {
  TrendingUp,
  CreditCard,
  Wallet,
  AlertTriangle,
  Receipt,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  Users2,
  Clock,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardOverview: React.FC = () => {
  const {
    orders,
    products,
    vendors,
    expenses,
    stockMovements,
    setActiveNav,
    activeOutlet,
  } = useApp();

  // Metrics calculation
  let totalSales = 0;
  let totalCommissionRevenue = 0;
  let todaySales = 0;
  let todayBillsCount = 0;
  let walletSalesTotal = 0;
  let cashSalesTotal = 0;
  let cardAndBkashSalesTotal = 0;

  const todayStr = new Date().toISOString().substring(0, 10);

  orders.forEach(o => {
    if (o.paymentStatus === 'PAID') {
      totalSales += o.finalPaidAmount;

      if (o.paymentMethod === 'WALLET') {
        walletSalesTotal += o.finalPaidAmount;
      } else if (o.paymentMethod === 'CASH') {
        cashSalesTotal += o.finalPaidAmount;
      } else {
        cardAndBkashSalesTotal += o.finalPaidAmount;
      }

      if (o.createdAt.startsWith(todayStr)) {
        todaySales += o.finalPaidAmount;
        todayBillsCount += 1;
      }

      // calculate commission revenue
      o.items.forEach(i => {
        totalCommissionRevenue += i.companyNet;
      });
    }
  });

  // Low stock warning count
  const lowStockCount = products.filter(p => {
    const totalStock = p.centralStock + Object.values(p.outletStock).reduce((a, b) => a + b, 0);
    return totalStock <= p.minStockAlert;
  }).length;

  // Pending vendor payable
  const pendingVendorPayable = vendors.reduce((sum, v) => sum + v.pendingPayable, 0);

  // Month expense total
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const thisMonthExpenses = expenses
    .filter(e => e.date.startsWith(currentMonthStr))
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate Cash vs Wallet split percentage
  const totalSplitSales = walletSalesTotal + cashSalesTotal + cardAndBkashSalesTotal;
  const walletPercent = totalSplitSales > 0 ? ((walletSalesTotal / totalSplitSales) * 100).toFixed(1) : '0';
  const cashPercent = totalSplitSales > 0 ? ((cashSalesTotal / totalSplitSales) * 100).toFixed(1) : '0';
  const otherPercent = totalSplitSales > 0 ? ((cardAndBkashSalesTotal / totalSplitSales) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Live Central Warehouse, Dhanmondi & Regional Outlets ({activeOutlet.name})
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav('pos_counter')}
            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
          >
            Launch POS Counter
          </button>
          <button
            onClick={() => setActiveNav('inventory_grn')}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            Receive Goods (GRN)
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Today's Sales & Bill Count */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">Today's Sales</span>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-neutral-900 dark:text-neutral-100">
            Tk {todaySales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500">
            <span>{todayBillsCount} completed bills</span>
            <span className="text-emerald-600 font-semibold">Active shift</span>
          </div>
        </div>

        {/* 2. Shareholder Wallet Sales Total */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">Probashi Wallet Sales</span>
            <Wallet className="h-4 w-4 text-lime-600 dark:text-lime-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-lime-700 dark:text-lime-400">
            Tk {walletSalesTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            5% Shareholder discount applied automatically
          </div>
        </div>

        {/* 3. Company Commission Revenue */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">Net Commission Revenue</span>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-neutral-900 dark:text-neutral-100">
            Tk {totalCommissionRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            (Category Comm % - 5% Discount)
          </div>
        </div>

        {/* 4. Pending Vendor Payable [NEW v3.3] */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">Pending Vendor Dues</span>
            <Users2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-amber-700 dark:text-amber-400">
            Tk {pendingVendorPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500">
            <span>{vendors.length} Consignment vendors</span>
            <button
              onClick={() => setActiveNav('vendors_payout')}
              className="text-amber-600 hover:underline font-semibold"
            >
              Review
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Strip: Cash vs Wallet Split & Monthly Expenses */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Today's Cash vs Wallet Payment Split (v3.3 requirement) */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Payment Channel Split (Today & Lifetime)
              </h3>
              <p className="text-[11px] text-neutral-500">
                ProbashiHNR Wallet vs Physical Cash vs Digital Cards
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-neutral-400">
              Total: Tk {totalSplitSales.toLocaleString()}
            </span>
          </div>

          {/* Visual Horizontal Split Bar */}
          <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100 flex dark:bg-neutral-800">
            <div
              style={{ width: `${walletPercent}%` }}
              className="bg-emerald-500 transition-all"
              title={`Wallet: ${walletPercent}%`}
            />
            <div
              style={{ width: `${cashPercent}%` }}
              className="bg-amber-500 transition-all"
              title={`Cash: ${cashPercent}%`}
            />
            <div
              style={{ width: `${otherPercent}%` }}
              className="bg-blue-500 transition-all"
              title={`Card/bKash: ${otherPercent}%`}
            />
          </div>

          {/* Legend Details */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-emerald-50/70 p-2 dark:bg-emerald-950/20">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Probashi Wallet</span>
              </div>
              <div className="mt-1 text-sm font-bold text-emerald-900 dark:text-emerald-200 tabular-nums">
                Tk {walletSalesTotal.toLocaleString()} ({walletPercent}%)
              </div>
            </div>

            <div className="rounded-lg bg-amber-50/70 p-2 dark:bg-amber-950/20">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-semibold">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Physical Cash</span>
              </div>
              <div className="mt-1 text-sm font-bold text-amber-900 dark:text-amber-200 tabular-nums">
                Tk {cashSalesTotal.toLocaleString()} ({cashPercent}%)
              </div>
            </div>

            <div className="rounded-lg bg-blue-50/70 p-2 dark:bg-blue-950/20">
              <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-semibold">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Card & bKash</span>
              </div>
              <div className="mt-1 text-sm font-bold text-blue-900 dark:text-blue-200 tabular-nums">
                Tk {cardAndBkashSalesTotal.toLocaleString()} ({otherPercent}%)
              </div>
            </div>
          </div>
        </div>

        {/* Operating Overhead & Low Stock Warnings */}
        <div className="flex flex-col gap-3">
          {/* This Month's Expense Total */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 flex-1">
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
              <span className="text-xs font-medium">This Month's Overhead</span>
              <Receipt className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-2 text-xl font-bold tracking-tight tabular-nums text-neutral-900 dark:text-neutral-100">
              Tk {thisMonthExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1 text-[11px] text-neutral-500 flex justify-between">
              <span>Rent, Utility & Salary</span>
              <button
                onClick={() => setActiveNav('finance_expenses')}
                className="text-emerald-600 hover:underline font-semibold"
              >
                View
              </button>
            </div>
          </div>

          {/* Low Stock Warning Alert Card */}
          <div
            onClick={() => setActiveNav('inventory_products')}
            className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50/60 p-4 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 flex-1"
          >
            <div className="flex items-center justify-between text-rose-700 dark:text-rose-300">
              <span className="text-xs font-semibold">Low-Stock Warnings</span>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="mt-2 text-xl font-bold tracking-tight text-rose-800 dark:text-rose-200 tabular-nums">
              {lowStockCount} Products Need Restock
            </div>
            <div className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
              Click to view inventory alerts and generate GRN
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Real-Time Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Audit / Movement Feed */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-400" />
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Recent Retail Movements & Audit Trail
              </h3>
            </div>
            <button
              onClick={() => setActiveNav('reports_audit')}
              className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Full Log
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {stockMovements.slice(0, 5).map(mov => (
              <div key={mov.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {mov.productName}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {mov.reason || mov.type} · By {mov.performedBy}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold ${
                      mov.quantityChange > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange} units
                  </span>
                  <div className="text-[10px] text-neutral-400">{mov.timestamp.slice(11, 16)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Logic Quick Reference Guide */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            PureBazar v3.3 Core Invariants
          </h3>
          <ul className="space-y-2 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Shareholder Discount (5%):</strong> 100% borne by PureBazar. Vendor payable is NOT reduced.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Wallet Debits:</strong> Current Balance only. Generation Bonus is never debited.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>GRN Intake:</strong> Restocks existing products into Central Warehouse; stock updates on approval.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Payroll Auto-Posting:</strong> Disbursed salary sheets immediately post to company Expenses.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
