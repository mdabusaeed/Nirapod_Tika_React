import apiClient from '../../services/api-client';

// Get doctor profile by ID
export const getDoctorProfile = async (doctorId) => {
  try {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens?.access;
    
    const response = await apiClient.get(`doctor-profile/${doctorId}/`, {
      headers: {
        'Authorization': `JWT ${token}`
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (err) {
    console.error('Error fetching doctor profile:', err);
    return {
      success: false,
      error: err.response?.data || 'Failed to fetch doctor profile'
    };
  }
};

// Update doctor profile
export const updateDoctorProfile = async (doctorId, formData) => {
  try {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens?.access;
    
    const response = await apiClient.patch(`doctor-profile/${doctorId}/`, formData, {
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (err) {
    console.error('Error updating doctor profile:', err);
    return {
      success: false,
      error: err.response?.data || 'Failed to update doctor profile'
    };
  }
}; 