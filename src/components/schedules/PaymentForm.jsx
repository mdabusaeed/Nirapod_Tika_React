import React from 'react';

const PaymentForm = ({
  paymentDetails,
  handlePaymentDetailsChange,
  handlePayment,
  paymentProcessing,
  paymentStatus
}) => {
  return (
    <div className="mb-4 p-4 border border-gray-200 rounded bg-gray-50">
      <h4 className="text-lg font-medium mb-3 text-gray-800">Payment Information</h4>
      
      {paymentStatus === 'completed' ? (
        <div className="p-3 bg-green-100 text-green-700 rounded mb-3">
          <p className="font-medium">Payment Completed Successfully!</p>
          <p className="text-sm mt-1">Your vaccination schedule has been confirmed.</p>
        </div>
      ) : (
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              name="card_number"
              value={paymentDetails.card_number}
              onChange={(e) => {
                // Allow only numbers and limit to 16 digits (plus spaces)
                const value = e.target.value.replace(/[^\d\s]/g, '');
                if (value.replace(/\s/g, '').length <= 16) {
                  handlePaymentDetailsChange({ target: { name: 'card_number', value } });
                }
              }}
              placeholder="1234 5678 9012 3456"
              className="w-full p-2 border rounded text-gray-800"
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiry_date"
                value={paymentDetails.expiry_date}
                onChange={(e) => {
                  // Format as MM/YY
                  const value = e.target.value.replace(/[^\d/]/g, '');
                  if (value.length <= 5) {
                    handlePaymentDetailsChange({ target: { name: 'expiry_date', value } });
                  }
                }}
                placeholder="MM/YY"
                className="w-full p-2 border rounded text-gray-800"
                required
              />
            </div>
            
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={(e) => {
                  // Allow only 3-4 digits
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    handlePaymentDetailsChange({ target: { name: 'cvv', value } });
                  }
                }}
                placeholder="123"
                className="w-full p-2 border rounded text-gray-800"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name on Card
            </label>
            <input
              type="text"
              name="name_on_card"
              value={paymentDetails.name_on_card}
              onChange={handlePaymentDetailsChange}
              placeholder="John Doe"
              className="w-full p-2 border rounded text-gray-800"
              required
            />
          </div>
          
          <button
            type="button"
            onClick={handlePayment}
            disabled={paymentProcessing || 
              !paymentDetails.card_number || 
              !paymentDetails.expiry_date || 
              !paymentDetails.cvv || 
              !paymentDetails.name_on_card}
            className={`w-full p-3 rounded text-white mt-3 ${
              paymentProcessing || !paymentDetails.card_number || !paymentDetails.expiry_date || 
              !paymentDetails.cvv || !paymentDetails.name_on_card
                ? 'bg-gray-400'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {paymentProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                Processing Payment...
              </div>
            ) : 'Complete Payment'}
          </button>
          
          {paymentStatus === 'failed' && (
            <div className="p-2 bg-red-100 text-red-700 rounded mt-2 text-sm">
              Payment processing failed. Please try again.
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default PaymentForm; 