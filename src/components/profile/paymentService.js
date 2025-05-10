// Handle payment for a schedule
export const initiatePayment = (schedule, vaccines) => {
  if (!schedule) return null;
  
  try {
    // Get the vaccine ID from the schedule
    const vaccineId = schedule.vaccine?.id || schedule.vaccine;
    
    // Find the price for this vaccine
    let amount = schedule.amount; // First try to use amount directly from schedule
    
    if (!amount && vaccineId && vaccines.length > 0) {
      // If not available directly, look it up from our vaccines list
      const vaccine = vaccines.find(v => v.id === Number(vaccineId));
      amount = vaccine?.price || null;
    }
    
    // If still not found, use default
    if (!amount) amount = 1000;
    
    console.log(`Processing payment for schedule ID ${schedule.id} for amount ${amount}`);
    
    // Store the current schedule ID for status update after return
    localStorage.setItem('pending_payment', JSON.stringify({
      scheduleId: schedule.id,
      amount: amount,
      transactionId: `TIKA-PROFILE-${schedule.id}-${Date.now()}`,
      timestamp: Date.now()
    }));
    
    // Return the payment URL and amount
    return {
      paymentUrl: `/payment?schedule_id=${schedule.id}`,
      amount
    };
  } catch (error) {
    console.error('Payment error:', error);
    throw new Error('Failed to process payment. Please try again later.');
  }
};

// Check if there's a completed payment from a redirect
export const checkForCompletedPayment = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentSuccess = urlParams.get('payment_success');
  const scheduleId = urlParams.get('schedule_id');
  
  if (paymentSuccess === 'true' && scheduleId) {
    // Clean URL after reading parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return {
      success: true,
      scheduleId,
      message: `Payment completed successfully for schedule #${scheduleId}!`
    };
  }
  
  return { success: false };
}; 