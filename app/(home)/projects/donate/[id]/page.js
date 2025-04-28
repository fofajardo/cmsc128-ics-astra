'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Throbber from '../../../../components/projects/Throbber';
import DonationSuccess from '../../../../components/projects/DonationSuccess';

export default function DonatePage() {
  const [amount, setAmount] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [receipt, setReceipt] = useState(null);
  const [status, setStatus] = useState('idle');
  const router = useRouter();
  const [showError, setShowError] = useState(false);


  const handleAmountChange = (newAmount) => {
    setAmount(Number(newAmount));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setReceipt(null); // clear receipt if switching payment method
  };

  const handleDonate = () => {
    if (paymentMethod === 'paypal') {
      window.location.href = "https://www.paypal.com/signin";
      return;
    }

    if (paymentMethod === 'bank' && !receipt) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000)
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  if (status === 'loading') return <Throbber />;
  if (status === 'success') return <DonationSuccess />;

  return (
    <div className="min-h-screen bg-[#f4f7fe] text-astralightgray-800 px-4 py-20">
      {/* Alert  */}
      {showError && (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-astrawhite text-astrablack border border-astraprimary-300 px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in">
    <div className="flex items-center gap-2">
      <svg className="w-5 h-5 text-astraprimary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M12 3a9 9 0 11-6.219 15.219A9 9 0 0112 3z" />
      </svg>
      <span className="text-sm font-medium">Please upload a receipt before donating.</span>
    </div>
  </div>
)}
      {/* Back Button */}
      <div className="max-w-xl mx-auto mb-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-astralightgray-600 hover:text-[var(--color-astraprimary)] transition"
        >
          &larr; Back
        </button>
      </div>

      {/* Main Donation Card */}
      <div className="max-w-xl mx-auto bg-astrawhite shadow-md rounded-lg px-6 py-8">
        <h1 className="text-xl font-semibold mb-6">Your Donation</h1>

        {/* Amount Section */}
        <div className="border-b border-astralightgray-200 pb-6 mb-6">
          <h3 className="text-sm font-medium mb-4">Enter Amount</h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[1000, 2500, 5000, 10000].map((preset) => (
              <button
                key={preset}
                onClick={() => handleAmountChange(preset)}
                className={`text-sm py-2 rounded-md border font-medium transition ${
                  amount === preset
                    ? 'bg-[var(--color-astraprimary)] text-astrawhite border-[var(--color-astraprimary)]'
                    : 'bg-astrawhite text-astralightgray-700 border-astralightgray-300 hover:bg-[var(--color-astraprimary)] hover:text-astrawhite'
                }`}
              >
                ₱{preset}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-astralightgray-500">PHP</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-astralightgray-300 rounded-md text-center font-semibold text-lg focus:outline-none"
            />
            <button className="text-sm bg-[var(--color-astraprimary)] text-astrawhite px-4 py-2 rounded-md font-medium hover:bg-[var(--color-astraprimary)] transition">
              Cash Amount
            </button>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="border-b border-astralightgray-200 pb-6 mb-6">
          <h3 className="text-sm font-medium mb-4">Select Payment Method</h3>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={handlePaymentMethodChange}
              />
              <img src="/icons/paypal.svg" alt="PayPal" className="w-16 h-auto" />
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="payment"
                value="credit"
                checked={paymentMethod === 'credit'}
                onChange={handlePaymentMethodChange}
              />
              Credit/Debit Card
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={handlePaymentMethodChange}
              />
              Bank Transfer
            </label>
          </div>
        </div>

        {/* Conditional Payment Details */}
        {paymentMethod === 'credit' && (
          <div className="border-b border-astralightgray-200 pb-6 mb-6">
            <h3 className="text-sm font-medium mb-4">Enter Credit/Debit Card Details</h3>
            <input
              type="text"
              placeholder="Card Number"
              className="mb-2 w-full border border-astralightgray-300 rounded-md p-2 text-sm focus:outline-none"
            />
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                className="flex-1 border border-astralightgray-300 rounded-md p-2 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-20 border border-astralightgray-300 rounded-md p-2 text-sm focus:outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              className="w-full border border-astralightgray-300 rounded-md p-2 text-sm focus:outline-none"
            />
          </div>
        )}

        {paymentMethod === 'bank' && (
          <div className="border-b border-astralightgray-200 pb-6 mb-6">
            <h3 className="text-sm font-medium mb-4">Upload Bank Transfer Receipt</h3>
            <div className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-astragray rounded-lg cursor-pointer hover:border-[var(--color-astraprimary)] transition">
              {receipt ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-astrablack mb-2">{receipt.name}</p>
                  <button
                    onClick={() => setReceipt(null)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <label htmlFor="receipt-upload" className="flex flex-col items-center justify-center text-astradarkgray cursor-pointer">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 12l8-8 8 8M12 4v12" />
                    </svg>
                    <p className="text-sm">Click to upload receipt</p>
                    <p className="text-xs text-astradarkgray">(image or PDF)</p>
                  </label>
                  <input
                    id="receipt-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setReceipt(e.target.files[0])}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Summary + Donate Button */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-medium">Your Donation</p>
          <p className="text-2xl font-bold">
            ₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <button
          onClick={handleDonate}
          className="w-full bg-[var(--color-astraprimary)] hover:bg-[var(--color-astraprimary)] text-astrawhite py-3 rounded-md text-sm font-semibold transition"
        >
          Donate now
        </button>
      </div>
    </div>
  );
}
