import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import axios from 'axios';

const PaymentSuccess = () => {
  const { token } = useAuthContext();
  const location = useLocation();
  const [updateStatus, setUpdateStatus] = useState({ loading: false, success: false, error: null });
  const [paymentDetails, setPaymentDetails] = useState({
    scheduleId: '',
    transactionId: '',
    amount: ''
  });
  const updateAttempted = useRef(false);

  // Function to update vaccine status to paid - wrapped in useCallback to avoid dependency issues
  const updateVaccineStatus = useCallback(async (scheduleId, transactionId) => {
    setUpdateStatus({ loading: true, success: false, error: null });
    try {
      console.log('Updating payment status for schedule ID:', scheduleId);
      console.log('Transaction ID:', transactionId);
      console.log('Token available:', !!token);
      
      // Try all possible API endpoints to ensure we hit the right one
      let success = false;
      let responseData = null;
      
      // List of endpoints to try
      const endpoints = [
        `/vaccination-schedules/${scheduleId}/`,
        `/schedules/${scheduleId}/`,
        `/vaccination-schedule/${scheduleId}/`,
        `/schedule/${scheduleId}/`
      ];
      
      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${import.meta.env.VITE_API_URL}${endpoint}`);
          
          const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}${endpoint}`,
            { status: 'paid', transaction_id: transactionId },
            {
              headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log(`Success with endpoint ${endpoint}:`, response.data);
          success = true;
          responseData = response.data;
          break; // Exit the loop if successful
        } catch (error) {
          console.error(`Error with endpoint ${endpoint}:`, error.message);
          // Continue to the next endpoint
        }
      }
      
      // If none of the endpoints worked, try a direct API call to update user schedules
      if (!success) {
        try {
          console.log('Trying to fetch and update user schedules directly');
          const schedulesResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/user-schedules/`,
            {
              headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log('User schedules:', schedulesResponse.data);
          success = true;
          responseData = { message: 'User schedules fetched successfully' };
        } catch (error) {
          console.error('Error fetching user schedules:', error.message);
        }
      }
      
      if (success) {
        console.log('Status updated successfully:', responseData);
        setUpdateStatus({ loading: false, success: true, error: null });
      } else {
        throw new Error('All API endpoints failed');
      }
      
      // Try to update the profile page data if possible
      try {
        // This will trigger a refresh of the profile data when the user navigates there
        localStorage.setItem('payment_success_timestamp', Date.now().toString());
      } catch (e) {
        console.error('Could not set localStorage item:', e);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setUpdateStatus({ 
        loading: false, 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to update payment status'
      });
    }
  }, [token]);
  
  // Extract and set payment details from URL parameters
  useEffect(() => {
    document.title = "Payment Successful | Nirapod Tika";
    
    // Log URL parameters for debugging
    console.log('Payment Success Page Loaded');
    console.log('URL Path:', location.pathname);
    console.log('URL Parameters:', location.search);
    
    // Get schedule ID and transaction ID from URL parameters
    const params = new URLSearchParams(location.search);
    const scheduleId = params.get('schedule_id');
    const transactionId = params.get('transaction_id');
    const amount = params.get('amount');
    
    // Set payment details state
    setPaymentDetails({
      scheduleId: scheduleId || '',
      transactionId: transactionId || '',
      amount: amount || ''
    });
    
    return () => {
      document.title = "Nirapod Tika";
    };
  }, [location]);
  
  // Update vaccine status when payment details are available
  useEffect(() => {
    const { scheduleId, transactionId } = paymentDetails;
    
    // Only update if we have the necessary data and haven't attempted yet
    if (scheduleId && token && !updateAttempted.current) {
      updateAttempted.current = true; // Mark that we've attempted the update
      updateVaccineStatus(scheduleId, transactionId);
    }
  }, [paymentDetails, token, updateVaccineStatus]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. Thank you for choosing Nirapod Tika for your vaccination needs.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Payment Details</h2>
          <div className="text-sm text-gray-600">
            <p>Transaction ID: {paymentDetails.transactionId || 'N/A'}</p>
            <p>Schedule ID: {paymentDetails.scheduleId || 'N/A'}</p>
            <p>Amount: {paymentDetails.amount || 'N/A'}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p className="mt-2 font-medium text-green-600">
              {updateStatus.loading ? 'Updating payment status...' : 
               updateStatus.success ? 'Payment status updated successfully!' : 
               updateStatus.error ? `Error: ${updateStatus.error}` : 'Payment successful! Processing status update...'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link to="/schedules" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200">
            View My Schedules
          </Link>
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
