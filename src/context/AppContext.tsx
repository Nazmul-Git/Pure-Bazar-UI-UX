import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Vendor,
  GoodsReceiveNote,
  OutletTransfer,
  StockAdjustment,
  Order,
  OrderItem,
  WalletLog,
  CashierShift,
  VendorLedgerEntry,
  VendorMonthlyStatement,
  VendorPayout,
  ShareholderMember,
  StaffAccount,
  StaffRole,
  Employee,
  SalarySheet,
  SalaryAdvance,
  Expense,
  SystemSettings,
  AuditLog,
  StockMovement,
  PaymentMethod,
  Outlet,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_OUTLETS,
  INITIAL_SHAREHOLDERS,
  INITIAL_STAFF_ACCOUNTS,
  INITIAL_EMPLOYEES,
  INITIAL_EXPENSES,
  INITIAL_GRNS,
  INITIAL_TRANSFERS,
  INITIAL_ORDERS,
  INITIAL_WALLET_LOGS,
  INITIAL_ACTIVE_SHIFT,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

export type ActiveNavKey =
  | 'dashboard'
  | 'inventory_products'
  | 'inventory_categories'
  | 'inventory_brands'
  | 'inventory_grn'
  | 'inventory_central_stock'
  | 'inventory_transfers'
  | 'inventory_adjustments'
  | 'inventory_stock_count'
  | 'inventory_barcodes'
  | 'pos_counter'
  | 'pos_history'
  | 'pos_returns'
  | 'pos_shift'
  | 'vendors_directory'
  | 'vendors_ledger'
  | 'vendors_statement'
  | 'vendors_payout'
  | 'vendors_payout_history'
  | 'shareholders_search'
  | 'shareholders_wallet_logs'
  | 'roles_management'
  | 'finance_revenue'
  | 'finance_payout_approval'
  | 'finance_expenses'
  | 'finance_employees'
  | 'finance_payroll'
  | 'finance_salary_advances'
  | 'finance_reconciliation'
  | 'reports_sales'
  | 'reports_vendor_profitability'
  | 'reports_profit_loss'
  | 'reports_audit'
  | 'settings';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ActiveWalletPaymentRequest {
  orderId: string;
  orderNumber: string;
  paymentId: string; // pid
  payCode: string; // 6-digit code e.g. 482-915
  qrUrl: string;
  walletAmount: number;
  standardAmount: number;
  discountAmount: number;
  memberId?: string;
  memberName?: string;
  outletId: string;
  outletName: string;
  createdAt: number;
  expiresAt: number; // timestamp
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'FAILED';
  pinAttempts: number;
  errorReason?: string;
}

interface AppContextType {
  activeNav: ActiveNavKey;
  setActiveNav: (nav: ActiveNavKey) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activeOutlet: Outlet;
  setActiveOutlet: (outlet: Outlet) => void;
  currentUser: StaffAccount;
  setCurrentUser: (user: StaffAccount) => void;
  allStaff: StaffAccount[];
  
  // Data State
  products: Product[];
  categories: Category[];
  vendors: Vendor[];
  shareholders: ShareholderMember[];
  grns: GoodsReceiveNote[];
  transfers: OutletTransfer[];
  adjustments: StockAdjustment[];
  orders: Order[];
  walletLogs: WalletLog[];
  activeShift: CashierShift;
  vendorLedgers: VendorLedgerEntry[];
  monthlyStatements: VendorMonthlyStatement[];
  payouts: VendorPayout[];
  employees: Employee[];
  expenses: Expense[];
  salarySheets: SalarySheet[];
  salaryAdvances: SalaryAdvance[];
  settings: SystemSettings;
  auditLogs: AuditLog[];
  stockMovements: StockMovement[];

  // POS State & Actions
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  identifiedMember: ShareholderMember | null;
  setIdentifiedMember: (member: ShareholderMember | null) => void;
  verifyShareholder: (query: string) => ShareholderMember | null;
  activePaymentRequest: ActiveWalletPaymentRequest | null;
  startWalletPayment: () => void;
  cancelWalletPayment: () => void;
  approveWalletPaymentFromCustomerPhone: (pin: string) => { success: boolean; message: string };
  completeStandardPayment: (method: 'CASH' | 'CARD' | 'BKASH', paidAmount: number) => Order;
  refundOrder: (orderId: string, reason: string) => boolean;

  // Simulator Modal
  isCustomerPhoneModalOpen: boolean;
  setIsCustomerPhoneModalOpen: (open: boolean) => void;
  customerPhoneSimulatorMember: ShareholderMember;
  setCustomerPhoneSimulatorMember: (member: ShareholderMember) => void;

  // Thermal Receipt Modal
  receiptModalOrder: Order | null;
  setReceiptModalOrder: (order: Order | null) => void;

  // Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addCategory: (name: string, commissionPercent: number, description?: string) => void;
  updateCategoryCommission: (id: string, commissionPercent: number) => void;
  createGRN: (grn: Omit<GoodsReceiveNote, 'id' | 'grnNumber'>) => void;
  approveGRN: (grnId: string) => void;
  createTransfer: (transfer: Omit<OutletTransfer, 'id' | 'transferNumber'>) => void;
  dispatchTransfer: (transferId: string) => void;
  receiveTransfer: (transferId: string) => void;
  createAdjustment: (adj: Omit<StockAdjustment, 'id' | 'adjNumber' | 'date'>) => void;
  approveAdjustment: (adjId: string) => void;
  registerVendor: (vendorData: Omit<Vendor, 'id' | 'registeredDate' | 'registeredBy' | 'totalSalesValue' | 'totalCommissionPaid' | 'pendingPayable'>) => { success: boolean; message: string };
  generateMonthlyStatement: (vendorId: string, month: string) => VendorMonthlyStatement;
  approveMonthlyStatement: (statementId: string) => void;
  executeVendorPayout: (statementId: string) => { success: boolean; txnId: string };
  addExpense: (expense: Omit<Expense, 'id' | 'expenseNumber'>) => void;
  createSalarySheet: (month: string, location: string) => SalarySheet;
  approveSalarySheet: (sheetId: string) => void;
  paySalarySheet: (sheetId: string) => void;
  addSalaryAdvance: (advance: Omit<SalaryAdvance, 'id' | 'date' | 'status'>) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  closeActiveShift: (actualCountedCash: number, notes?: string) => void;
  openNewShift: (openingCash: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNav] = useState<ActiveNavKey>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeOutlet, setActiveOutlet] = useState<Outlet>(INITIAL_OUTLETS[1]); // Default to Outlet 1 - Dhanmondi
  const [currentUser, setCurrentUser] = useState<StaffAccount>(INITIAL_STAFF_ACCOUNTS[0]); // Default Super Admin
  const [allStaff, setAllStaff] = useState<StaffAccount[]>(INITIAL_STAFF_ACCOUNTS);

  // Entities
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [shareholders, setShareholders] = useState<ShareholderMember[]>(INITIAL_SHAREHOLDERS);
  const [grns, setGrns] = useState<GoodsReceiveNote[]>(INITIAL_GRNS);
  const [transfers, setTransfers] = useState<OutletTransfer[]>(INITIAL_TRANSFERS);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [walletLogs, setWalletLogs] = useState<WalletLog[]>(INITIAL_WALLET_LOGS);
  const [activeShift, setActiveShift] = useState<CashierShift>(INITIAL_ACTIVE_SHIFT);
  const [vendorLedgers, setVendorLedgers] = useState<VendorLedgerEntry[]>([
    {
      id: 'vled-1',
      vendorId: 'ven-1',
      vendorName: 'Rafiq Agro & Rice Mill',
      orderId: 'ord-1001',
      orderNumber: 'PB-ORD-20261012-001',
      date: '2026-10-12 09:30:15',
      type: 'SALE',
      standardPrice: 420.0,
      commissionPercent: 10,
      commissionAmount: 42.0,
      vendorPayable: 378.0,
      payoutStatus: 'PENDING',
    },
    {
      id: 'vled-2',
      vendorId: 'ven-2',
      vendorName: 'Shuddho Organic Mustard & Oil',
      orderId: 'ord-1002',
      orderNumber: 'PB-ORD-20261012-002',
      date: '2026-10-12 10:15:40',
      type: 'SALE',
      standardPrice: 640.0,
      commissionPercent: 8,
      commissionAmount: 51.2,
      vendorPayable: 588.8,
      payoutStatus: 'PENDING',
    },
  ]);
  const [monthlyStatements, setMonthlyStatements] = useState<VendorMonthlyStatement[]>([
    {
      id: 'stmt-2026-09-01',
      statementNumber: 'PB-STMT-2026-09-001',
      vendorId: 'ven-1',
      vendorName: 'Rafiq Agro & Rice Mill',
      month: '2026-09',
      openingStockValue: 45000,
      receivedStockValue: 120000,
      soldStockValue: 114100,
      returnedStockValue: 0,
      closingStockValue: 50900,
      grossSalesValue: 114100,
      commissionPercent: 10,
      commissionTotal: 11410,
      netPayable: 102690,
      status: 'Paid',
      probashiTxnId: 'TXN-PAYOUT-PBN-882190',
      payoutDate: '2026-10-02 11:30',
      createdDate: '2026-10-01',
    },
  ]);
  const [payouts, setPayouts] = useState<VendorPayout[]>([
    {
      id: 'po-1',
      payoutBatchNumber: 'PB-PAYOUT-2026-09-B1',
      vendorId: 'ven-1',
      vendorName: 'Rafiq Agro & Rice Mill',
      probashiWalletNumber: '01711982341',
      statementNumber: 'PB-STMT-2026-09-001',
      amount: 102690,
      status: 'SUCCESS',
      probashiTxnId: 'TXN-PAYOUT-PBN-882190',
      processedBy: 'Finance Officer (Mahbub Alam)',
      processedAt: '2026-10-02 11:30',
    },
  ]);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [salarySheets, setSalarySheets] = useState<SalarySheet[]>([
    {
      id: 'ss-2026-09',
      sheetNumber: 'SAL-2026-09-ALL',
      month: '2026-09',
      location: 'Central Warehouse (Tejgaon)',
      employeeCount: 4,
      grossSalaryTotal: 86000,
      allowancesTotal: 17500,
      bonusTotal: 0,
      advancesAndDeductionsTotal: 5000,
      netSalaryTotal: 98500,
      status: 'Paid',
      createdDate: '2026-09-30',
      paidDate: '2026-10-02',
      expenseId: 'exp-4',
    },
  ]);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>([
    {
      id: 'sa-1',
      employeeId: 'emp-1',
      employeeName: 'Arifur Rahman',
      empCode: 'PB-EMP-001',
      type: 'Advance',
      amount: 3000,
      monthApplied: '2026-10',
      reason: 'Medical emergency advance request',
      status: 'Approved',
      date: '2026-10-04',
    },
  ]);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([
    {
      id: 'sm-1',
      timestamp: '2026-10-09 14:00',
      productId: 'prod-1',
      productName: 'Pure Miniket Rice Premium 5kg',
      barcode: '89411001001',
      type: 'GRN',
      referenceId: 'GRN-2026-10-001',
      location: 'Central Warehouse',
      quantityChange: 30,
      newBalance: 120,
      reason: 'GRN delivery from Rafiq Agro',
      performedBy: 'Zubair Hossain',
    },
    {
      id: 'sm-2',
      timestamp: '2026-10-12 09:30:15',
      productId: 'prod-4',
      productName: 'Fortified Soybean Oil 5L Bottle',
      barcode: '89411002002',
      type: 'POS_SALE',
      referenceId: 'PB-ORD-20261012-001',
      location: 'out-1',
      quantityChange: -1,
      newBalance: 16,
      reason: 'POS Sale to Nazmul Hasan',
      performedBy: 'Arifur Rahman',
    },
  ]);

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [identifiedMember, setIdentifiedMember] = useState<ShareholderMember | null>(null);
  const [activePaymentRequest, setActivePaymentRequest] = useState<ActiveWalletPaymentRequest | null>(null);

  // Modals
  const [isCustomerPhoneModalOpen, setIsCustomerPhoneModalOpen] = useState(false);
  const [customerPhoneSimulatorMember, setCustomerPhoneSimulatorMember] = useState<ShareholderMember>(INITIAL_SHAREHOLDERS[0]);
  const [receiptModalOrder, setReceiptModalOrder] = useState<Order | null>(null);

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Audit helper
  const logAudit = (
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    description: string
  ) => {
    const entry: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.fullName,
      role: currentUser.role,
      action,
      entityType,
      entityId,
      description,
      ipOrOutlet: activeOutlet.name,
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setIdentifiedMember(null);
    setActivePaymentRequest(null);
  };

  // Shareholder member verify
  const verifyShareholder = (query: string): ShareholderMember | null => {
    const trimmed = query.trim().toLowerCase();
    const found = shareholders.find(
      s =>
        s.shareholderId.toLowerCase() === trimmed ||
        s.mobile.replace(/\D/g, '') === trimmed.replace(/\D/g, '') ||
        s.fullName.toLowerCase().includes(trimmed)
    );
    if (found) {
      setIdentifiedMember(found);
      setCustomerPhoneSimulatorMember(found);
      return found;
    }
    return null;
  };

  // Calculate cart totals
  const discountPercent = settings.shareholderDiscountPercent;

  const calculateCartSummary = () => {
    let standardTotal = 0;
    cart.forEach(item => {
      standardTotal += item.product.standardPrice * item.quantity;
    });
    const discountAmount = Number(((standardTotal * discountPercent) / 100).toFixed(2));
    const walletTotal = Number((standardTotal - discountAmount).toFixed(2));
    return { standardTotal, discountAmount, walletTotal };
  };

  // Start wallet payment flow (Part 3 & Part 3B)
  const startWalletPayment = () => {
    if (cart.length === 0) return;
    const { standardTotal, discountAmount, walletTotal } = calculateCartSummary();
    const now = Date.now();
    const expiryMs = settings.qrExpirySeconds * 1000;
    const orderRef = `PB-ORD-${Date.now().toString().slice(-8)}`;
    const pid = `pid_${Math.random().toString(36).substring(2, 12)}`;
    // Generate 6 digit code e.g. "482-915"
    const random6 = Math.floor(100000 + Math.random() * 900000).toString();
    const payCode = `${random6.slice(0, 3)}-${random6.slice(3)}`;
    const qrUrl = `https://probashihnr.com/p/${pid}`;

    const request: ActiveWalletPaymentRequest = {
      orderId: `ord-${Date.now()}`,
      orderNumber: orderRef,
      paymentId: pid,
      payCode,
      qrUrl,
      walletAmount: walletTotal,
      standardAmount: standardTotal,
      discountAmount,
      memberId: identifiedMember?.shareholderId,
      memberName: identifiedMember?.fullName,
      outletId: activeOutlet.id,
      outletName: activeOutlet.name,
      createdAt: now,
      expiresAt: now + expiryMs,
      status: 'PENDING',
      pinAttempts: 0,
    };

    setActivePaymentRequest(request);
    logAudit(
      'WALLET_PAYMENT_INITIATED',
      'ORDER',
      request.paymentId,
      `Wallet payment request initiated for ${walletTotal} BDT (Standard: ${standardTotal} BDT). Pay code: ${payCode}`
    );
  };

  const cancelWalletPayment = () => {
    if (!activePaymentRequest) return;
    if (activePaymentRequest.status === 'PAID') return; // Cannot cancel paid request per spec

    const failedLog: WalletLog = {
      id: `wlog-${Date.now()}`,
      orderId: activePaymentRequest.orderId,
      orderNumber: activePaymentRequest.orderNumber,
      paymentId: activePaymentRequest.paymentId,
      memberId: activePaymentRequest.memberId,
      amount: activePaymentRequest.walletAmount,
      status: 'CANCELLED',
      reason: 'CASHIER_CANCELLED',
      cashier: currentUser.fullName,
      outlet: activeOutlet.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      device: 'POS-Terminal-01',
    };

    setWalletLogs(prev => [failedLog, ...prev]);
    logAudit(
      'WALLET_PAYMENT_CANCELLED',
      'ORDER',
      activePaymentRequest.paymentId,
      `Wallet payment request ${activePaymentRequest.paymentId} was cancelled by cashier.`
    );
    setActivePaymentRequest(null);
  };

  // Customer phone simulator PIN submission
  const approveWalletPaymentFromCustomerPhone = (pin: string): { success: boolean; message: string } => {
    if (!activePaymentRequest) {
      return { success: false, message: 'No active payment request found.' };
    }

    if (Date.now() > activePaymentRequest.expiresAt) {
      setActivePaymentRequest(prev => (prev ? { ...prev, status: 'EXPIRED', errorReason: 'EXPIRED' } : null));
      const expLog: WalletLog = {
        id: `wlog-${Date.now()}`,
        orderId: activePaymentRequest.orderId,
        orderNumber: activePaymentRequest.orderNumber,
        paymentId: activePaymentRequest.paymentId,
        memberId: customerPhoneSimulatorMember.shareholderId,
        amount: activePaymentRequest.walletAmount,
        status: 'EXPIRED',
        reason: 'TIMEOUT_3MIN',
        cashier: currentUser.fullName,
        outlet: activeOutlet.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        device: 'POS-Terminal-01',
      };
      setWalletLogs(prev => [expLog, ...prev]);
      return { success: false, message: 'Payment request has expired. Please ask cashier for a new QR.' };
    }

    // Check balance
    if (customerPhoneSimulatorMember.currentBalance < activePaymentRequest.walletAmount) {
      const failLog: WalletLog = {
        id: `wlog-${Date.now()}`,
        orderId: activePaymentRequest.orderId,
        orderNumber: activePaymentRequest.orderNumber,
        paymentId: activePaymentRequest.paymentId,
        memberId: customerPhoneSimulatorMember.shareholderId,
        amount: activePaymentRequest.walletAmount,
        status: 'FAILED',
        reason: 'INSUFFICIENT_BALANCE',
        cashier: currentUser.fullName,
        outlet: activeOutlet.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        device: 'POS-Terminal-01',
      };
      setWalletLogs(prev => [failLog, ...prev]);
      return {
        success: false,
        message: `Insufficient balance! Current Balance is Tk ${customerPhoneSimulatorMember.currentBalance.toLocaleString()} but bill is Tk ${activePaymentRequest.walletAmount.toLocaleString()}. Generation Bonus cannot be used.`,
      };
    }

    // Default PIN is 1234
    if (pin !== '1234') {
      const newAttempts = activePaymentRequest.pinAttempts + 1;
      if (newAttempts >= settings.pinMaxAttempts) {
        setActivePaymentRequest(prev => (prev ? { ...prev, status: 'FAILED', errorReason: 'PIN_LOCKED' } : null));
        const lockLog: WalletLog = {
          id: `wlog-${Date.now()}`,
          orderId: activePaymentRequest.orderId,
          orderNumber: activePaymentRequest.orderNumber,
          paymentId: activePaymentRequest.paymentId,
          memberId: customerPhoneSimulatorMember.shareholderId,
          amount: activePaymentRequest.walletAmount,
          status: 'FAILED',
          reason: 'PIN_LOCKED',
          cashier: currentUser.fullName,
          outlet: activeOutlet.name,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          device: 'POS-Terminal-01',
        };
        setWalletLogs(prev => [lockLog, ...prev]);
        return { success: false, message: 'Too many incorrect PIN attempts! Payment session locked.' };
      }
      setActivePaymentRequest(prev => (prev ? { ...prev, pinAttempts: newAttempts } : null));
      return { success: false, message: `Incorrect Wallet PIN. (Attempts left: ${settings.pinMaxAttempts - newAttempts})` };
    }

    // SUCCESS: Atomic transaction
    const probashiTxnId = `TXN-PBN-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const member = customerPhoneSimulatorMember;

    // Deduct customer balance
    setShareholders(prev =>
      prev.map(s =>
        s.shareholderId === member.shareholderId
          ? {
              ...s,
              currentBalance: Number((s.currentBalance - activePaymentRequest.walletAmount).toFixed(2)),
              totalPureBazarSpend: s.totalPureBazarSpend + activePaymentRequest.walletAmount,
              totalDiscountSaved: s.totalDiscountSaved + activePaymentRequest.discountAmount,
            }
          : s
      )
    );

    // Build order items with full ledger mathematics per Part 3 & 3B
    const orderItems: OrderItem[] = cart.map(item => {
      const unitStd = item.product.standardPrice;
      const totalStd = unitStd * item.quantity;
      const unitWallet = Number((unitStd * (1 - discountPercent / 100)).toFixed(2));
      const totalWallet = Number((totalStd * (1 - discountPercent / 100)).toFixed(2));
      const lineDiscount = Number((totalStd - totalWallet).toFixed(2));

      let commPct = 0;
      let commAmt = 0;
      let companyNet = 0;
      let vendorPayable = 0;

      if (item.product.ownerType === 'Vendor') {
        const cat = categories.find(c => c.id === item.product.categoryId);
        commPct = cat ? cat.commissionPercent : 10;
        commAmt = Number(((totalStd * commPct) / 100).toFixed(2));
        // The company bears the whole shareholder discount:
        // company net = commission - discount
        companyNet = Number((commAmt - lineDiscount).toFixed(2));
        // vendor payable = standard price - commission
        vendorPayable = Number((totalStd - commAmt).toFixed(2));
      } else {
        // Company owned product: 100% company revenue minus discount
        commPct = 0;
        commAmt = 0;
        companyNet = totalWallet;
        vendorPayable = 0;
      }

      return {
        productId: item.product.id,
        productName: item.product.name,
        barcode: item.product.barcode,
        unit: item.product.unit,
        ownerType: item.product.ownerType,
        vendorId: item.product.vendorId,
        vendorName: item.product.vendorName,
        quantity: item.quantity,
        unitStandardPrice: unitStd,
        unitWalletPrice: unitWallet,
        totalStandardPrice: totalStd,
        totalWalletPrice: totalWallet,
        commissionPercent: commPct,
        commissionAmount: commAmt,
        discountAmount: lineDiscount,
        companyNet,
        vendorPayable,
      };
    });

    const newOrder: Order = {
      id: activePaymentRequest.orderId,
      orderNumber: activePaymentRequest.orderNumber,
      channel: 'POS',
      outletId: activeOutlet.id,
      outletName: activeOutlet.name,
      cashierId: currentUser.id,
      cashierName: currentUser.fullName,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      items: orderItems,
      standardTotal: activePaymentRequest.standardAmount,
      discountAmount: activePaymentRequest.discountAmount,
      walletTotal: activePaymentRequest.walletAmount,
      finalPaidAmount: activePaymentRequest.walletAmount,
      paymentMethod: 'WALLET',
      paymentStatus: 'PAID',
      walletPaymentId: activePaymentRequest.paymentId,
      probashiPayCode: activePaymentRequest.payCode,
      probashiTxnId,
      memberId: member.shareholderId,
      memberName: member.fullName,
      memberMobile: member.mobile,
      receiptNumber: `PB-REC-${Date.now().toString().slice(-6)}`,
    };

    // Update orders list
    setOrders(prev => [newOrder, ...prev]);

    // Deduct stock in current outlet
    setProducts(prev =>
      prev.map(p => {
        const cartMatch = cart.find(c => c.product.id === p.id);
        if (cartMatch) {
          const currentOutletStock = p.outletStock[activeOutlet.id] || 0;
          return {
            ...p,
            outletStock: {
              ...p.outletStock,
              [activeOutlet.id]: Math.max(0, currentOutletStock - cartMatch.quantity),
            },
          };
        }
        return p;
      })
    );

    // Record stock movements
    cart.forEach(item => {
      const currentStock = item.product.outletStock[activeOutlet.id] || 0;
      const movement: StockMovement = {
        id: `sm-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        productId: item.product.id,
        productName: item.product.name,
        barcode: item.product.barcode,
        type: 'POS_SALE',
        referenceId: newOrder.orderNumber,
        location: activeOutlet.id,
        quantityChange: -item.quantity,
        newBalance: Math.max(0, currentStock - item.quantity),
        reason: `POS Wallet Sale (Customer: ${member.fullName})`,
        performedBy: currentUser.fullName,
      };
      setStockMovements(prev => [movement, ...prev]);
    });

    // Post vendor ledgers
    orderItems.forEach(line => {
      if (line.ownerType === 'Vendor' && line.vendorId) {
        const ledgerLine: VendorLedgerEntry = {
          id: `vled-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          vendorId: line.vendorId,
          vendorName: line.vendorName || 'Vendor',
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          date: newOrder.createdAt,
          type: 'SALE',
          standardPrice: line.totalStandardPrice,
          commissionPercent: line.commissionPercent,
          commissionAmount: line.commissionAmount,
          vendorPayable: line.vendorPayable,
          payoutStatus: 'PENDING',
        };
        setVendorLedgers(prev => [ledgerLine, ...prev]);

        // Update vendor pending balance
        setVendors(prev =>
          prev.map(v =>
            v.id === line.vendorId
              ? {
                  ...v,
                  totalSalesValue: v.totalSalesValue + line.totalStandardPrice,
                  totalCommissionPaid: v.totalCommissionPaid + line.commissionAmount,
                  pendingPayable: v.pendingPayable + line.vendorPayable,
                }
              : v
          )
        );
      }
    });

    // Write wallet log
    const successLog: WalletLog = {
      id: `wlog-${Date.now()}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      paymentId: activePaymentRequest.paymentId,
      probashiTxnId,
      memberId: member.shareholderId,
      amount: activePaymentRequest.walletAmount,
      status: 'SUCCESS',
      cashier: currentUser.fullName,
      outlet: activeOutlet.name,
      timestamp: newOrder.createdAt,
      device: 'POS-Terminal-01',
    };
    setWalletLogs(prev => [successLog, ...prev]);

    // Update active shift sales
    setActiveShift(prev => ({
      ...prev,
      walletSalesTotal: prev.walletSalesTotal + activePaymentRequest.walletAmount,
      totalSales: prev.totalSales + activePaymentRequest.walletAmount,
      billCount: prev.billCount + 1,
    }));

    // Update request status
    setActivePaymentRequest(prev => (prev ? { ...prev, status: 'PAID' } : null));

    // Clear cart and show thermal receipt modal
    setCart([]);
    setIdentifiedMember(null);
    setReceiptModalOrder(newOrder);

    logAudit(
      'POS_ORDER_PAID_WALLET',
      'ORDER',
      newOrder.id,
      `Order ${newOrder.orderNumber} successfully paid via ProbashiHNR. Txn ID: ${probashiTxnId}, Amount: ${activePaymentRequest.walletAmount} BDT.`
    );

    return { success: true, message: `Payment of Tk ${activePaymentRequest.walletAmount.toLocaleString()} successful! Probashi Txn: ${probashiTxnId}` };
  };

  // Complete Standard Payment (Cash, Card, bKash)
  const completeStandardPayment = (method: 'CASH' | 'CARD' | 'BKASH', paidAmount: number): Order => {
    const { standardTotal, discountAmount, walletTotal } = calculateCartSummary();
    const isShareholder = !!identifiedMember;
    // If shareholder is verified at POS, discount applies to standard payment too per Part 3
    const finalAmount = isShareholder ? walletTotal : standardTotal;
    const finalDiscount = isShareholder ? discountAmount : 0;

    const orderNumber = `PB-ORD-${Date.now().toString().slice(-8)}`;

    const orderItems: OrderItem[] = cart.map(item => {
      const unitStd = item.product.standardPrice;
      const totalStd = unitStd * item.quantity;
      const lineDiscount = isShareholder
        ? Number(((totalStd * discountPercent) / 100).toFixed(2))
        : 0;

      let commPct = 0;
      let commAmt = 0;
      let companyNet = 0;
      let vendorPayable = 0;

      if (item.product.ownerType === 'Vendor') {
        const cat = categories.find(c => c.id === item.product.categoryId);
        commPct = cat ? cat.commissionPercent : 10;
        commAmt = Number(((totalStd * commPct) / 100).toFixed(2));
        companyNet = Number((commAmt - lineDiscount).toFixed(2));
        vendorPayable = Number((totalStd - commAmt).toFixed(2));
      } else {
        commPct = 0;
        commAmt = 0;
        companyNet = totalStd - lineDiscount;
        vendorPayable = 0;
      }

      return {
        productId: item.product.id,
        productName: item.product.name,
        barcode: item.product.barcode,
        unit: item.product.unit,
        ownerType: item.product.ownerType,
        vendorId: item.product.vendorId,
        vendorName: item.product.vendorName,
        quantity: item.quantity,
        unitStandardPrice: unitStd,
        unitWalletPrice: Number((unitStd * 0.95).toFixed(2)),
        totalStandardPrice: totalStd,
        totalWalletPrice: totalStd - lineDiscount,
        commissionPercent: commPct,
        commissionAmount: commAmt,
        discountAmount: lineDiscount,
        companyNet,
        vendorPayable,
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      channel: 'POS',
      outletId: activeOutlet.id,
      outletName: activeOutlet.name,
      cashierId: currentUser.id,
      cashierName: currentUser.fullName,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      items: orderItems,
      standardTotal,
      discountAmount: finalDiscount,
      walletTotal: isShareholder ? walletTotal : standardTotal,
      finalPaidAmount: finalAmount,
      paymentMethod: method,
      paymentStatus: 'PAID',
      receiptNumber: `PB-REC-${Date.now().toString().slice(-6)}`,
      memberId: identifiedMember?.shareholderId,
      memberName: identifiedMember?.fullName,
      memberMobile: identifiedMember?.mobile,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Stock deduction
    setProducts(prev =>
      prev.map(p => {
        const cartMatch = cart.find(c => c.product.id === p.id);
        if (cartMatch) {
          const currentOutletStock = p.outletStock[activeOutlet.id] || 0;
          return {
            ...p,
            outletStock: {
              ...p.outletStock,
              [activeOutlet.id]: Math.max(0, currentOutletStock - cartMatch.quantity),
            },
          };
        }
        return p;
      })
    );

    // Vendor ledgers
    orderItems.forEach(line => {
      if (line.ownerType === 'Vendor' && line.vendorId) {
        const ledgerLine: VendorLedgerEntry = {
          id: `vled-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          vendorId: line.vendorId,
          vendorName: line.vendorName || 'Vendor',
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          date: newOrder.createdAt,
          type: 'SALE',
          standardPrice: line.totalStandardPrice,
          commissionPercent: line.commissionPercent,
          commissionAmount: line.commissionAmount,
          vendorPayable: line.vendorPayable,
          payoutStatus: 'PENDING',
        };
        setVendorLedgers(prev => [ledgerLine, ...prev]);

        setVendors(prev =>
          prev.map(v =>
            v.id === line.vendorId
              ? {
                  ...v,
                  totalSalesValue: v.totalSalesValue + line.totalStandardPrice,
                  totalCommissionPaid: v.totalCommissionPaid + line.commissionAmount,
                  pendingPayable: v.pendingPayable + line.vendorPayable,
                }
              : v
          )
        );
      }
    });

    // Update active shift stats
    setActiveShift(prev => {
      const isCash = method === 'CASH';
      const isCard = method === 'CARD';
      const isBkash = method === 'BKASH';
      return {
        ...prev,
        cashSalesTotal: isCash ? prev.cashSalesTotal + finalAmount : prev.cashSalesTotal,
        cardSalesTotal: isCard ? prev.cardSalesTotal + finalAmount : prev.cardSalesTotal,
        bKashSalesTotal: isBkash ? prev.bKashSalesTotal + finalAmount : prev.bKashSalesTotal,
        totalSales: prev.totalSales + finalAmount,
        expectedCashInDrawer: isCash ? prev.expectedCashInDrawer + finalAmount : prev.expectedCashInDrawer,
        billCount: prev.billCount + 1,
      };
    });

    // Clear cart and display receipt
    setCart([]);
    setIdentifiedMember(null);
    setReceiptModalOrder(newOrder);

    logAudit(
      `POS_ORDER_PAID_${method}`,
      'ORDER',
      newOrder.id,
      `Order ${newOrder.orderNumber} paid via ${method} for Tk ${finalAmount}. Cashier: ${currentUser.fullName}`
    );

    return newOrder;
  };

  // Refund Order (POS Returns & Exchanges)
  const refundOrder = (orderId: string, reason: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.paymentStatus === 'REFUNDED') return false;

    // If order was paid via Wallet, refund through Probashi reversal API
    if (order.paymentMethod === 'WALLET' && order.memberId) {
      setShareholders(prev =>
        prev.map(s =>
          s.shareholderId === order.memberId
            ? {
                ...s,
                currentBalance: Number((s.currentBalance + order.finalPaidAmount).toFixed(2)),
                totalPureBazarSpend: Math.max(0, s.totalPureBazarSpend - order.finalPaidAmount),
                totalDiscountSaved: Math.max(0, s.totalDiscountSaved - order.discountAmount),
              }
            : s
        )
      );

      const refundLog: WalletLog = {
        id: `wlog-${Date.now()}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentId: order.walletPaymentId || 'pid_ref',
        probashiTxnId: `REV-${order.probashiTxnId || 'PBN'}`,
        memberId: order.memberId,
        amount: order.finalPaidAmount,
        status: 'REFUNDED',
        reason: `CUSTOMER_RETURN: ${reason}`,
        cashier: currentUser.fullName,
        outlet: order.outletName,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        device: 'POS-Terminal-01',
      };
      setWalletLogs(prev => [refundLog, ...prev]);
    }

    // Restore stock
    setProducts(prev =>
      prev.map(p => {
        const itemMatch = order.items.find(i => i.productId === p.id);
        if (itemMatch) {
          const currentOutletStock = p.outletStock[order.outletId] || 0;
          return {
            ...p,
            outletStock: {
              ...p.outletStock,
              [order.outletId]: currentOutletStock + itemMatch.quantity,
            },
          };
        }
        return p;
      })
    );

    // Reverse vendor ledgers
    order.items.forEach(line => {
      if (line.ownerType === 'Vendor' && line.vendorId) {
        const revLedger: VendorLedgerEntry = {
          id: `vled-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          vendorId: line.vendorId,
          vendorName: line.vendorName || 'Vendor',
          orderId: order.id,
          orderNumber: order.orderNumber,
          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          type: 'RETURN',
          standardPrice: -line.totalStandardPrice,
          commissionPercent: line.commissionPercent,
          commissionAmount: -line.commissionAmount,
          vendorPayable: -line.vendorPayable,
          payoutStatus: 'PAID', // reversed
        };
        setVendorLedgers(prev => [revLedger, ...prev]);

        setVendors(prev =>
          prev.map(v =>
            v.id === line.vendorId
              ? {
                  ...v,
                  totalSalesValue: Math.max(0, v.totalSalesValue - line.totalStandardPrice),
                  totalCommissionPaid: Math.max(0, v.totalCommissionPaid - line.commissionAmount),
                  pendingPayable: Math.max(0, v.pendingPayable - line.vendorPayable),
                }
              : v
          )
        );
      }
    });

    // Mark order refunded
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, paymentStatus: 'REFUNDED' } : o))
    );

    logAudit(
      'ORDER_REFUNDED',
      'ORDER',
      order.id,
      `Order ${order.orderNumber} refunded. Amount: Tk ${order.finalPaidAmount}. Reason: ${reason}`
    );

    return true;
  };

  // Product actions
  const addProduct = (p: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setProducts(prev => [newProd, ...prev]);
    logAudit('PRODUCT_CREATED', 'STOCK', newProd.id, `Created product ${newProd.name} (${newProd.barcode})`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    logAudit('PRODUCT_UPDATED', 'STOCK', id, `Updated product fields for product ID ${id}`);
  };

  const addCategory = (name: string, commissionPercent: number, description?: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      commissionPercent,
      productCount: 0,
      description,
    };
    setCategories(prev => [...prev, newCat]);
    logAudit('CATEGORY_CREATED', 'SETTING', newCat.id, `Created category ${name} with ${commissionPercent}% commission.`);
  };

  const updateCategoryCommission = (id: string, commissionPercent: number) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, commissionPercent } : c))
    );
    logAudit('CATEGORY_COMMISSION_UPDATED', 'SETTING', id, `Updated category ${id} commission to ${commissionPercent}%.`);
  };

  // GRN Actions
  const createGRN = (data: Omit<GoodsReceiveNote, 'id' | 'grnNumber'>) => {
    const newGrn: GoodsReceiveNote = {
      ...data,
      id: `grn-${Date.now()}`,
      grnNumber: `GRN-${new Date().toISOString().substring(0, 7)}-00${grns.length + 1}`,
    };
    setGrns(prev => [newGrn, ...prev]);
    logAudit('GRN_CREATED', 'GRN', newGrn.id, `Created GRN ${newGrn.grnNumber} for vendor ${newGrn.vendorName || 'Company'}`);
  };

  const approveGRN = (grnId: string) => {
    const grn = grns.find(g => g.id === grnId);
    if (!grn || grn.status === 'Approved') return;

    // Increment central warehouse stock of existing products (no duplicate barcodes)
    setProducts(prev =>
      prev.map(prod => {
        const itemMatch = grn.items.find(item => item.productId === prod.id);
        if (itemMatch) {
          return {
            ...prod,
            centralStock: prod.centralStock + itemMatch.acceptedQty,
            costPrice: itemMatch.costPrice || prod.costPrice,
            standardPrice: itemMatch.salePrice || prod.standardPrice,
          };
        }
        return prod;
      })
    );

    // Record stock movement
    grn.items.forEach(item => {
      const movement: StockMovement = {
        id: `sm-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        productId: item.productId,
        productName: item.productName,
        barcode: item.barcode,
        type: 'GRN',
        referenceId: grn.grnNumber,
        location: 'Central Warehouse',
        quantityChange: item.acceptedQty,
        newBalance: item.currentStock + item.acceptedQty,
        reason: `GRN intake from ${grn.vendorName || 'Purchase'} (Challan: ${grn.challanNumber})`,
        performedBy: currentUser.fullName,
      };
      setStockMovements(prev => [movement, ...prev]);
    });

    setGrns(prev =>
      prev.map(g =>
        g.id === grnId
          ? {
              ...g,
              status: 'Approved',
              approvedBy: currentUser.fullName,
              approvedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : g
      )
    );

    logAudit('GRN_APPROVED', 'GRN', grn.id, `Approved GRN ${grn.grnNumber}. Central warehouse stock credited.`);
  };

  // Stock Transfer Actions
  const createTransfer = (data: Omit<OutletTransfer, 'id' | 'transferNumber'>) => {
    const newTr: OutletTransfer = {
      ...data,
      id: `tr-${Date.now()}`,
      transferNumber: `TR-${new Date().toISOString().substring(0, 7)}-00${transfers.length + 1}`,
    };
    setTransfers(prev => [newTr, ...prev]);
    logAudit('TRANSFER_REQUESTED', 'STOCK', newTr.id, `Stock transfer ${newTr.transferNumber} requested to ${newTr.toOutletName}`);
  };

  const dispatchTransfer = (transferId: string) => {
    const tr = transfers.find(t => t.id === transferId);
    if (!tr || tr.status !== 'Requested') return;

    // Deduct central warehouse stock
    setProducts(prev =>
      prev.map(prod => {
        const itemMatch = tr.items.find(item => item.productId === prod.id);
        if (itemMatch) {
          return {
            ...prod,
            centralStock: Math.max(0, prod.centralStock - itemMatch.dispatchedQty),
          };
        }
        return prod;
      })
    );

    setTransfers(prev =>
      prev.map(t =>
        t.id === transferId
          ? {
              ...t,
              status: 'Dispatched',
              dispatchDate: new Date().toISOString().substring(0, 10),
              dispatchedBy: currentUser.fullName,
            }
          : t
      )
    );

    logAudit('TRANSFER_DISPATCHED', 'STOCK', tr.id, `Dispatched transfer ${tr.transferNumber} from Central Warehouse.`);
  };

  const receiveTransfer = (transferId: string) => {
    const tr = transfers.find(t => t.id === transferId);
    if (!tr || tr.status !== 'Dispatched') return;

    // Credit outlet stock
    setProducts(prev =>
      prev.map(prod => {
        const itemMatch = tr.items.find(item => item.productId === prod.id);
        if (itemMatch) {
          const currentOutletStock = prod.outletStock[tr.toOutletId] || 0;
          return {
            ...prod,
            outletStock: {
              ...prod.outletStock,
              [tr.toOutletId]: currentOutletStock + itemMatch.receivedQty,
            },
          };
        }
        return prod;
      })
    );

    setTransfers(prev =>
      prev.map(t =>
        t.id === transferId
          ? {
              ...t,
              status: 'Received',
              receiveDate: new Date().toISOString().substring(0, 10),
              receivedBy: currentUser.fullName,
            }
          : t
      )
    );

    logAudit('TRANSFER_RECEIVED', 'STOCK', tr.id, `Received transfer ${tr.transferNumber} at ${tr.toOutletName}.`);
  };

  // Stock Adjustment
  const createAdjustment = (adjData: Omit<StockAdjustment, 'id' | 'adjNumber' | 'date'>) => {
    const adjNumber = `ADJ-${new Date().toISOString().substring(0, 7)}-00${adjustments.length + 1}`;
    const requiresSuperAdminApproval = Math.abs(adjData.costImpact) > settings.superAdminAdjustmentLimit;

    const newAdj: StockAdjustment = {
      ...adjData,
      id: `adj-${Date.now()}`,
      adjNumber,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      requiresSuperAdminApproval,
      status: requiresSuperAdminApproval && currentUser.role !== 'Super Admin' ? 'Pending Approval' : 'Approved',
      approvedBy: requiresSuperAdminApproval && currentUser.role !== 'Super Admin' ? undefined : currentUser.fullName,
    };

    setAdjustments(prev => [newAdj, ...prev]);

    // If auto-approved (e.g. within threshold or created by Super Admin)
    if (newAdj.status === 'Approved') {
      applyAdjustmentStockUpdate(newAdj);
    }

    logAudit('STOCK_ADJUSTMENT_CREATED', 'STOCK', newAdj.id, `Stock adjustment ${adjNumber} created for ${adjData.productName} (${adjData.quantityChange} units). Reason: ${adjData.reason}`);
  };

  const applyAdjustmentStockUpdate = (adj: StockAdjustment) => {
    setProducts(prev =>
      prev.map(prod => {
        if (prod.id === adj.productId) {
          if (adj.location === 'Central Warehouse') {
            return {
              ...prod,
              centralStock: Math.max(0, prod.centralStock + adj.quantityChange),
            };
          } else {
            const current = prod.outletStock[adj.location] || 0;
            return {
              ...prod,
              outletStock: {
                ...prod.outletStock,
                [adj.location]: Math.max(0, current + adj.quantityChange),
              },
            };
          }
        }
        return prod;
      })
    );

    const movement: StockMovement = {
      id: `sm-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      productId: adj.productId,
      productName: adj.productName,
      barcode: adj.barcode,
      type: 'ADJUSTMENT',
      referenceId: adj.adjNumber,
      location: adj.location,
      quantityChange: adj.quantityChange,
      newBalance: 0,
      reason: `${adj.reason}: ${adj.notes}`,
      performedBy: currentUser.fullName,
    };
    setStockMovements(prev => [movement, ...prev]);
  };

  const approveAdjustment = (adjId: string) => {
    const adj = adjustments.find(a => a.id === adjId);
    if (!adj || adj.status === 'Approved') return;

    applyAdjustmentStockUpdate(adj);
    setAdjustments(prev =>
      prev.map(a =>
        a.id === adjId
          ? { ...a, status: 'Approved', approvedBy: currentUser.fullName }
          : a
      )
    );

    logAudit('STOCK_ADJUSTMENT_APPROVED', 'STOCK', adj.id, `Super admin approved adjustment ${adj.adjNumber}`);
  };

  // Vendor Register Form A with Probashi Member Verify API
  const registerVendor = (
    vendorData: Omit<Vendor, 'id' | 'registeredDate' | 'registeredBy' | 'totalSalesValue' | 'totalCommissionPaid' | 'pendingPayable'>
  ): { success: boolean; message: string } => {
    // API verification check: shareholder must exist in ProbashiHNR database
    const member = shareholders.find(
      s => s.shareholderId === vendorData.shareholderId || s.mobile === vendorData.mobile
    );

    if (!member) {
      return {
        success: false,
        message: `Probashi Member Verify API Failed: Shareholder ID ${vendorData.shareholderId} or mobile ${vendorData.mobile} does not exist in ProbashiHNR database.`,
      };
    }

    if (!member.walletEnabled || member.status !== 'Active') {
      return {
        success: false,
        message: `Probashi Member Verify API Failed: Shareholder ${member.fullName} (${member.shareholderId}) wallet is inactive or suspended.`,
      };
    }

    const newVendor: Vendor = {
      ...vendorData,
      id: `ven-${Date.now()}`,
      registeredDate: new Date().toISOString().substring(0, 10),
      registeredBy: `${currentUser.fullName} (${currentUser.role})`,
      totalSalesValue: 0,
      totalCommissionPaid: 0,
      pendingPayable: 0,
    };

    setVendors(prev => [newVendor, ...prev]);
    logAudit('VENDOR_REGISTERED', 'ROLE', newVendor.id, `Registered vendor ${newVendor.shopName} (Shareholder: ${newVendor.shareholderId})`);

    return {
      success: true,
      message: `Vendor ${newVendor.shopName} successfully registered and verified with Probashi account!`,
    };
  };

  // Monthly Statement & Payout
  const generateMonthlyStatement = (vendorId: string, month: string): VendorMonthlyStatement => {
    const vendor = vendors.find(v => v.id === vendorId);
    const vendorLedgersForMonth = vendorLedgers.filter(
      vl => vl.vendorId === vendorId && vl.date.startsWith(month)
    );

    let grossSales = 0;
    let commTotal = 0;
    let netPayable = 0;

    vendorLedgersForMonth.forEach(vl => {
      grossSales += vl.standardPrice;
      commTotal += vl.commissionAmount;
      netPayable += vl.vendorPayable;
    });

    const stmtNumber = `PB-STMT-${month}-00${monthlyStatements.length + 1}`;
    const newStmt: VendorMonthlyStatement = {
      id: `stmt-${Date.now()}`,
      statementNumber: stmtNumber,
      vendorId,
      vendorName: vendor ? vendor.shopName : 'Vendor',
      month,
      openingStockValue: 50000,
      receivedStockValue: 80000,
      soldStockValue: grossSales,
      returnedStockValue: 0,
      closingStockValue: 50000 + 80000 - grossSales,
      grossSalesValue: grossSales,
      commissionPercent: vendor ? vendor.commissionAgreementPercent : 10,
      commissionTotal: commTotal,
      netPayable: Math.max(0, netPayable),
      status: 'Draft',
      createdDate: new Date().toISOString().substring(0, 10),
    };

    setMonthlyStatements(prev => [newStmt, ...prev]);
    logAudit('STATEMENT_GENERATED', 'EXPENSE', newStmt.id, `Generated monthly statement ${stmtNumber} for ${newStmt.vendorName}`);
    return newStmt;
  };

  const approveMonthlyStatement = (statementId: string) => {
    setMonthlyStatements(prev =>
      prev.map(s => (s.id === statementId ? { ...s, status: 'Approved' } : s))
    );
    logAudit('STATEMENT_APPROVED', 'EXPENSE', statementId, `Approved statement ${statementId}`);
  };

  const executeVendorPayout = (statementId: string): { success: boolean; txnId: string } => {
    const stmt = monthlyStatements.find(s => s.id === statementId);
    if (!stmt) return { success: false, txnId: '' };

    const vendor = vendors.find(v => v.id === stmt.vendorId);
    const txnId = `TXN-PAYOUT-PBN-${Math.floor(100000 + Math.random() * 900000)}`;

    const payoutRecord: VendorPayout = {
      id: `po-${Date.now()}`,
      payoutBatchNumber: `PB-PAYOUT-${stmt.month}-B${payouts.length + 1}`,
      vendorId: stmt.vendorId,
      vendorName: stmt.vendorName,
      probashiWalletNumber: vendor ? vendor.payoutWalletNumber : 'N/A',
      statementNumber: stmt.statementNumber,
      amount: stmt.netPayable,
      status: 'SUCCESS',
      probashiTxnId: txnId,
      processedBy: currentUser.fullName,
      processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setPayouts(prev => [payoutRecord, ...prev]);

    // Update statement
    setMonthlyStatements(prev =>
      prev.map(s =>
        s.id === statementId
          ? {
              ...s,
              status: 'Paid',
              probashiTxnId: txnId,
              payoutDate: payoutRecord.processedAt,
            }
          : s
      )
    );

    // Deduct vendor pending payable
    if (vendor) {
      setVendors(prev =>
        prev.map(v =>
          v.id === vendor.id
            ? { ...v, pendingPayable: Math.max(0, v.pendingPayable - stmt.netPayable) }
            : v
        )
      );
    }

    logAudit(
      'VENDOR_PAYOUT_EXECUTED',
      'PAYOUT',
      stmt.id,
      `Executed Probashi wallet payout of Tk ${stmt.netPayable} for statement ${stmt.statementNumber}. Txn: ${txnId}`
    );

    return { success: true, txnId };
  };

  // Expenses & Payroll
  const addExpense = (expData: Omit<Expense, 'id' | 'expenseNumber'>) => {
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
      expenseNumber: `EXP-${new Date().toISOString().substring(0, 7)}-00${expenses.length + 1}`,
    };
    setExpenses(prev => [newExp, ...prev]);
    logAudit('EXPENSE_RECORDED', 'EXPENSE', newExp.id, `Recorded expense of Tk ${newExp.amount} (${newExp.category})`);
  };

  const createSalarySheet = (month: string, location: string): SalarySheet => {
    const locEmployees = employees.filter(e => location === 'All' || e.location === location);
    let grossTotal = 0;
    let allowancesTotal = 0;
    locEmployees.forEach(e => {
      grossTotal += e.basicSalary;
      allowancesTotal += e.houseAllowance + e.medicalAllowance + e.transportAllowance;
    });

    const netSalaryTotal = grossTotal + allowancesTotal;
    const sheetNum = `SAL-${month}-${locEmployees.length}EMP`;

    const newSheet: SalarySheet = {
      id: `ss-${Date.now()}`,
      sheetNumber: sheetNum,
      month,
      location,
      employeeCount: locEmployees.length,
      grossSalaryTotal: grossTotal,
      allowancesTotal,
      bonusTotal: 0,
      advancesAndDeductionsTotal: 0,
      netSalaryTotal,
      status: 'Draft',
      createdDate: new Date().toISOString().substring(0, 10),
    };

    setSalarySheets(prev => [newSheet, ...prev]);
    logAudit('SALARY_SHEET_CREATED', 'EXPENSE', newSheet.id, `Created monthly salary sheet ${sheetNum}`);
    return newSheet;
  };

  const approveSalarySheet = (sheetId: string) => {
    setSalarySheets(prev =>
      prev.map(s => (s.id === sheetId ? { ...s, status: 'Approved' } : s))
    );
    logAudit('SALARY_SHEET_APPROVED', 'EXPENSE', sheetId, `Approved salary sheet ${sheetId}`);
  };

  const paySalarySheet = (sheetId: string) => {
    const sheet = salarySheets.find(s => s.id === sheetId);
    if (!sheet || sheet.status === 'Paid') return;

    // Automatic posting to Expenses per Part 2 & Part 6
    const expId = `exp-sal-${Date.now()}`;
    const autoExpense: Expense = {
      id: expId,
      expenseNumber: `EXP-${sheet.month}-SAL`,
      category: 'Salary',
      amount: sheet.netSalaryTotal,
      date: new Date().toISOString().substring(0, 10),
      location: sheet.location,
      paymentMethod: 'Bank',
      vendorOrPayee: `PureBazar Staff Payroll (${sheet.employeeCount} Staff)`,
      description: `Disbursed ${sheet.month} Salary Sheet ${sheet.sheetNumber}`,
      recordedBy: `${currentUser.fullName} (HR/Payroll)`,
      autoGeneratedFromPayroll: true,
    };

    setExpenses(prev => [autoExpense, ...prev]);

    setSalarySheets(prev =>
      prev.map(s =>
        s.id === sheetId
          ? {
              ...s,
              status: 'Paid',
              paidDate: new Date().toISOString().substring(0, 10),
              expenseId: expId,
            }
          : s
      )
    );

    logAudit(
      'SALARY_SHEET_PAID',
      'EXPENSE',
      sheet.id,
      `Paid salary sheet ${sheet.sheetNumber} (Tk ${sheet.netSalaryTotal}). Auto-posted to Expenses.`
    );
  };

  const addSalaryAdvance = (advData: Omit<SalaryAdvance, 'id' | 'date' | 'status'>) => {
    const newAdv: SalaryAdvance = {
      ...advData,
      id: `sa-${Date.now()}`,
      status: 'Approved',
      date: new Date().toISOString().substring(0, 10),
    };
    setSalaryAdvances(prev => [newAdv, ...prev]);
    logAudit('SALARY_ADVANCE_RECORDED', 'EXPENSE', newAdv.id, `Recorded ${newAdv.type} of Tk ${newAdv.amount} for ${newAdv.employeeName}`);
  };

  // Shift Day Close
  const closeActiveShift = (actualCountedCash: number, notes?: string) => {
    const variance = actualCountedCash - activeShift.expectedCashInDrawer;
    setActiveShift(prev => ({
      ...prev,
      status: 'CLOSED',
      endTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      closingCashActual: actualCountedCash,
      cashVariance: variance,
      notes,
    }));

    logAudit(
      'SHIFT_CLOSED',
      'ORDER',
      activeShift.id,
      `Closed shift ${activeShift.id}. Counted cash: Tk ${actualCountedCash}, Expected: Tk ${activeShift.expectedCashInDrawer}, Variance: Tk ${variance}.`
    );
  };

  const openNewShift = (openingCash: number) => {
    const newShift: CashierShift = {
      id: `shift-${Date.now()}`,
      outletId: activeOutlet.id,
      outletName: activeOutlet.name,
      cashierId: currentUser.id,
      cashierName: currentUser.fullName,
      startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'OPEN',
      openingCash,
      cashSalesTotal: 0,
      walletSalesTotal: 0,
      cardSalesTotal: 0,
      bKashSalesTotal: 0,
      totalSales: 0,
      expectedCashInDrawer: openingCash,
      billCount: 0,
    };
    setActiveShift(newShift);
    logAudit('SHIFT_OPENED', 'ORDER', newShift.id, `Opened new shift with Tk ${openingCash} opening cash.`);
  };

  // Settings
  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAudit('SETTINGS_UPDATED', 'SETTING', 'SYS', 'System settings updated.');
  };

  return (
    <AppContext.Provider
      value={{
        activeNav,
        setActiveNav,
        isDarkMode,
        toggleDarkMode,
        activeOutlet,
        setActiveOutlet,
        currentUser,
        setCurrentUser,
        allStaff,
        products,
        categories,
        vendors,
        shareholders,
        grns,
        transfers,
        adjustments,
        orders,
        walletLogs,
        activeShift,
        vendorLedgers,
        monthlyStatements,
        payouts,
        employees,
        expenses,
        salarySheets,
        salaryAdvances,
        settings,
        auditLogs,
        stockMovements,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        identifiedMember,
        setIdentifiedMember,
        verifyShareholder,
        activePaymentRequest,
        startWalletPayment,
        cancelWalletPayment,
        approveWalletPaymentFromCustomerPhone,
        completeStandardPayment,
        refundOrder,
        isCustomerPhoneModalOpen,
        setIsCustomerPhoneModalOpen,
        customerPhoneSimulatorMember,
        setCustomerPhoneSimulatorMember,
        receiptModalOrder,
        setReceiptModalOrder,
        addProduct,
        updateProduct,
        addCategory,
        updateCategoryCommission,
        createGRN,
        approveGRN,
        createTransfer,
        dispatchTransfer,
        receiveTransfer,
        createAdjustment,
        approveAdjustment,
        registerVendor,
        generateMonthlyStatement,
        approveMonthlyStatement,
        executeVendorPayout,
        addExpense,
        createSalarySheet,
        approveSalarySheet,
        paySalarySheet,
        addSalaryAdvance,
        updateSettings,
        closeActiveShift,
        openNewShift,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
