import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Boxes, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SalesStockReport: React.FC = () => {
  const { products, orders } = useApp();

  // Aggregate product sales
  const productSalesCount: Record<string, { qty: number; revenue: number }> = {};
  orders.forEach(o => {
    if (o.paymentStatus === 'PAID') {
      o.items.forEach(i => {
        if (!productSalesCount[i.productId]) {
          productSalesCount[i.productId] = { qty: 0, revenue: 0 };
        }
        productSalesCount[i.productId].qty += i.quantity;
        productSalesCount[i.productId].revenue += i.totalStandardPrice;
      });
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Sales & Stock Turnover Analytics
        </h2>
        <p className="text-xs text-neutral-500">
          Analyze velocity of product movement, fast-moving consumer goods (FMCG), and stock rotation
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3 text-center">Current Total Stock</th>
              <th className="px-4 py-3 text-center">Units Sold</th>
              <th className="px-4 py-3 text-right">Turnover Revenue</th>
              <th className="px-4 py-3 text-center">Velocity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {products.map(p => {
              const totalOutletStock = Object.values(p.outletStock).reduce((a, b) => a + b, 0);
              const totalStock = p.centralStock + totalOutletStock;
              const stats = productSalesCount[p.id] || { qty: 0, revenue: 0 };

              return (
                <tr key={p.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{p.categoryName}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800">
                      {p.ownerType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold">
                    {totalStock} {p.unit}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-emerald-600">
                    {stats.qty} {p.unit}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-neutral-900 dark:text-white">
                    Tk {stats.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        stats.qty > 0
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800'
                      }`}
                    >
                      {stats.qty > 0 ? 'High Movement' : 'Regular'}
                    </span>
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
