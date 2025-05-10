import React from 'react';

const PaymentProcessing = ({ scheduleId }) => {
  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-amber-600 rounded-full mb-3"></div>
        <p className="text-lg font-medium text-amber-800">পেমেন্ট প্রসেসিং চলছে...</p>
        <p className="text-sm text-gray-700 mt-2">অনুগ্রহ করে অপেক্ষা করুন। পেমেন্ট প্রসেস হলে আপনাকে জানানো হবে।</p>
        <p className="text-xs text-gray-500 mt-4">আপনার স্কেডিউল আইডি: {scheduleId}</p>
      </div>
    </div>
  );
};

export default PaymentProcessing; 