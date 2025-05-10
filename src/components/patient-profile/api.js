import apiClient from '../../services/api-client';

/**
 * Safe function to get authentication token
 * @returns {Object|null} - Authentication tokens or null if not available
 */
const getAuthTokens = () => {
  try {
    console.log('Attempting to get auth tokens from localStorage');
    const authTokensStr = localStorage.getItem('authTokens');
    console.log('Auth tokens string from localStorage:', authTokensStr);
    
    if (!authTokensStr) {
      console.warn('No auth tokens found in localStorage');
      return null;
    }
    
    // Try to parse the token
    const authTokens = JSON.parse(authTokensStr);
    console.log('Parsed auth tokens:', authTokens);
    
    if (!authTokens || !authTokens.access) {
      console.warn('Invalid token structure - missing access token');
      return null;
    }
    
    console.log('Tokens retrieved successfully');
    return authTokens;
  } catch (error) {
    console.error('Error parsing auth tokens:', error);
    return null;
  }
};

/**
 * Determines the preferred authentication format for each endpoint
 * Maintains a cache of successful auth formats for better performance
 */
const authFormatCache = {
  // Map of endpoint prefixes to auth format preferences
  // Example: 'patient-profile': 'Token', 'auth/users': 'JWT'
};

// Helper to attempt API calls with both auth formats
async function tryBothAuthFormats(apiCall) {
  const tokens = getAuthTokens();
  if (!tokens || !tokens.access) {
    throw new Error('Authentication token is missing');
  }
  
  const token = tokens.access;
  const errors = [];
  
  // Try Token format first
  try {
    console.log('Attempting with Token format first');
    const result = await apiCall(token, 'Token');
    console.log('Success with Token format');
    return { success: true, data: result.data, authFormat: 'Token' };
  } catch (tokenErr) {
    console.error('Error with Token format:', tokenErr.response?.status, tokenErr.message);
    errors.push({ format: 'Token', error: tokenErr });
    
    // If Token format fails with 401/403, try JWT format
    try {
      console.log('Attempting with JWT format');
      const result = await apiCall(token, 'JWT');
      console.log('Success with JWT format');
      return { success: true, data: result.data, authFormat: 'JWT' };
    } catch (jwtErr) {
      console.error('Error with JWT format:', jwtErr.response?.status, jwtErr.message);
      errors.push({ format: 'JWT', error: jwtErr });
      
      // If both formats fail, throw the error with the most information
      const bestError = errors.find(e => e.error.response?.data) || errors[0];
      throw bestError.error;
    }
  }
}

/**
 * Make an API request with cached auth format or try both formats
 * @param {string} endpoint - API endpoint
 * @param {Function} apiCallFn - Function that takes (token, authFormat) and makes the API call
 * @returns {Promise} - API response
 */
async function makeAuthenticatedRequest(endpoint, apiCallFn) {
  try {
    // Check if we have a cached auth format for this endpoint or its prefix
    const endpointPrefix = endpoint.split('/')[0]; // Get first part of the path
    const cachedFormat = authFormatCache[endpointPrefix] || authFormatCache[endpoint];
    
    if (cachedFormat) {
      console.log(`Using cached auth format for ${endpointPrefix}: ${cachedFormat}`);
      const tokens = getAuthTokens();
      if (!tokens || !tokens.access) {
        throw new Error('Authentication token is missing');
      }
      
      try {
        const result = await apiCallFn(tokens.access, cachedFormat);
        return { success: true, data: result.data };
      } catch (err) {
        // If cached format fails with 401/403, clear the cache and try both formats
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log(`Cached auth format ${cachedFormat} failed with ${err.response.status}, trying both formats`);
          delete authFormatCache[endpointPrefix];
          delete authFormatCache[endpoint];
        } else {
          // For other errors, just propagate them
          throw err;
        }
      }
    }
    
    // No valid cached format, try both
    const result = await tryBothAuthFormats(apiCallFn);
    
    // Cache the successful format for future use
    if (result.success && result.authFormat) {
      console.log(`Caching auth format for ${endpointPrefix}: ${result.authFormat}`);
      authFormatCache[endpointPrefix] = result.authFormat;
    }
    
    return { success: true, data: result.data };
  } catch (err) {
    console.error('API request failed:', err);
    return {
      success: false,
      error: err.response?.data || err.message || 'API request failed',
      status: err.response?.status,
      statusText: err.response?.statusText
    };
  }
}

/**
 * Fetch patient profile data by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Success flag and data/error
 */
