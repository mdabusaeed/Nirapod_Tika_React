import React from 'react';

const PaymentRetry = ({ scheduleId, onRetry }) => {
  return (
    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded">
      <div className="flex flex-col items-center justify-center">
        <div className="text-red-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-red-800">পেমেন্ট প্রসেসিং ব্যর্থ হয়েছে</p>
        <p className="text-sm text-gray-700 mt-2">আপনার পেমেন্ট প্রসেস করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।</p>
        <p className="text-xs text-gray-500 mt-1 mb-3">আপনার স্কেডিউল আইডি: {scheduleId}</p>
        
        <button
          onClick={onRetry}
          className="p-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          আবার পেমেন্ট চেষ্টা করুন
        </button>
      </div>
    </div>
  );
};

export default PaymentRetry; 