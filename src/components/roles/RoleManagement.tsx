import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Key,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffRole, StaffAccount } from '../../types';

export const RoleManagement: React.FC = () => {
  const { allStaff, currentUser, setCurrentUser } = useApp();

  const roleDefinitions: { role: StaffRole; description: string; permissions: string[] }[] = [
    {
      role: 'Super Admin',
      description: 'Unrestricted enterprise control: system settings, audit logs, price overrides, adjustments > Tk 5,000.',
      permissions: ['All System Menus', 'Approve Adjustments > 5k', 'Manage Staff & Roles', 'Payout Execution', 'System Settings'],
    },
    {
      role: 'Inventory Manager',
      description: 'Manages catalog, GRN intake approvals, central warehouse dispatch, and supplier price checks.',
      permissions: ['Catalog Management', 'GRN Intake & Approval', 'Inter-Outlet Transfer', 'Stock Counts'],
    },
    {
      role: 'Warehouse Staff',
      description: 'Central Warehouse operations: physical stock count, dispatch packing, challan verification.',
      permissions: ['Stock View', 'Transfer Dispatch', 'Physical Audit'],
    },
    {
      role: 'Outlet Cashier',
      description: 'POS billing, Probashi wallet checkouts, shift opening/closing, customer returns.',
      permissions: ['POS Counter', 'Shift Day Close', 'Returns & Refunds', 'Customer Member Lookup'],
    },
    {
      role: 'Finance',
      description: 'Vendor ledger auditing, monthly statements, Probashi batch payout approvals, expenses.',
      permissions: ['Revenue Ledger', 'Vendor Payouts', 'Expense Tracking', 'Probashi Daily Reconciliation'],
    },
    {
      role: 'HR/Payroll',
      description: 'Employee profiles, salary advance tracking, monthly payroll sheet generation with auto-expense posting.',
      permissions: ['Employee Directory', 'Salary Advance & Deductions', 'Monthly Salary Sheets', 'Payslip Print'],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Role-Based Access Control & Staff Accounts (RBAC)
        </h2>
        <p className="text-xs text-neutral-500">
          Configure menu permissions and staff credentials across Central Warehouse and retail outlets
        </p>
      </div>

      {/* Active User Simulation Switcher */}
      <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Active Session Profile:
            </span>
            <h3 className="text-base font-bold text-emerald-950 dark:text-white">
              {currentUser.fullName} ({currentUser.role})
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              Assigned Location: {currentUser.assignedLocation} · Username: {currentUser.username}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              Switch Test Account:
            </span>
            <select
              value={currentUser.id}
              onChange={e => {
                const found = allStaff.find(s => s.id === e.target.value);
                if (found) setCurrentUser(found);
              }}
              className="rounded-lg border border-emerald-400 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-950 dark:bg-neutral-900 dark:text-emerald-300"
            >
              {allStaff.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Accounts Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase text-neutral-500">
            Staff Logins & Outlet Assignments
          </h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Username / Email</th>
              <th className="px-4 py-3">Assigned Facility</th>
              <th className="px-4 py-3">Last Active</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {allStaff.map(staff => (
              <tr key={staff.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                  {staff.fullName}
                  {staff.id === currentUser.id && (
                    <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                      CURRENT
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-emerald-700 dark:text-emerald-400">
                  {staff.role}
                </td>
                <td className="px-4 py-3 text-neutral-500 font-mono text-[11px]">
                  {staff.username} ({staff.email})
                </td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                  {staff.assignedLocation}
                </td>
                <td className="px-4 py-3 text-neutral-400 text-[11px] font-mono">
                  {staff.lastLogin}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {staff.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permission Matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {roleDefinitions.map(r => (
          <div
            key={r.role}
            className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {r.role}
              </h4>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-neutral-500 leading-snug">{r.description}</p>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">
                Authorized Capabilities:
              </span>
              {r.permissions.map((p, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
