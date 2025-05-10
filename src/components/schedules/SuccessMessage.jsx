import React from 'react';
import { Link } from 'react-router-dom';

const SuccessMessage = ({
  scheduleId,
  paymentMethod,
  onScheduleAnother,
  loading
}) => {
  // Check if payment method is online
  const isOnlinePayment = paymentMethod === 'online';
  
  return (
    <div className="mb-6">
      <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
        <h3 className="font-bold text-lg mb-2">Vaccination Scheduled Successfully!</h3>
        
        {/* Show Schedule ID and Transaction ID for all payment methods */}
        <div className="mt-3 p-2 bg-white border border-gray-200 rounded text-gray-800">
          <p className="mb-1 text-sm">Schedule ID: <span className="font-mono font-medium">{scheduleId}</span></p>
          <p className="text-sm text-gray-700 mb-2">Please complete your payment to confirm your vaccination schedule.</p>
        </div>
        
        <div className="flex gap-3 mt-4">
          {isOnlinePayment ? (
            <button
              onClick={onScheduleAnother}
              className="flex-1 p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel Payment
            </button>
          ) : (
            <button
              onClick={onScheduleAnother}
              className="flex-1 p-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              Schedule Another
            </button>
          )}
          <Link
            to="/profile"
            className="flex-1 p-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage; 