export const getPatientProfile = async (userId) => {
  const endpoint = `patient-profile/${userId}/`;
  
  try {
    // Get auth token
    const tokens = getAuthTokens();
    if (!tokens || !tokens.access) {
      return {
        success: false,
        error: 'Authentication token is missing. Please log in again.',
        status: 401
      };
    }
    
    const token = tokens.access;
    console.log('Using token for patient profile fetch:', token.substring(0, 10) + '...');
    console.log('Token length:', token.length, 'Token type:', typeof token);
    
    // Try with JWT format first
    try {
      console.log('Attempting GET with JWT format');
      
      const headers = {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json'
      };
      
      console.log('Full request details:', {
        url: `${apiClient.defaults.baseURL}${endpoint}`,
        headers: {
          Authorization: `JWT ${token.substring(0, 10)}...`,
          'Content-Type': 'application/json'
        }
      });
      
      const response = await apiClient.get(endpoint, { headers });
      console.log('Success with JWT format');
      console.log('Profile data structure:', JSON.stringify(response.data, null, 2));
      console.log('Profile ID field:', response.data.id);
      console.log('Available fields:', Object.keys(response.data));
      
      // Cache successful format
      authFormatCache['patient-profile'] = 'JWT';
      
      return {
        success: true,
        data: response.data
      };
    } catch (jwtErr) {
      console.error('Error with JWT format:', jwtErr.response?.status, jwtErr.message);
      console.error('Error details:', jwtErr.response?.data);
      
      // Check specifically for auth errors
      if (jwtErr.response?.status === 401 || 
          (jwtErr.response?.data?.detail && 
           jwtErr.response.data.detail.includes('credentials'))) {
        
        // If JWT format fails, try Token format
        try {
          console.log('Attempting with Token format');
          
          const headers = {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          };
          
          const response = await apiClient.get(endpoint, { headers });
          console.log('Success with Token format');
          
          // Cache successful format
          authFormatCache['patient-profile'] = 'Token';
          
          return {
            success: true,
            data: response.data
          };
        } catch (tokenErr) {
          console.error('Error with Token format:', tokenErr.response?.status);
          console.error('Error details:', tokenErr.response?.data);
          
          // If profile not found (404), it might not exist yet
          if (tokenErr.response?.status === 404 || jwtErr.response?.status === 404) {
            return {
              success: false,
              error: 'Profile not found. You need to create one first.',
              status: 404
            };
          }
          
          return {
            success: false,
            error: 'Authentication failed. Please log in again.',
            status: tokenErr.response?.status || 401,
            details: tokenErr.response?.data?.detail || 'Token authentication failed'
          };
        }
      }
      
      // If profile not found (404), it might not exist yet
      if (jwtErr.response?.status === 404) {
        return {
          success: false,
          error: 'Profile not found. You need to create one first.',
          status: 404
        };
      }
      
      // Return error from JWT attempt
      return {
        success: false,
        error: jwtErr.response?.data?.detail || jwtErr.message || 'Failed to fetch profile',
        status: jwtErr.response?.status || 500
      };
    }
  } catch (err) {
    console.error('Error fetching patient profile:', err);
    return {
      success: false,
      error: err.response?.data?.detail || err.message || 'Failed to fetch patient profile',
      status: err.response?.status
    };
  }
};

/**
 * Create a new patient profile
 * @param {Object} profileData - Patient profile data
 * @returns {Promise<Object>} - Success flag and data/error
 */
