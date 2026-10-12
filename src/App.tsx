import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CustomerPhoneSimulatorModal } from './components/common/CustomerPhoneSimulatorModal';
import { ReceiptPrintModal } from './components/common/ReceiptPrintModal';

// Dashboard
import { DashboardOverview } from './components/dashboard/DashboardOverview';

// Inventory
import { ProductsList } from './components/inventory/ProductsList';
import { CategoryCommission } from './components/inventory/CategoryCommission';
import { BrandUnitManager } from './components/inventory/BrandUnitManager';
import { GoodsReceiveManager } from './components/inventory/GoodsReceiveManager';
import { CentralWarehouseStock } from './components/inventory/CentralWarehouseStock';
import { OutletTransferManager } from './components/inventory/OutletTransferManager';
import { StockAdjustmentManager } from './components/inventory/StockAdjustmentManager';
import { StockCountManager } from './components/inventory/StockCountManager';
import { BarcodeLabelGenerator } from './components/inventory/BarcodeLabelGenerator';

// POS
import { POSCounter } from './components/pos/POSCounter';
import { SalesHistory } from './components/pos/SalesHistory';
import { ReturnsExchanges } from './components/pos/ReturnsExchanges';
import { CashierShiftClose } from './components/pos/CashierShiftClose';

// Vendors
import { VendorDirectory } from './components/vendors/VendorDirectory';
import { VendorLedger } from './components/vendors/VendorLedger';
import { MonthlyStatements } from './components/vendors/MonthlyStatements';
import { MonthlyPayout } from './components/vendors/MonthlyPayout';
import { PayoutHistory } from './components/vendors/PayoutHistory';

// Shareholders
import { MemberSearch } from './components/shareholders/MemberSearch';
import { WalletPaymentLogs } from './components/shareholders/WalletPaymentLogs';

// Roles
import { RoleManagement } from './components/roles/RoleManagement';

// Finance
import { RevenueLedger } from './components/finance/RevenueLedger';
import { ExpensesManager } from './components/finance/ExpensesManager';
import { EmployeesHR } from './components/finance/EmployeesHR';
import { PayrollManager } from './components/finance/PayrollManager';
import { SalaryAdvanceDeductions } from './components/finance/SalaryAdvanceDeductions';
import { ReconciliationManager } from './components/finance/ReconciliationManager';

// Reports
import { SalesStockReport } from './components/reports/SalesStockReport';
import { VendorProfitability } from './components/reports/VendorProfitability';
import { ProfitLossReport } from './components/reports/ProfitLossReport';
import { AuditTrailView } from './components/reports/AuditTrailView';

// Settings
import { SystemSettingsView } from './components/settings/SystemSettingsView';

const MainLayout: React.FC = () => {
  const { activeNav } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'inventory_products':
        return <ProductsList />;
      case 'inventory_categories':
        return <CategoryCommission />;
      case 'inventory_brands':
        return <BrandUnitManager />;
      case 'inventory_grn':
        return <GoodsReceiveManager />;
      case 'inventory_central_stock':
        return <CentralWarehouseStock />;
      case 'inventory_transfers':
        return <OutletTransferManager />;
      case 'inventory_adjustments':
        return <StockAdjustmentManager />;
      case 'inventory_stock_count':
        return <StockCountManager />;
      case 'inventory_barcodes':
        return <BarcodeLabelGenerator />;
      case 'pos_counter':
        return <POSCounter />;
      case 'pos_history':
        return <SalesHistory />;
      case 'pos_returns':
        return <ReturnsExchanges />;
      case 'pos_shift':
        return <CashierShiftClose />;
      case 'vendors_directory':
        return <VendorDirectory />;
      case 'vendors_ledger':
        return <VendorLedger />;
      case 'vendors_statement':
        return <MonthlyStatements />;
      case 'vendors_payout':
      case 'finance_payout_approval':
        return <MonthlyPayout />;
      case 'vendors_payout_history':
        return <PayoutHistory />;
      case 'shareholders_search':
        return <MemberSearch />;
      case 'shareholders_wallet_logs':
        return <WalletPaymentLogs />;
      case 'roles_management':
        return <RoleManagement />;
      case 'finance_revenue':
        return <RevenueLedger />;
      case 'finance_expenses':
        return <ExpensesManager />;
      case 'finance_employees':
        return <EmployeesHR />;
      case 'finance_payroll':
        return <PayrollManager />;
      case 'finance_salary_advances':
        return <SalaryAdvanceDeductions />;
      case 'finance_reconciliation':
        return <ReconciliationManager />;
      case 'reports_sales':
        return <SalesStockReport />;
      case 'reports_vendor_profitability':
        return <VendorProfitability />;
      case 'reports_profit_loss':
        return <ProfitLossReport />;
      case 'reports_audit':
        return <AuditTrailView />;
      case 'settings':
        return <SystemSettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Top Bar Header */}
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

      {/* Main Container with Sidebar + Viewport */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Scrollable Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin">
          <div className="mx-auto max-w-7xl">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Interactive ProbashiHNR Customer Phone Simulator Modal */}
      <CustomerPhoneSimulatorModal />

      {/* Printable Thermal Receipt Modal */}
      <ReceiptPrintModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
