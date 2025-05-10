import apiClient from '../../services/api-client';

// Fetch user schedules
export const fetchUserSchedules = async () => {
  try {
    // Get auth token from localStorage
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens?.access;
    
    const response = await apiClient.get('vaccination-schedules/', {
      headers: {
        'Authorization': `JWT ${token}`
      }
    });
    
    return {
      success: true,
      data: response.data || []
    };
  } catch (err) {
    console.error('Error fetching schedules:', err);
    return {
      success: false,
      error: 'Failed to load your vaccination schedules.'
    };
  }
};

// Fetch all vaccines to get price information
export const fetchVaccines = async () => {
  try {
    // Get auth token from localStorage
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens?.access;
    
    const response = await apiClient.get('vaccines/', {
      headers: {
        'Authorization': `JWT ${token}`
      }
    });
    
    return {
      success: true,
      data: response.data || []
    };
  } catch (err) {
    console.error('Error fetching vaccines:', err);
    return {
      success: false,
      error: 'Failed to fetch vaccines information.',
      data: []
    };
  }
};

// Delete a schedule
export const deleteSchedule = async (id) => {
  try {
    // Get auth token from localStorage
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens?.access;
    
    await apiClient.delete(`vaccination-schedules/${id}/`, {
      headers: {
        'Authorization': `JWT ${token}`
      }
    });
    
    return {
      success: true,
      message: `Schedule #${id} deleted successfully`
    };
  } catch (err) {
    console.error('Failed to delete schedule:', err);
    return {
      success: false,
      error: err.message || 'Failed to delete the schedule. Please try again.'
    };
  }
}; 