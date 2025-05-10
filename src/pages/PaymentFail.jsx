import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';

const PaymentFail = () => {
  const { user } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    document.title = "Payment Failed | Nirapod Tika";
    
    // Log URL parameters for debugging
    console.log('Payment Fail Page Loaded');
    console.log('URL Path:', location.pathname);
    console.log('URL Parameters:', location.search);
    
    return () => {
      document.title = "Nirapod Tika";
    };
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but your payment could not be processed. Please try again or contact support if the issue persists.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Error Details</h2>
          <div className="text-sm text-gray-600">
            <p>Error Code: {new URLSearchParams(location.search).get('error_code') || 'N/A'}</p>
            <p>Message: {new URLSearchParams(location.search).get('message') || 'Payment processing error'}</p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link to="/schedules" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200">
            Try Again
          </Link>
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
