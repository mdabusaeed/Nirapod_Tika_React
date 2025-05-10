import React from 'react';

const PaymentInfoDebug = ({ schedule, showDebug }) => {
  if (!showDebug) return null;
  
  return (
    <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
      <div>Method: <span className="font-mono">{schedule.payment_method}</span></div>
      <div>Status: <span className="font-mono">{schedule.payment_status}</span></div>
      <div>Transaction: <span className="font-mono">{schedule.transaction_id || 'none'}</span></div>
      {/* Display if Pay button should show based on our logic */}
      <div className="mt-1 pt-1 border-t border-gray-300">
        Pay button visible: {" "}
        <span className={`font-medium ${
          (schedule.payment_method === 'online' || schedule.payment_method === 'Online') && 
          (schedule.payment_status !== 'paid' && schedule.payment_status !== 'completed') 
            ? 'text-green-600' : 'text-red-600'
        }`}>
          {(schedule.payment_method === 'online' || schedule.payment_method === 'Online') && 
           (schedule.payment_status !== 'paid' && schedule.payment_status !== 'completed') 
            ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  );
};

export default PaymentInfoDebug; 