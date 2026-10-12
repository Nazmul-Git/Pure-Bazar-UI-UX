import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  CheckCircle,
  Printer,
  Send,
  Building,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SalarySheet, Employee } from '../../types';

export const PayrollManager: React.FC = () => {
  const { salarySheets, employees, createSalarySheet, approveSalarySheet, paySalarySheet, setActiveNav } = useApp();
  const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);
  const [targetMonth, setTargetMonth] = useState('2026-10');
  const [targetLocation, setTargetLocation] = useState('All');
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<Employee | null>(null);

  const handleCreateSheet = (e: React.FormEvent) => {
    e.preventDefault();
    createSalarySheet(targetMonth, targetLocation);
    setIsNewSheetOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Monthly Payroll & Salary Disbursement [NEW v3.2/3.3]
          </h2>
          <p className="text-xs text-neutral-500">
            Generate monthly salary sheets. Paying a sheet automatically creates a company Expense entry!
          </p>
        </div>

        <button
          onClick={() => setIsNewSheetOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Generate Salary Sheet</span>
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3">Salary Sheet #</th>
              <th className="px-4 py-3">Billing Month</th>
              <th className="px-4 py-3">Facility</th>
              <th className="px-4 py-3 text-center">Staff Count</th>
              <th className="px-4 py-3 text-right">Gross Basic</th>
              <th className="px-4 py-3 text-right">Allowances</th>
              <th className="px-4 py-3 text-right">Net Payable Total</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {salarySheets.map(sheet => (
              <tr key={sheet.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {sheet.sheetNumber}
                </td>
                <td className="px-4 py-3 font-mono text-neutral-600 dark:text-neutral-300">
                  {sheet.month}
                </td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{sheet.location}</td>
                <td className="px-4 py-3 text-center font-bold">{sheet.employeeCount} Staff</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-500">
                  Tk {sheet.grossSalaryTotal.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-neutral-500">
                  Tk {sheet.allowancesTotal.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  Tk {sheet.netSalaryTotal.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      sheet.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : sheet.status === 'Approved'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sheet.status}
                  </span>
                  {sheet.expenseId && (
                    <div className="text-[9px] text-emerald-600 font-semibold mt-0.5">
                      ✓ Posted to Expenses
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {sheet.status === 'Draft' && (
                      <button
                        onClick={() => approveSalarySheet(sheet.id)}
                        className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                      >
                        Approve
                      </button>
                    )}
                    {sheet.status === 'Approved' && (
                      <button
                        onClick={() => paySalarySheet(sheet.id)}
                        className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-xs"
                        title="Disburse salary and automatically create an expense entry"
                      >
                        <Send className="h-3 w-3" />
                        <span>Disburse & Post Expense</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedPayslipEmp(employees[0])}
                      className="p-1 rounded hover:bg-neutral-100 text-neutral-600 dark:hover:bg-neutral-800 dark:text-neutral-400"
                      title="Print sample staff payslip"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Salary Sheet Modal */}
      {isNewSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Generate Monthly Salary Sheet
            </h3>

            <form onSubmit={handleCreateSheet} className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Billing Month:*
                </label>
                <input
                  type="month"
                  required
                  value={targetMonth}
                  onChange={e => setTargetMonth(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Facility / Location:*
                </label>
                <select
                  value={targetLocation}
                  onChange={e => setTargetLocation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value="All">All Locations Consolidated</option>
                  <option value="Central Warehouse (Tejgaon)">Central Warehouse (Tejgaon)</option>
                  <option value="Outlet 1 - Dhanmondi">Outlet 1 - Dhanmondi</option>
                  <option value="Outlet 2 - Gulshan">Outlet 2 - Gulshan</option>
                  <option value="Outlet 3 - Uttara">Outlet 3 - Uttara</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSheetOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Create Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip View Modal */}
      {selectedPayslipEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 border font-mono text-xs space-y-3">
            <div className="text-center border-b pb-3">
              <h3 className="font-bold text-sm">PUREBAZAR EMPLOYEE PAYSLIP</h3>
              <p className="text-[11px] text-neutral-500">Period: October 2026</p>
            </div>

            <div className="space-y-1 text-[11px]">
              <div>Employee: {selectedPayslipEmp.fullName} ({selectedPayslipEmp.empCode})</div>
              <div>Designation: {selectedPayslipEmp.designation}</div>
              <div>Facility: {selectedPayslipEmp.location}</div>
              <div>Payment Mode: {selectedPayslipEmp.paymentMethod}</div>
            </div>

            <div className="border-t pt-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Basic Salary:</span>
                <span>Tk {selectedPayslipEmp.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>House Rent:</span>
                <span>Tk {selectedPayslipEmp.houseAllowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Medical Allowance:</span>
                <span>Tk {selectedPayslipEmp.medicalAllowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport Allowance:</span>
                <span>Tk {selectedPayslipEmp.transportAllowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-1 font-bold text-sm text-emerald-700">
                <span>Net Disbursed:</span>
                <span>
                  Tk {(
                    selectedPayslipEmp.basicSalary +
                    selectedPayslipEmp.houseAllowance +
                    selectedPayslipEmp.medicalAllowance +
                    selectedPayslipEmp.transportAllowance
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100"
              >
                <Printer className="h-3.5 w-3.5" /> Print Payslip
              </button>
              <button
                onClick={() => setSelectedPayslipEmp(null)}
                className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
