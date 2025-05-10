import apiClient from './api-client';

// Function to delete a vaccination schedule by ID
export const deleteSchedule = async (id) => {
  if (!id) {
    throw new Error('Schedule ID is required');
  }
  
  try {
    // Get auth token from localStorage
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens?.access;
    
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    
    const response = await apiClient.delete(`vaccination-schedules/${id}/`, {
      headers: {
        'Authorization': `JWT ${token}`
      }
    });
    
    return response.data;
  } catch (err) {
    console.error('Error deleting schedule:', err);
    throw new Error(err.response?.data?.message || 'Failed to delete the schedule');
  }
};

// Function to initiate payment for a schedule
export const initiatePayment = (schedule) => {
  if (!schedule || !schedule.id) {
    throw new Error('Valid schedule information is required');
  }
  
  try {
    // Determine amount from schedule data or use default
    const amount = schedule.amount || schedule.price || 1000; // Default if not available
    
    // Create or use transaction ID
    const transactionId = schedule.transaction_id || `TIKA-PAY-${schedule.id}-${Date.now()}`;
    
    // Store payment info in localStorage for the payment page
    localStorage.setItem('pending_payment', JSON.stringify({
      scheduleId: schedule.id,
      amount: amount,
      transactionId: transactionId,
      timestamp: Date.now()
    }));
    
    // Redirect to payment page
    window.location.href = '/payment';
    
    return true;
  } catch (err) {
    console.error('Error initiating payment:', err);
    throw new Error('Failed to initiate payment process');
  }
};

// Get schedule status text with proper formatting
export const getStatusText = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Get payment method text
export const getPaymentMethodText = (method) => {
  switch (method) {
    case 'cash':
      return 'Cash on Delivery';
    case 'online':
      return 'Online Payment';
    case 'insurance':
      return 'Insurance';
    default:
      return method || 'Unknown';
  }
}; 