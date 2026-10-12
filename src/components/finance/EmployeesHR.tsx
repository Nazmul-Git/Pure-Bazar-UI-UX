import React, { useState } from 'react';
import { Users2, Plus, Phone, Briefcase, Building, CreditCard, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_OUTLETS } from '../../data/initialData';

export const EmployeesHR: React.FC = () => {
  const { employees } = useApp();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Employee Directory & HR Compensation [NEW v3.2/3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Master records for all retail employees (cashiers, warehouse managers, cleaners, guards)
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Emp Code</th>
              <th className="px-4 py-3">Full Name & Designation</th>
              <th className="px-4 py-3">Assigned Facility</th>
              <th className="px-4 py-3">Joining Date</th>
              <th className="px-4 py-3 text-right">Basic Salary</th>
              <th className="px-4 py-3 text-right">Allowances</th>
              <th className="px-4 py-3 text-right">Gross Total</th>
              <th className="px-4 py-3">Disbursement Method</th>
              <th className="px-4 py-3 text-center">System Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {employees.map(emp => {
              const allowances = emp.houseAllowance + emp.medicalAllowance + emp.transportAllowance;
              const gross = emp.basicSalary + allowances;

              return (
                <tr key={emp.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {emp.empCode}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {emp.fullName}
                    </div>
                    <div className="text-[11px] text-neutral-400">{emp.designation}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{emp.location}</td>
                  <td className="px-4 py-3 font-mono text-neutral-500">{emp.joiningDate}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                    Tk {emp.basicSalary.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-500">
                    Tk {allowances.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    Tk {gross.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-neutral-800 dark:text-neutral-200">{emp.paymentMethod}</div>
                    <div className="text-[10px] font-mono text-neutral-400">{emp.walletOrAccountNo}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {emp.hasSystemLogin ? (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Linked Account
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 italic">No Login (Staff)</span>
                    )}
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
