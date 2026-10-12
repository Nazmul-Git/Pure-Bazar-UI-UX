export type OwnerType = 'Company' | 'Vendor';

export interface Outlet {
  id: string;
  name: string;
  type: string;
  address?: string;
  contact?: string;
}

export type ProductStatus = 'Active' | 'Low Stock' | 'Out of Stock' | 'Discontinued';

export interface Product {
  id: string;
  name: string;
  bnName?: string;
  barcode: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  unit: string;
  ownerType: OwnerType;
  vendorId?: string;
  vendorName?: string;
  costPrice: number;
  standardPrice: number; // Standard price for Cash, Card, bKash
  walletDiscountPercent: number; // default 5%
  centralStock: number;
  outletStock: Record<string, number>; // outletId -> quantity
  minStockAlert: number;
  listedOnline: boolean; // default false (reserved for future)
  channel: 'POS' | 'ONLINE';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  commissionPercent: number; // Commission % PureBazar takes on vendor sales (e.g. Groceries 10%)
  productCount: number;
  description?: string;
}

export interface Vendor {
  id: string;
  shareholderId: string; // Associated ProbashiHNR shareholder account
  fullName: string;
  mobile: string;
  shopName: string;
  address: string;
  categoryId: string;
  categoryName: string;
  commissionAgreementPercent: number;
  payoutWalletNumber: string; // Probashi account
  termsAccepted: boolean;
  termsVersion: string;
  status: 'Active' | 'Suspended' | 'Closed';
  registeredDate: string;
  registeredBy: string;
  totalSalesValue: number;
  totalCommissionPaid: number;
  pendingPayable: number;
}

export interface GoodsReceiveNote {
  id: string;
  grnNumber: string; // e.g. GRN-2026-10-001
  type: 'Vendor Consignment' | 'Company Purchase';
  vendorId?: string;
  vendorName?: string;
  challanNumber: string; // Vendor delivery challan reference
  receivedDate: string;
  receivedBy: string;
  status: 'Draft' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  items: GRNItem[];
}

export interface GRNItem {
  productId: string;
  productName: string;
  barcode: string;
  unit: string;
  currentStock: number;
  deliveredQty: number;
  acceptedQty: number;
  rejectedQty: number;
  costPrice: number;
  salePrice: number;
  totalCost: number;
  rejectionReason?: string;
}

export interface StockMovement {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  barcode: string;
  type: 'GRN' | 'POS_SALE' | 'POS_RETURN' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'ADJUSTMENT' | 'STOCK_COUNT_ADJUST';
  referenceId: string; // GRN ID, Order ID, Transfer ID, etc.
  location: string; // 'Central Warehouse' or Outlet ID
  quantityChange: number; // positive or negative
  newBalance: number;
  reason?: string;
  performedBy: string;
}

export interface OutletTransfer {
  id: string;
  transferNumber: string; // TR-2026-10-001
  fromLocation: string; // Usually 'Central Warehouse'
  toOutletId: string;
  toOutletName: string;
  requestDate: string;
  requestedBy: string;
  dispatchDate?: string;
  dispatchedBy?: string;
  receiveDate?: string;
  receivedBy?: string;
  status: 'Requested' | 'Dispatched' | 'Received' | 'Discrepancy';
  notes?: string;
  items: {
    productId: string;
    productName: string;
    barcode: string;
    unit: string;
    requestedQty: number;
    dispatchedQty: number;
    receivedQty: number;
  }[];
}

export interface StockAdjustment {
  id: string;
  adjNumber: string;
  location: string;
  productId: string;
  productName: string;
  barcode: string;
  quantityChange: number; // e.g. -2 for damage
  costImpact: number;
  reason: 'Damage' | 'Expiry' | 'Loss / Theft' | 'Counting Correction' | 'Other';
  notes: string;
  requiresSuperAdminApproval: boolean;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  requestedBy: string;
  approvedBy?: string;
  date: string;
}

export interface StockCountAudit {
  id: string;
  countNumber: string;
  location: string;
  auditDate: string;
  auditor: string;
  status: 'Draft' | 'Finalized';
  items: {
    productId: string;
    productName: string;
    barcode: string;
    systemStock: number;
    countedStock: number;
    difference: number;
    unit: string;
  }[];
}

export type PaymentMethod = 'WALLET' | 'CASH' | 'CARD' | 'BKASH';

export type PaymentStatus = 'PENDING_PAYMENT' | 'PAID' | 'UNKNOWN' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  barcode: string;
  unit: string;
  ownerType: OwnerType;
  vendorId?: string;
  vendorName?: string;
  quantity: number;
  unitStandardPrice: number;
  unitWalletPrice: number;
  totalStandardPrice: number;
  totalWalletPrice: number;
  commissionPercent: number;
  commissionAmount: number;
  discountAmount: number;
  companyNet: number;
  vendorPayable: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  channel: 'POS' | 'ONLINE';
  outletId: string;
  outletName: string;
  cashierId: string;
  cashierName: string;
  createdAt: string;
  items: OrderItem[];
  standardTotal: number;
  discountAmount: number;
  walletTotal: number;
  finalPaidAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  // Wallet payment specifics
  walletPaymentId?: string; // pid
  probashiPayCode?: string; // 6-digit pay code e.g. 482-915
  probashiTxnId?: string; // Transaction reference from ProbashiHNR
  memberId?: string; // Shareholder ID
  memberName?: string;
  memberMobile?: string;
  receiptNumber: string;
}

