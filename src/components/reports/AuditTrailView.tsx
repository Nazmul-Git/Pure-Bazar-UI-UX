import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filtered = auditLogs.filter(log => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || log.entityType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            System Security & Audit Trail [NEW v3.2/3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Immutable tracking of who changed what: price modifications, stock movements, payouts, role changes, and shift closes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-800"
          >
            <option value="ALL">All Entity Types</option>
            <option value="ORDER">Orders & Payments</option>
            <option value="STOCK">Stock & Movements</option>
            <option value="GRN">GRN Intakes</option>
            <option value="PAYOUT">Payouts</option>
            <option value="EXPENSE">Expenses & Payroll</option>
            <option value="SETTING">Settings & Commission</option>
            <option value="ROLE">Roles & Staff</option>
          </select>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter audit entries..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white py-1.5 pl-8 pr-3 text-xs dark:border-neutral-800 dark:bg-neutral-900"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Staff User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Action Event</th>
              <th className="px-4 py-3">Facility / IP</th>
              <th className="px-4 py-3">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.map(log => (
              <tr key={log.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                  {log.userName}
                </td>
                <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400 font-medium">
                  {log.role}
                </td>
                <td className="px-4 py-3 font-mono text-[11px]">
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{log.ipOrOutlet}</td>
                <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                  {log.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