export const createPatientProfile = async (profileData) => {
  const endpoint = 'patient-profile/';
  
  // Log payload contents for debugging
  if (profileData instanceof FormData) {
    console.log('Creating profile with FormData content:');
    for (let [key, value] of profileData.entries()) {
      console.log(`- ${key}: ${value}`);
    }
  } else {
    console.log('Creating profile with JSON content:', profileData);
  }
  
  try {
    // Get auth token
    const tokens = getAuthTokens();
    if (!tokens || !tokens.access) {
      throw new Error('Authentication token is missing');
    }
    
    const token = tokens.access;
    
    // Try with JWT format first
    try {
      console.log('Attempting POST with JWT format first');
      
      const headers = {
        'Authorization': `JWT ${token}`
      };
      
      console.log('Making POST request to:', `${apiClient.defaults.baseURL}${endpoint}`);
      console.log('Headers:', headers);
      
      const response = await apiClient.post(endpoint, profileData, { headers });
      console.log('Success with JWT format');
      
      // Cache successful format
      if (!authFormatCache['patient-profile']) {
        authFormatCache['patient-profile'] = 'JWT';
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (jwtErr) {
      console.error('Error with JWT format:', jwtErr.response?.status, jwtErr.message);
      console.error('Error details:', jwtErr.response?.data);

      // If JWT format fails, try Token format
      try {
        console.log('Attempting with Token format');
        
        const headers = {
          'Authorization': `Token ${token}`
        };
        
        const response = await apiClient.post(endpoint, profileData, { headers });
        console.log('Success with Token format');
        
        // Cache successful format
        if (!authFormatCache['patient-profile']) {
          authFormatCache['patient-profile'] = 'Token';
        }
        
        return {
          success: true,
          data: response.data
        };
      } catch (tokenErr) {
        console.error('Error with Token format:', tokenErr.response?.status, tokenErr.message);
        console.error('Error details:', tokenErr.response?.data);
        
        // Check for phone number uniqueness error
        if (tokenErr.response?.data?.phone_number && 
            tokenErr.response.data.phone_number.includes('already exists')) {
          console.error('Phone number already exists error detected');
          return {
            success: false,
            error: tokenErr.response.data,
            status: tokenErr.response.status
          };
        }
        
        // Return the most informative error
        return {
          success: false,
          error: tokenErr.response?.data || jwtErr.response?.data || 'Failed to create profile',
          status: tokenErr.response?.status || jwtErr.response?.status
        };
      }
    }
  } catch (err) {
    console.error('API request failed:', err);
    return {
      success: false,
      error: err.response?.data || err.message || 'API request failed',
      status: err.response?.status,
      statusText: err.response?.statusText
    };
  }
};

/**
 * Partially update a patient profile
 * @param {number} profileId - Profile ID
 * @param {Object} profileData - Partial profile data
 * @returns {Promise<Object>} - Success flag and data/error
 */
export const updatePatientProfile = async (profileId, profileData) => {
  // Validate profileId
  if (!profileId) {
    console.error('Profile ID is missing or undefined');
    return {
      success: false,
      error: 'Profile ID is required for updates',
      status: 400
    };
  }
  
  const endpoint = `patient-profile/${profileId}/`;
  
  // Log payload contents for debugging
  if (profileData instanceof FormData) {
    console.log('Updating profile with FormData content:');
    for (let [key, value] of profileData.entries()) {
      console.log(`- ${key}: ${value}`);
    }
  } else {
    console.log('Updating profile with JSON content:', profileData);
  }
  
  try {
    // Get auth token
    const tokens = getAuthTokens();
    if (!tokens || !tokens.access) {
      return {
        success: false,
        error: 'Authentication token is missing. Please log in again.',
        status: 401
      };
    }
    
    const token = tokens.access;
    console.log('Token for patient profile update:', token.substring(0, 10) + '...');
    
    // Try with JWT format first
    try {
      console.log('Attempting PATCH with JWT format first');
      
      const headers = {
        'Authorization': `JWT ${token}`
      };
      
      console.log('Making PATCH request to:', `${apiClient.defaults.baseURL}${endpoint}`);
      console.log('Headers:', headers);
      
      const response = await apiClient.patch(endpoint, profileData, { headers });
      console.log('Success with JWT format');
      
      // Cache successful format
      if (!authFormatCache['patient-profile']) {
        authFormatCache['patient-profile'] = 'JWT';
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (jwtErr) {
      console.error('Error with JWT format:', jwtErr.response?.status, jwtErr.message);
      console.error('Error details:', jwtErr.response?.data);
      
      // Check for specific auth errors
      if (jwtErr.response?.status === 401 || 
          (jwtErr.response?.data?.detail && 
           jwtErr.response.data.detail.includes('credentials'))) {
        console.error('Authentication error detected with JWT. Trying Token format...');
      }
      
      // If JWT format fails, try Token format
      try {
        console.log('Attempting with Token format');
        
        const headers = {
          'Authorization': `Token ${token}`
        };
        
        const response = await apiClient.patch(endpoint, profileData, { headers });
        console.log('Success with Token format');
        
        // Cache successful format
        if (!authFormatCache['patient-profile']) {
          authFormatCache['patient-profile'] = 'Token';
        }
        
        return {
          success: true,
          data: response.data
        };
      } catch (tokenErr) {
        console.error('Error with Token format:', tokenErr.response?.status, tokenErr.message);
        console.error('Error details:', tokenErr.response?.data);
        
        // Check for specific auth errors
        if (tokenErr.response?.status === 401 || 
            (tokenErr.response?.data?.detail && 
             tokenErr.response.data.detail.includes('credentials'))) {
          return {
            success: false,
            error: 'Authentication failed. Please try logging out and back in.',
            status: 401,
            details: tokenErr.response?.data?.detail
          };
        }
        
        // Combine the errors for better debugging
        return {
          success: false,
          error: 'Update failed with both authentication methods.',
          jwtError: jwtErr.response?.data?.detail || jwtErr.message,
          tokenError: tokenErr.response?.data?.detail || tokenErr.message,
          status: jwtErr.response?.status || tokenErr.response?.status
        };
      }
    }
  } catch (err) {
    console.error('API request failed:', err);
    return {
      success: false,
      error: err.response?.data?.detail || err.message || 'API request failed',
      status: err.response?.status,
      statusText: err.response?.statusText
    };
  }
};

/**
 * Delete a patient profile
 * @param {number} profileId - Profile ID
 * @returns {Promise<Object>} - Success flag and data/error
 */
export const deletePatientProfile = async (profileId) => {
  const endpoint = `patient-profile/${profileId}/`;
  
  return makeAuthenticatedRequest(endpoint, (token, authFormat) => {
    return apiClient.delete(endpoint, {
      headers: {
        'Authorization': `${authFormat} ${token}`
      }
    });
  });
}; 