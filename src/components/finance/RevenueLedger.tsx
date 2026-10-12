import React from 'react';
import { DollarSign, TrendingUp, PieChart, Info, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RevenueLedger: React.FC = () => {
  const { categories, orders } = useApp();

  // Aggregate by category
  const categoryStats: Record<
    string,
    { grossSales: number; discountBorne: number; companyNet: number; vendorPayable: number; itemsSold: number }
  > = {};

  categories.forEach(c => {
    categoryStats[c.id] = { grossSales: 0, discountBorne: 0, companyNet: 0, vendorPayable: 0, itemsSold: 0 };
  });

  let totalGross = 0;
  let totalCompanyNet = 0;
  let totalDiscountsBorne = 0;
  let totalVendorPayable = 0;

  orders.forEach(order => {
    if (order.paymentStatus === 'PAID') {
      order.items.forEach(item => {
        const prodCat = categories.find(c => c.name === item.productName || true); // fallback
        const catId = categories[0]?.id || 'cat-1';

        if (!categoryStats[catId]) {
          categoryStats[catId] = { grossSales: 0, discountBorne: 0, companyNet: 0, vendorPayable: 0, itemsSold: 0 };
        }

        categoryStats[catId].grossSales += item.totalStandardPrice;
        categoryStats[catId].discountBorne += item.discountAmount;
        categoryStats[catId].companyNet += item.companyNet;
        categoryStats[catId].vendorPayable += item.vendorPayable;
        categoryStats[catId].itemsSold += item.quantity;

        totalGross += item.totalStandardPrice;
        totalCompanyNet += item.companyNet;
        totalDiscountsBorne += item.discountAmount;
        totalVendorPayable += item.vendorPayable;
      });
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Company Revenue Ledger & Category Margins
        </h2>
        <p className="text-xs text-neutral-500">
          Audited breakdown of retail turnover: Vendor Payable vs Shareholder Discount Absorbed vs PureBazar Net Margin
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Gross Sales Volume</span>
          <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
            Tk {totalGross.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400">Standard retail invoice price</div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">PureBazar Company Net</span>
          <div className="mt-1 text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
            Tk {totalCompanyNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            Margin after bearing 5% discount
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Shareholder Discounts Borne</span>
          <div className="mt-1 text-2xl font-bold tabular-nums text-lime-700 dark:text-lime-400">
            Tk {totalDiscountsBorne.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400">100% absorbed by company</div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Total Vendor Payable</span>
          <div className="mt-1 text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-400">
            Tk {totalVendorPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400">Standard price minus commission</div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Category Name</th>
              <th className="px-4 py-3 text-center">Category Commission %</th>
              <th className="px-4 py-3 text-right">Gross Sales</th>
              <th className="px-4 py-3 text-right">Shareholder Discount</th>
              <th className="px-4 py-3 text-right">Vendor Payable Dues</th>
              <th className="px-4 py-3 text-right font-bold">PureBazar Company Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {categories.map(cat => {
              const stats = categoryStats[cat.id] || { grossSales: 0, discountBorne: 0, companyNet: 0, vendorPayable: 0 };

              return (
                <tr key={cat.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold">
                    {cat.commissionPercent}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                    Tk {stats.grossSales.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-lime-700 dark:text-lime-400">
                    Tk {stats.discountBorne.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-amber-700 dark:text-amber-400">
                    Tk {stats.vendorPayable.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    Tk {stats.companyNet.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
