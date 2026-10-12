import React, { useState } from 'react';
import { Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SalaryAdvanceDeductions: React.FC = () => {
  const { salaryAdvances, employees, addSalaryAdvance } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [type, setType] = useState<'Advance' | 'Absence Deduction' | 'Loan Adjustment'>('Advance');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === employeeId);
    if (!emp || !amount) return;

    addSalaryAdvance({
      employeeId: emp.id,
      employeeName: emp.fullName,
      empCode: emp.empCode,
      type,
      amount: parseFloat(amount),
      monthApplied: new Date().toISOString().substring(0, 7),
      reason,
    });

    setIsAddOpen(false);
    setAmount('');
    setReason('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Salary Advances & Deductions [NEW v3.2/3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Track early advances, unpaid absence days, and staff loans subtracted in the monthly payroll sheet
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Record Advance / Deduction</span>
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Month Applied</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {salaryAdvances.map(sa => (
              <tr key={sa.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {sa.employeeName}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">{sa.empCode}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      sa.type === 'Advance'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {sa.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-neutral-500">{sa.date}</td>
                <td className="px-4 py-3 font-mono text-neutral-700 dark:text-neutral-300">
                  {sa.monthApplied}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-neutral-900 dark:text-white">
                  Tk {sa.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{sa.reason}</td>
                <td className="px-4 py-3 text-center">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {sa.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Record Advance or Deduction
            </h3>

            <form onSubmit={handleCreate} className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Employee:*
                </label>
                <select
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.empCode} - {e.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Type:*
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value="Advance">Salary Advance</option>
                  <option value="Absence Deduction">Absence / Unpaid Leave Deduction</option>
                  <option value="Loan Adjustment">Loan Repayment Adjustment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Amount (BDT):*
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 3000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Reason:*
                </label>
                <textarea
                  required
                  placeholder="Description..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
