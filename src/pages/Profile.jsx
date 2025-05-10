import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import authApiClient  from '../services/api-client';
// Import modularized components
import {
  ProfileHeader,
  PersonalInfo,
  PaymentReminder,
  SchedulesSection,
  
  // Import utility functions
  formatDate,
  formatDateTime,
  getOrderDate,
  getDeliveryDate,
  getVaccinePrice,
  hasUnpaidOnlinePayment,
  
  // Import services
  initiatePayment,
  checkForCompletedPayment,
  fetchUserSchedules as fetchSchedules,
  fetchVaccines as fetchVaccinesList,
  deleteSchedule as deleteUserSchedule
} from '../components/profile';

const Profile = () => {
  const { user, loading } = useAuthContext();
  const [schedules, setSchedules] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [showPaymentReminder, setShowPaymentReminder] = useState(false);

  useEffect(() => {
    // Only fetch schedules if user is logged in
    if (user) {
      getUserSchedules();
      getVaccines(); // Fetch vaccines to get price information
      
      // Check for completed payments
      checkPaymentStatus();
    }
  }, [user]);

  // Check if there are unpaid schedules and show reminder
  useEffect(() => {
    if (schedules.length > 0) {
      const hasUnpaid = schedules.some(hasUnpaidOnlinePayment);
      setShowPaymentReminder(hasUnpaid);
    } else {
      setShowPaymentReminder(false);
    }
  }, [schedules]);

  // Get the first unpaid schedule for payment
  const getFirstUnpaidSchedule = () => {
    return schedules.find(hasUnpaidOnlinePayment);
  };

  // Handle payment for a schedule
  const handlePayment = async (schedule) => {
    if (!schedule) return;
    
    try {
      // Get auth token from localStorage
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));
      const token = authTokens?.access;
      
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      // Calculate the correct amount based on the same logic used in the UI
      const vaccineId = schedule.vaccine?.id || schedule.vaccine;
      let amount = schedule.amount;
      
      // If amount not directly available in schedule, look it up from vaccines list
      if (!amount && vaccineId && vaccines.length > 0) {
        amount = getVaccinePriceFromId(vaccineId);
      }
      
      // If still not found, use default (this should rarely happen)
      if (!amount) amount = 1000;
      
      console.log(`Processing payment for schedule ID ${schedule.id} with amount: ${amount}`);
      
      const response = await authApiClient.post("/payment/", {
        amount: amount, 
        order_id: schedule.id, 
        numItems: 1
      }, {
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Payment response:', response);
      
      if (response.data.payment_url) {
        // If there's a payment URL in the response, redirect to it
        window.location.href = response.data.payment_url;
      } else {
        // Otherwise refresh schedules after successful payment
        getUserSchedules();
        setDeleteSuccess('Payment processed successfully!');
      }
    } catch (error) { 
      console.error('Payment error:', error);
      setError('Failed to process payment. Please try again later.');
    }
  };

  // Check if there's a completed payment from a redirect
  const checkPaymentStatus = () => {
    const paymentStatus = checkForCompletedPayment();
    
    if (paymentStatus.success) {
      setDeleteSuccess(paymentStatus.message);
      
      // Refresh schedules list to get updated payment status
      getUserSchedules();
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (deleteSuccess) {
      const timer = setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess]);

  // Delete a schedule
  const handleDeleteSchedule = async (id) => {
    try {
      setDeletingId(id);
      setError(null);
      
      // Call the delete schedule function
      const result = await deleteUserSchedule(id);
      
      if (result.success) {
        // Remove the deleted schedule from state
        setSchedules(prev => prev.filter(schedule => schedule.id !== id));
        setDeleteSuccess(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Failed to delete schedule:', err);
      setError(err.message || 'Failed to delete the schedule. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getUserSchedules = async () => {
    try {
      setLoadingSchedules(true);
      const result = await fetchSchedules();
      
      if (result.success) {
        setSchedules(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load your vaccination schedules.');
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Fetch all vaccines to get price information
  const getVaccines = async () => {
    try {
      const result = await fetchVaccinesList();
      
      if (result.success) {
        setVaccines(result.data);
      }
    } catch (err) {
      console.error('Error fetching vaccines:', err);
    }
  };

  // Get the price for a vaccine (using the vaccines list)
  const getVaccinePriceFromId = (vaccineId) => {
    return getVaccinePrice(vaccines, vaccineId);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        <p className="ml-2 text-gray-700">Loading your profile...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: '/profile', message: "You must be logged in to access your profile." }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Payment Reminder Alert */}
          {/* <PaymentReminder 
            showPaymentReminder={showPaymentReminder} 
            handlePayment={handlePayment} 
            getFirstUnpaidSchedule={getFirstUnpaidSchedule} 
          /> */}
        
          {/* Profile Header */}
          <ProfileHeader user={user} />

          {/* Personal Information */}
          <PersonalInfo user={user} formatDate={formatDate} />

          {/* Vaccination Schedules */}
          <SchedulesSection 
            schedules={schedules}
            error={error}
            deleteSuccess={deleteSuccess}
            loadingSchedules={loadingSchedules}
            showDebug={showDebug}
            setShowDebug={setShowDebug}
            getFirstUnpaidSchedule={getFirstUnpaidSchedule}
            handlePayment={handlePayment}
            fetchUserSchedules={getUserSchedules}
            formatDateTime={formatDateTime}
            formatDate={formatDate}
            getOrderDate={getOrderDate}
            getDeliveryDate={getDeliveryDate}
            getVaccinePrice={getVaccinePriceFromId}
            handleDeleteSchedule={handleDeleteSchedule}
            deletingId={deletingId}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile; 