'use client';

import { useState } from 'react';
import NavbarUser from '../../../../components/NavbarUser';
import Throbber from '../../../../components/projects/Throbber';
import DonationSuccess from '../../../../components/projects/DonationSuccess';;

export default function DonatePage() {
  const [amount, setAmount] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [status, setStatus] = useState('idle'); // idle | loading | success

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
    }, 3000); // simulate loading for 3 seconds
  };

  if (status === 'loading') return <Throbber />;
  if (status === 'success') return <DonationSuccess />;

  return (
    <div className="min-h-screen bg-[#f4f7fe] text-gray-800">
      <NavbarUser />

      {/* Back Button styled like in ProjectDetails page */}
      <div className="max-w-3xl mx-auto pt-20 px-4">
        <button className="text-blue-600 hover:underline text-sm">&larr; Back</button>
      </div>

      {/* Donation Section */}
      <div className="max-w-3xl mx-auto py-10 px-6 mt-4 bg-white shadow-md rounded-xl">
        <h1 className="text-3xl font-semibold mb-4">Your Donation</h1>

        {/* Amount Section */}
        <div className="py-6 border-b border-gray-200 space-y-4">
          <h3 className="text-sm font-medium">Enter Amount</h3>

          <div className="grid grid-cols-4 gap-2">
            {[1000, 2500, 5000, 10000].map((preset) => (
              <button
                key={preset}
                onClick={() => handleAmountChange(preset)}
                className={`text-sm py-2 rounded-md border ${
                  amount === preset ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                } hover:bg-blue-600 hover:text-white transition font-medium`}
              >
                ₱{preset}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-base font-medium">PHP</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-center font-semibold text-lg focus:outline-none"
            />
            <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">
              Cash Amount
            </button>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="py-6 border-b border-gray-200 space-y-4">
          <h3 className="text-sm font-medium">Select Payment Method</h3>
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

        {/* Bank Details Section */}
        <div className="py-6 border-b border-gray-200 space-y-2">
          <h3 className="text-sm font-medium mb-2">Bank Details</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Account Name</span>
              <span className="font-medium">ICS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Number</span>
              <span className="font-medium">**** **** **** 4321</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bank Name</span>
              <span className="font-medium">LANDBANK</span>
            </div>
          </div>
        </div>

        {/* Donation Summary */}
        <div className="py-6 border-b border-gray-200 flex justify-between items-center">
          <p className="text-sm font-medium">Your Donation</p>
          <p className="text-2xl font-bold">₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Donate Button */}
        <div className="mt-6">
          <button
            onClick={handleDonate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold transition"
          >
            Donate now
          </button>
        </div>
      </div>
    </div>
  );
}
