import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  QrCode,
  KeyRound,
  MessageSquare,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerPhoneSimulatorModal: React.FC = () => {
  const {
    isCustomerPhoneModalOpen,
    setIsCustomerPhoneModalOpen,
    activePaymentRequest,
    customerPhoneSimulatorMember,
    setCustomerPhoneSimulatorMember,
    shareholders,
    approveWalletPaymentFromCustomerPhone,
    cancelWalletPayment,
  } = useApp();

  const [activeTabWay, setActiveTabWay] = useState<'pending_card' | 'qr_scan' | 'pay_code' | 'sms'>('pending_card');
  const [typedPayCode, setTypedPayCode] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successTxn, setSuccessTxn] = useState<string | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(180);

  // Timer countdown
  useEffect(() => {
    if (!activePaymentRequest || activePaymentRequest.status !== 'PENDING') return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((activePaymentRequest.expiresAt - Date.now()) / 1000));
      setTimeLeftSec(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activePaymentRequest]);

  if (!isCustomerPhoneModalOpen) return null;

  const currentBalance = customerPhoneSimulatorMember.currentBalance;
  const isBalanceEnough = activePaymentRequest
    ? currentBalance >= activePaymentRequest.walletAmount
    : false;

  const handleApprove = () => {
    setErrorMessage('');
    if (!enteredPin) {
      setErrorMessage('Please enter your 4-digit Wallet PIN.');
      return;
    }

    const res = approveWalletPaymentFromCustomerPhone(enteredPin);
    if (res.success) {
      setSuccessTxn(res.message);
      setEnteredPin('');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handlePinKey = (num: string) => {
    if (enteredPin.length < 4) {
      setEnteredPin(prev => prev + num);
      setErrorMessage('');
    }
  };

  const handlePinBackspace = () => {
    setEnteredPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex h-[92vh] max-h-[820px] w-full max-w-sm flex-col overflow-hidden rounded-[36px] border-4 border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Phone Top Notch & Camera */}
        <div className="relative flex h-8 w-full items-center justify-between px-6 pt-2 bg-neutral-900 text-white text-[10px] select-none">
          <span>9:41</span>
          <div className="h-4 w-20 rounded-full bg-neutral-800" />
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="h-2 w-4 rounded-xs border border-white/60 p-0.2">
              <div className="h-full w-full bg-white" />
            </div>
          </div>
        </div>

        {/* Modal Close Button (on bezel) */}
        <button
          onClick={() => setIsCustomerPhoneModalOpen(false)}
          className="absolute right-3 top-3 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700"
          title="Close simulator"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Phone Screen App Container */}
        <div className="flex flex-1 flex-col overflow-y-auto bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
          {/* ProbashiHNR Header */}
          <div className="bg-emerald-700 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-200">
                  ProbashiHNR Member App
                </span>
                <h3 className="text-base font-bold leading-tight">Shareholder Wallet</h3>
              </div>
              <div className="flex items-center gap-1">
                <select
                  value={customerPhoneSimulatorMember.shareholderId}
                  onChange={e => {
                    const found = shareholders.find(s => s.shareholderId === e.target.value);
                    if (found) {
                      setCustomerPhoneSimulatorMember(found);
                      setErrorMessage('');
                    }
                  }}
                  className="rounded bg-emerald-800 px-1.5 py-1 text-[11px] font-semibold text-white focus:outline-none"
                  title="Switch shareholder member account"
                >
                  {shareholders.map(s => (
                    <option key={s.shareholderId} value={s.shareholderId}>
                      {s.fullName.split(' ')[0]} ({s.shareholderId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Balances Card */}
            <div className="mt-2.5 rounded-xl bg-emerald-800/80 p-2.5 backdrop-blur-xs text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-200">Current Balance (Bill Pay)</span>
                  <div className="text-lg font-extrabold tabular-nums tracking-tight">
                    Tk {customerPhoneSimulatorMember.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-300">
                    <Lock className="h-3 w-3" /> Gen. Bonus
                  </div>
                  <div className="text-xs font-semibold text-emerald-200/90 tabular-nums line-through opacity-80">
                    Tk {customerPhoneSimulatorMember.generationBonusBalance.toLocaleString()}
                  </div>
                  <span className="text-[9px] text-emerald-300">Protected / No POS debit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Switcher / Four Ways Navigation Tabs */}
          <div className="border-b border-neutral-200 bg-white px-2 py-1.5 text-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="text-[10px] font-semibold uppercase text-neutral-400 mb-1">
              Part 4: 4 Ways to Reach Payment
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px] font-medium text-center">
              <button
                onClick={() => setActiveTabWay('pending_card')}
                className={`py-1 rounded ${
                  activeTabWay === 'pending_card'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                1. Card
              </button>
              <button
                onClick={() => setActiveTabWay('qr_scan')}
                className={`py-1 rounded ${
                  activeTabWay === 'qr_scan'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                2. QR Scan
              </button>
              <button
                onClick={() => setActiveTabWay('pay_code')}
                className={`py-1 rounded ${
                  activeTabWay === 'pay_code'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                3. Pay Code
              </button>
              <button
                onClick={() => setActiveTabWay('sms')}
                className={`py-1 rounded ${
                  activeTabWay === 'sms'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                4. SMS Link
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-3.5 space-y-3">
            {/* If payment was just completed */}
            {successTxn ? (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950/40">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                <h4 className="mt-2 text-base font-bold text-emerald-900 dark:text-emerald-100">
                  Payment Successful!
                </h4>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                  {successTxn}
                </p>
                <div className="mt-3 text-[11px] text-neutral-500">
                  Your PureBazar bill receipt has been printed at the POS counter.
                </div>
                <button
                  onClick={() => {
                    setSuccessTxn(null);
                    setIsCustomerPhoneModalOpen(false);
                  }}
                  className="mt-4 w-full rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            ) : !activePaymentRequest || activePaymentRequest.status !== 'PENDING' ? (
              /* No pending request state */
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-center dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  No Active Bill Request
                </h4>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Ask the cashier at PureBazar POS to add items and tap "Probashi Wallet" to send a payment request.
                </p>
                <div className="mt-4 rounded-lg bg-neutral-50 p-2 text-left text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  <span className="font-semibold text-emerald-600">Quick Test:</span> Go to POS Billing Counter, scan or add any products, and click "Probashi Wallet".
                </div>
              </div>
            ) : (
              /* Active Payment Request Display */
              <div className="space-y-3">
                {/* 1. Pending Card Way */}
                {activeTabWay === 'pending_card' && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 dark:border-amber-800/50 dark:bg-amber-950/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-900 dark:text-amber-200">
                        {activePaymentRequest.outletName}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                        <Clock className="h-3 w-3" />
                        <span>{Math.floor(timeLeftSec / 60)}:{(timeLeftSec % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-xs text-neutral-500">Wallet Payable (5% off):</span>
                      <span className="text-xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
                        Tk {activePaymentRequest.walletAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 line-through text-right">
                      Standard: Tk {activePaymentRequest.standardAmount.toFixed(2)} (Saved Tk {activePaymentRequest.discountAmount.toFixed(2)})
                    </div>
                  </div>
                )}

                {/* 2. QR Scan Way */}
                {activeTabWay === 'qr_scan' && (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
                    <QrCode className="mx-auto h-16 w-16 text-emerald-600" />
                    <p className="mt-2 text-xs font-semibold">Simulating Camera Scan</p>
                    <p className="text-[11px] text-neutral-500">
                      Scanned link: probashihnr.com/p/{activePaymentRequest.paymentId.substring(0, 8)}...
                    </p>
                  </div>
                )}

                {/* 3. Pay Code Way */}
                {activeTabWay === 'pay_code' && (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-3 text-center dark:border-neutral-800 dark:bg-neutral-900">
                    <span className="text-xs text-neutral-500">POS Pay Code:</span>
                    <div className="my-1 text-2xl font-black tracking-widest text-emerald-600 tabular-nums">
                      {activePaymentRequest.payCode}
                    </div>
                    <span className="text-[10px] text-neutral-400">
                      Code matches current POS billing screen
                    </span>
                  </div>
                )}

                {/* 4. SMS Link Way */}
                {activeTabWay === 'sms' && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-200">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <MessageSquare className="h-3.5 w-3.5" /> SMS from ProbashiHNR:
                    </div>
                    <p className="text-[11px]">
                      "PureBazar requests Tk {activePaymentRequest.walletAmount}. Click probashihnr.com/p/{activePaymentRequest.paymentId.slice(0, 6)} to approve."
                    </p>
                  </div>
                )}

                {/* Balance Check Evaluation (Part 3 step 3) */}
                <div
                  className={`rounded-xl p-2.5 text-xs ${
                    isBalanceEnough
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/40'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold">
                    {isBalanceEnough ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                    )}
                    <span>
                      {isBalanceEnough
                        ? 'Balance Sufficient for Bill'
                        : 'Balance Not Enough! (Switch to Cash/Card at POS)'}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] opacity-80">
                    <span>Current Balance: Tk {currentBalance.toLocaleString()}</span>
                    <span>Required: Tk {activePaymentRequest.walletAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* PIN Entry Area */}
                {isBalanceEnough && (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Enter 4-Digit Wallet PIN
                      </span>
                      <span className="text-[10px] text-neutral-400">Default: 1234</span>
                    </div>

                    {/* PIN Dots */}
                    <div className="my-2.5 flex justify-center gap-3">
                      {[0, 1, 2, 3].map(index => (
                        <div
                          key={index}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg font-bold transition-all ${
                            enteredPin.length > index
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'border-neutral-300 bg-neutral-100 text-transparent dark:border-neutral-700 dark:bg-neutral-800'
                          }`}
                        >
                          {enteredPin.length > index ? '●' : ''}
                        </div>
                      ))}
                    </div>

                    {/* Numeric Keypad */}
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                        <button
                          key={num}
                          onClick={() => handlePinKey(num)}
                          className="h-10 rounded-lg bg-neutral-100 text-sm font-semibold hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 active:scale-95 transition-transform"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => setEnteredPin('1234')}
                        className="h-10 rounded-lg bg-neutral-100 text-[10px] font-semibold text-emerald-600 hover:bg-neutral-200 dark:bg-neutral-800"
                        title="Auto fill test PIN"
                      >
                        Fill 1234
                      </button>
                      <button
                        onClick={() => handlePinKey('0')}
                        className="h-10 rounded-lg bg-neutral-100 text-sm font-semibold hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 active:scale-95 transition-transform"
                      >
                        0
                      </button>
                      <button
                        onClick={handlePinBackspace}
                        className="h-10 rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        Del
                      </button>
                    </div>

                    {errorMessage && (
                      <div className="mt-2 text-center text-xs font-semibold text-rose-600 dark:text-rose-400">
                        {errorMessage}
                      </div>
                    )}

                    {/* Approve Button */}
                    <button
                      onClick={handleApprove}
                      disabled={enteredPin.length !== 4}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <span>Approve Tk {activePaymentRequest.walletAmount.toFixed(2)}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Cashier cancel button option */}
                <button
                  onClick={cancelWalletPayment}
                  className="w-full text-center text-xs font-medium text-neutral-400 hover:text-neutral-600 py-1"
                >
                  Cancel Payment Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
