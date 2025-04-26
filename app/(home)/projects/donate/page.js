'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Throbber from '../../../components/projects/Throbber';
import DonationSuccess from '../../../components/projects/DonationSuccess';

export default function DonatePage() {
  const [amount, setAmount] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [status, setStatus] = useState('idle');
  const router = useRouter();

  const handleAmountChange = (newAmount) => {
    setAmount(Number(newAmount));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleDonate = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 3000);
  };

  if (status === 'loading') return <Throbber />;
  if (status === 'success') return <DonationSuccess />;

  return (
    <div className="min-h-screen bg-[#f4f7fe] text-astralightgray-800 px-4 py-20">
      {/* Back Button */}
      <div className="max-w-xl mx-auto mb-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-astralightgray-600 hover:text-[var(--color-astraprimary)] -600 transition"
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
                    ? 'bg-[var(--color-astraprimary)] -600 text-astrawhite border-[var(--color-astraprimary)] -600'
                    : 'bg-astrawhite text-astralightgray-700 border-astralightgray-300 hover:bg-[var(--color-astraprimary)] -50'
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
            <button className="text-sm bg-[var(--color-astraprimary)] 600 text-astrawhite px-4 py-2 rounded-md font-medium hover:bg-[var(--color-astraprimary)] -700 transition">
              Cash Amount
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="border-b border-astralightgray-200 pb-6 mb-6">
          <h3 className="text-sm font-medium mb-4">Select Payment Method</h3>
          <div className="flex items-center gap-6">
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
              Credit or debit
            </label>
          </div>
        </div>

        {/* Bank Details */}
        <div className="border-b border-astralightgray-200 pb-6 mb-6 text-sm">
          <h3 className="text-sm font-medium mb-4">Bank Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-astralightgray-500">Account Name</span>
              <span className="font-medium">ICS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-astralightgray-500">Account Number</span>
              <span className="font-medium">**** **** **** 4321</span>
            </div>
            <div className="flex justify-between">
              <span className="text-astralightgray-500">Bank Name</span>
              <span className="font-medium">LANDBANK</span>
            </div>
          </div>
        </div>

        {/* Summary + Button */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-medium">Your Donation</p>
          <p className="text-2xl font-bold">
            ₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <button
          onClick={handleDonate}
          className="w-full bg-[var(--color-astraprimary)] -600 hover:bg-[var(--color-astraprimary)] -700 text-astrawhite py-3 rounded-md text-sm font-semibold transition"
        >
          Donate now
        </button>
      </div>
    </div>
  );
}