export interface WalletLog {
  id: string;
  orderId: string;
  orderNumber: string;
  paymentId: string; // pid
  probashiTxnId?: string;
  memberId?: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED' | 'UNKNOWN' | 'REFUNDED';
  reason?: string; // e.g. INSUFFICIENT_BALANCE, PIN_LOCKED, TIMEOUT
  cashier: string;
  outlet: string;
  timestamp: string;
  device: string;
}

export interface CashierShift {
  id: string;
  outletId: string;
  outletName: string;
  cashierId: string;
  cashierName: string;
  startTime: string;
  endTime?: string;
  status: 'OPEN' | 'CLOSED';
  openingCash: number;
  closingCashActual?: number;
  cashSalesTotal: number;
  walletSalesTotal: number;
  cardSalesTotal: number;
  bKashSalesTotal: number;
  totalSales: number;
  expectedCashInDrawer: number;
  cashVariance?: number;
  billCount: number;
  notes?: string;
}

export interface VendorLedgerEntry {
  id: string;
  vendorId: string;
  vendorName: string;
  orderId?: string;
  orderNumber?: string;
  statementId?: string;
  date: string;
  type: 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'PAYOUT';
  standardPrice: number;
  commissionPercent: number;
  commissionAmount: number;
  vendorPayable: number;
  payoutStatus: 'PENDING' | 'BATCHED' | 'PAID';
}

export interface VendorMonthlyStatement {
  id: string;
  statementNumber: string; // PB-STMT-2026-10-001
  vendorId: string;
  vendorName: string;
  month: string; // '2026-10'
  openingStockValue: number;
  receivedStockValue: number;
  soldStockValue: number;
  returnedStockValue: number;
  closingStockValue: number;
  grossSalesValue: number;
  commissionPercent: number;
  commissionTotal: number;
  netPayable: number;
  status: 'Draft' | 'Approved' | 'Paid';
  probashiTxnId?: string;
  payoutDate?: string;
  createdDate: string;
}

export interface VendorPayout {
  id: string;
  payoutBatchNumber: string;
  vendorId: string;
  vendorName: string;
  probashiWalletNumber: string;
  statementNumber: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  probashiTxnId: string;
  processedBy: string;
  processedAt: string;
}

export interface ShareholderMember {
  shareholderId: string; // e.g. PBN-89210
  fullName: string;
  mobile: string;
  currentBalance: number; // Available to pay
  generationBonusBalance: number; // LOCKED - NEVER debited by POS
  status: 'Active' | 'Suspended';
  walletEnabled: boolean;
  avatarUrl?: string;
  totalPureBazarSpend: number;
  totalDiscountSaved: number;
}

export type StaffRole =
  | 'Super Admin'
  | 'Inventory Manager'
  | 'Warehouse Staff'
  | 'Outlet Cashier'
  | 'Finance'
  | 'HR/Payroll';

export interface StaffAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: StaffRole;
  assignedLocation: string; // 'Central Warehouse' or 'Outlet 1 - Dhanmondi', etc.
  status: 'Active' | 'Disabled';
  lastLogin: string;
}

export interface Employee {
  id: string;
  empCode: string;
  fullName: string;
  designation: string;
  location: string;
  joiningDate: string;
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance: number;
  paymentMethod: 'Probashi Wallet Credit' | 'Bank Transfer' | 'Cash';
  walletOrAccountNo: string;
  hasSystemLogin: boolean;
  staffAccountId?: string;
}

export interface SalarySheet {
  id: string;
  sheetNumber: string;
  month: string; // '2026-10'
  location: string;
  employeeCount: number;
  grossSalaryTotal: number;
  allowancesTotal: number;
  bonusTotal: number;
  advancesAndDeductionsTotal: number;
  netSalaryTotal: number;
  status: 'Draft' | 'Approved' | 'Paid';
  createdDate: string;
  paidDate?: string;
  expenseId?: string; // Linked automatically to Expenses
}

export interface SalaryAdvance {
  id: string;
  employeeId: string;
  employeeName: string;
  empCode: string;
  type: 'Advance' | 'Absence Deduction' | 'Loan Adjustment';
  amount: number;
  monthApplied: string;
  reason: string;
  status: 'Approved' | 'Pending';
  date: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: string; // 'Salary', 'Rent', 'Electricity', 'Transport', 'Repair', 'Marketing', 'Packaging', 'Other'
  amount: number;
  date: string;
  location: string;
  paymentMethod: 'Probashi Merchant Wallet' | 'Cash' | 'Bank';
  referenceNo?: string;
  vendorOrPayee: string;
  description: string;
  attachmentName?: string;
  recordedBy: string;
  autoGeneratedFromPayroll?: boolean;
}

export interface SystemSettings {
  shareholderDiscountPercent: number; // default 5.0%
  qrExpirySeconds: number; // default 180s (3 minutes)
  pinMaxAttempts: number; // default 3
  superAdminAdjustmentLimit: number; // default 5000 Tk
  probashiApiStatus: 'CONNECTED' | 'DISCONNECTED';
  probashiApiMode: 'SANDBOX' | 'PRODUCTION';
  probashiMerchantId: string;
  probashiApiKey: string;
  probashiHmacSecret: string;
  probashiWebhookUrl: string;
  receiptHeader: string;
  receiptFooter: string;
  vatTaxNumber: string;
  enableVatInvoice: boolean;
  vendorTermsVersion: string;
  vendorTermsText: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  entityType: 'PRICE' | 'STOCK' | 'ROLE' | 'PAYOUT' | 'ORDER' | 'SETTING' | 'EXPENSE' | 'GRN';
  entityId: string;
  description: string;
  ipOrOutlet: string;
}
