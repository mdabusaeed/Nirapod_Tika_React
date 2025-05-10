// Format date for display with time if available
export const formatDateTime = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;
    
    // Format date with time if possible
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    // Error formatting date, return original string
    return dateString;
  }
};

// Format simple date (without time)
export const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;
    
    // Format date without time
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    // Error formatting date, return original string
    return dateString;
  }
};

// Get the order creation date from the schedule
export const getOrderDate = (schedule) => {
  // Check multiple possible field names
  if (schedule.created_at) return schedule.created_at;
  if (schedule.created) return schedule.created;
  if (schedule.order_date) return schedule.order_date;
  if (schedule.date) return schedule.date;
  return null;
};

// Get the vaccine delivery date from the schedule
export const getDeliveryDate = (schedule) => {
  if (schedule.dose_date) return schedule.dose_date;
  if (schedule.dose_dates && schedule.dose_dates.length > 0) return schedule.dose_dates[0];
  if (schedule.delivery_date) return schedule.delivery_date;
  return null;
};

// Get the price for a vaccine
export const getVaccinePrice = (vaccines, vaccineId) => {
  const vaccine = vaccines.find(v => v.id === Number(vaccineId));
  return vaccine?.price || 1000; // Default price if not found
};

// Check if a schedule has unpaid online payment
export const hasUnpaidOnlinePayment = (schedule) => {
  return (
    (schedule.payment_method === 'online' || schedule.payment_method === 'Online') && 
    (schedule.payment_status !== 'paid' && schedule.payment_status !== 'completed')
  );
}; 