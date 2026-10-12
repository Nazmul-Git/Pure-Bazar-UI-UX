import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Smartphone,
  Store,
  UserCheck,
  Menu,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PureBazarLogo } from './PureBazarLogo';
import { INITIAL_OUTLETS } from '../../data/initialData';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    activeOutlet,
    setActiveOutlet,
    currentUser,
    setCurrentUser,
    allStaff,
    activeNav,
    setActiveNav,
    setIsCustomerPhoneModalOpen,
    activePaymentRequest,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Quick navigation search items
  const searchItems = [
    { label: 'POS Billing Counter', key: 'pos_counter', category: 'Sales' },
    { label: 'Products & Inventory', key: 'inventory_products', category: 'Inventory' },
    { label: 'Goods Receive (GRN)', key: 'inventory_grn', category: 'Inventory' },
    { label: 'Outlet Stock Transfer', key: 'inventory_transfers', category: 'Inventory' },
    { label: 'Stock Adjustment', key: 'inventory_adjustments', category: 'Inventory' },
    { label: 'Category & Commission %', key: 'inventory_categories', category: 'Inventory' },
    { label: 'Vendor Directory', key: 'vendors_directory', category: 'Vendors' },
    { label: 'Register Vendor (Form A)', key: 'vendors_directory', category: 'Vendors' },
    { label: 'Vendor Ledger & Earnings', key: 'vendors_ledger', category: 'Vendors' },
    { label: 'Monthly Statements & Payout', key: 'vendors_statement', category: 'Vendors' },
    { label: 'Shareholder Member Search', key: 'shareholders_search', category: 'Shareholders' },
    { label: 'Probashi Wallet Logs', key: 'shareholders_wallet_logs', category: 'Shareholders' },
    { label: 'Expenses & Payroll', key: 'finance_expenses', category: 'Finance' },
    { label: 'Reconciliation', key: 'finance_reconciliation', category: 'Finance' },
    { label: 'Profit & Loss Report', key: 'reports_profit_loss', category: 'Reports' },
    { label: 'System Settings', key: 'settings', category: 'Settings' },
  ];

  const filteredSearch = searchQuery.trim()
    ? searchItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white/95 px-4 md:px-6 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95">
      {/* Zone 1: Brand & Mobile Menu */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 lg:hidden dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <PureBazarLogo size="md" />
      </div>

      {/* Zone 2: Search & Quick Navigation */}
      <div className="relative hidden max-w-md flex-1 px-4 md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search menu, products, vendors, shareholder ID..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50/80 py-1.5 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-emerald-500 dark:focus:bg-neutral-800"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && filteredSearch.length > 0 && (
          <div className="absolute left-4 right-4 top-full mt-1 max-h-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1.5 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 z-50">
            {filteredSearch.map(item => (
              <button
                key={item.key + item.label}
                onClick={() => {
                  setActiveNav(item.key as any);
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {item.label}
                </span>
                <span className="text-xs text-neutral-400">{item.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zone 3: Actions, Outlet Selector, User Switch, Theme */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Customer Phone Simulator Launcher */}
        <button
          onClick={() => setIsCustomerPhoneModalOpen(true)}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shadow-xs ${
            activePaymentRequest && activePaymentRequest.status === 'PENDING'
              ? 'bg-amber-500 text-white animate-pulse'
              : 'border border-lime-600/30 bg-lime-50 text-lime-800 hover:bg-lime-100 dark:border-lime-500/30 dark:bg-lime-950/40 dark:text-lime-300 dark:hover:bg-lime-950/70'
          }`}
          title="Open ProbashiHNR shareholder mobile screen to test smart QR and PIN approval"
        >
          <Smartphone className="h-4 w-4" />
          <span className="hidden sm:inline">Customer Phone</span>
          {activePaymentRequest && activePaymentRequest.status === 'PENDING' && (
            <span className="rounded-full bg-white px-1.5 py-0.2 text-[10px] font-bold text-amber-700">
              1 Pending
            </span>
          )}
        </button>

        {/* Outlet Switcher */}
        <div className="relative hidden xl:flex items-center">
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs dark:border-neutral-800 dark:bg-neutral-800/80">
            <Store className="h-3.5 w-3.5 text-neutral-500" />
            <select
              value={activeOutlet.id}
              onChange={e => {
                const found = INITIAL_OUTLETS.find(o => o.id === e.target.value);
                if (found) setActiveOutlet(found);
              }}
              className="bg-transparent font-medium text-neutral-700 focus:outline-none dark:text-neutral-200 cursor-pointer"
            >
              {INITIAL_OUTLETS.map(o => (
                <option key={o.id} value={o.id} className="dark:bg-neutral-900">
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role & Staff Account Switcher */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs dark:border-neutral-800 dark:bg-neutral-800/80">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <select
              value={currentUser.id}
              onChange={e => {
                const found = allStaff.find(s => s.id === e.target.value);
                if (found) setCurrentUser(found);
              }}
              className="bg-transparent font-medium text-neutral-700 focus:outline-none dark:text-neutral-200 cursor-pointer"
              title="Switch user role to test permissions and workflows"
            >
              {allStaff.map(s => (
                <option key={s.id} value={s.id} className="dark:bg-neutral-900">
                  {s.fullName} ({s.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          aria-label="Toggle dark mode"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
