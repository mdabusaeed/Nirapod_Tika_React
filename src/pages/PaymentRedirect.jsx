import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// This component will handle all payment redirects and ensure proper URL formatting
const PaymentRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const search = location.search;
    
    console.log('PaymentRedirect: Current path:', path);
    console.log('PaymentRedirect: URL parameters:', search);
    
    // Determine if this is a success or failure path
    const isSuccessPath = path.includes('/payment/success');
    const isFailPath = path.includes('/payment/fail');
    
    if (isSuccessPath) {
      // Redirect to the success page with all parameters
      navigate(`/payment-success${search}`, { replace: true });
    } else if (isFailPath) {
      // Redirect to the fail page with all parameters
      navigate(`/payment-fail${search}`, { replace: true });
    } else {
      // If not a payment path, redirect to home
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to payment result page...</p>
      </div>
    </div>
  );
};

export default PaymentRedirect;
