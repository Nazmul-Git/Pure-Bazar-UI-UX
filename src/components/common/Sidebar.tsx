import React, { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Users2,
  Wallet,
  ShieldCheck,
  Landmark,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Package,
  ArrowRightLeft,
  Sliders,
  ClipboardList,
  Printer,
  History,
  RotateCcw,
  Clock,
  UserPlus,
  FileSpreadsheet,
  Banknote,
  Receipt,
  FileCheck2,
  DollarSign,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { useApp, ActiveNavKey } from '../../context/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  sectionKey?: string;
  badge?: string;
  subItems?: {
    title: string;
    key: ActiveNavKey;
    isNew?: boolean;
    isUpdated?: boolean;
    badge?: string;
  }[];
  key?: ActiveNavKey;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeNav, setActiveNav, grns, transfers, adjustments, activePaymentRequest } = useApp();

  // Pending counts
  const pendingGrnCount = grns.filter(g => g.status === 'Draft').length;
  const pendingTransfersCount = transfers.filter(t => t.status === 'Requested').length;
  const pendingAdjustmentsCount = adjustments.filter(a => a.status === 'Pending Approval').length;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    inventory: true,
    sales: true,
    vendors: false,
    shareholders: false,
    finance: false,
    reports: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const menuSections: MenuItem[] = [
    {
      title: '1. Dashboard',
      icon: LayoutDashboard,
      key: 'dashboard',
    },
    {
      title: '2. Inventory',
      icon: Boxes,
      sectionKey: 'inventory',
      badge: pendingGrnCount + pendingTransfersCount > 0 ? `${pendingGrnCount + pendingTransfersCount}` : undefined,
      subItems: [
        { title: 'Products & Catalog', key: 'inventory_products' },
        { title: 'Category & Commission', key: 'inventory_categories', isUpdated: true },
        { title: 'Brand / Unit', key: 'inventory_brands' },
        { title: 'Goods Receive (GRN)', key: 'inventory_grn', isNew: true, badge: pendingGrnCount ? `${pendingGrnCount}` : undefined },
        { title: 'Central Warehouse Stock', key: 'inventory_central_stock' },
        { title: 'Outlet Transfer', key: 'inventory_transfers', badge: pendingTransfersCount ? `${pendingTransfersCount}` : undefined },
        { title: 'Stock Adjustment', key: 'inventory_adjustments', isNew: true, badge: pendingAdjustmentsCount ? `${pendingAdjustmentsCount}` : undefined },
        { title: 'Stock Count (Audit)', key: 'inventory_stock_count', isNew: true },
        { title: 'Barcode & Label Gen', key: 'inventory_barcodes' },
      ],
    },
    {
      title: '3. Sales (POS)',
      icon: ShoppingCart,
      sectionKey: 'sales',
      badge: activePaymentRequest ? 'Active' : undefined,
      subItems: [
        { title: 'POS Billing Counter', key: 'pos_counter' },
        { title: 'Sales History', key: 'pos_history' },
        { title: 'Returns & Exchanges', key: 'pos_returns' },
        { title: 'Cashier Shift / Day Close', key: 'pos_shift', isNew: true },
      ],
    },
    {
      title: '4. Vendors',
      icon: Users2,
      sectionKey: 'vendors',
      subItems: [
        { title: 'Vendor Directory', key: 'vendors_directory' },
        { title: 'Register Vendor (Form A)', key: 'vendors_directory', isNew: true },
        { title: 'Vendor Ledger & Earnings', key: 'vendors_ledger' },
        { title: 'Monthly Statement & Receipt', key: 'vendors_statement', isNew: true },
        { title: 'Monthly Payout', key: 'vendors_payout', isNew: true },
        { title: 'Payout History', key: 'vendors_payout_history' },
      ],
    },
    {
      title: '5. Shareholders',
      icon: Wallet,
      sectionKey: 'shareholders',
      subItems: [
        { title: 'Member Search', key: 'shareholders_search' },
        { title: 'Wallet Payment Logs', key: 'shareholders_wallet_logs' },
      ],
    },
    {
      title: '6. Roles',
      icon: ShieldCheck,
      key: 'roles_management',
    },
    {
      title: '7. Finance',
      icon: Landmark,
      sectionKey: 'finance',
      subItems: [
        { title: 'Revenue Ledger', key: 'finance_revenue' },
        { title: 'Payout Approval', key: 'finance_payout_approval' },
        { title: 'Expenses & Overhead', key: 'finance_expenses', isNew: true },
        { title: 'Employees (HR)', key: 'finance_employees', isNew: true },
        { title: 'Payroll / Salary Sheet', key: 'finance_payroll', isNew: true },
        { title: 'Salary Advances & Deduct', key: 'finance_salary_advances', isNew: true },
        { title: 'Probashi Daily Reconciliation', key: 'finance_reconciliation', isNew: true },
      ],
    },
    {
      title: '8. Reports',
      icon: BarChart3,
      sectionKey: 'reports',
      subItems: [
        { title: 'Sales & Stock Turnover', key: 'reports_sales' },
        { title: 'Vendor Profitability', key: 'reports_vendor_profitability' },
        { title: 'Expense & Profit/Loss', key: 'reports_profit_loss', isNew: true },
        { title: 'Audit Trail & Overrides', key: 'reports_audit', isNew: true },
      ],
    },
    {
      title: '9. Settings',
      icon: Settings,
      key: 'settings',
    },
  ];

  const handleNavClick = (key: ActiveNavKey) => {
    setActiveNav(key);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 dark:border-neutral-800 dark:bg-neutral-900 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            PureBazar Offline Core (v3.3)
          </div>

          {menuSections.map(section => {
            const Icon = section.icon;

            // Direct Single Route
            if (section.key) {
              const isActive = activeNav === section.key;
              return (
                <button
                  key={section.title}
                  onClick={() => handleNavClick(section.key!)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`} />
                    <span className="truncate">{section.title}</span>
                  </div>
                  {section.badge && (
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      {section.badge}
                    </span>
                  )}
                </button>
              );
            }

            // Collapsible Section
            const isExpanded = expandedSections[section.sectionKey || ''];
            const hasActiveChild = section.subItems?.some(sub => sub.key === activeNav);

            return (
              <div key={section.title} className="space-y-0.5">
                <button
                  onClick={() => toggleSection(section.sectionKey!)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    hasActiveChild && !isExpanded
                      ? 'bg-neutral-100 font-semibold text-neutral-900 dark:bg-neutral-800/60 dark:text-neutral-100'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="h-4 w-4 shrink-0 text-neutral-400" />
                    <span className="truncate">{section.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {section.badge && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {section.badge}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                    )}
                  </div>
                </button>

                {/* Sub Menu Items */}
                {isExpanded && (
                  <div className="ml-4 space-y-0.5 border-l border-neutral-200 pl-2 dark:border-neutral-800">
                    {section.subItems?.map(sub => {
                      const isSubActive = activeNav === sub.key;
                      return (
                        <button
                          key={sub.title}
                          onClick={() => handleNavClick(sub.key)}
                          className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[11px] font-medium transition-colors ${
                            isSubActive
                              ? 'bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
                          }`}
                        >
                          <span className="truncate">{sub.title}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {sub.badge && (
                              <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                {sub.badge}
                              </span>
                            )}
                            {sub.isNew && (
                              <span className="rounded bg-lime-100 px-1 py-0.2 text-[9px] font-bold text-lime-800 dark:bg-lime-950 dark:text-lime-300">
                                NEW
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* System Footer info */}
        <div className="border-t border-neutral-200 p-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          <div className="flex items-center justify-between text-[11px]">
            <span>Channel: POS Offline</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Probashi v3.3</span>
          </div>
        </div>
      </aside>
    </>
  );
};
