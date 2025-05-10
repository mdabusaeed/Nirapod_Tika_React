import React from 'react';

const PaymentReminder = ({ showPaymentReminder, handlePayment, getFirstUnpaidSchedule }) => {
  if (!showPaymentReminder) return null;
  
  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 p-4 mb-6 rounded-md shadow-md animate-pulse">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-amber-800">You Have Pending Payments!</h3>
          <div className="mt-2 text-amber-700">
            <p>Complete your online payment to confirm your vaccination schedule. Click the 'Pay Now' button below.</p>
          </div>
          <div className="mt-3">
            <button
              onClick={() => handlePayment(getFirstUnpaidSchedule())}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReminder; 