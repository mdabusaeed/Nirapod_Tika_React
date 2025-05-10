import React, { useState, useEffect } from 'react';
import apiClient from '../services/api-client';

const ShowUserInfo = () => {
  const [localUser, setLocalUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get user from localStorage
  useEffect(() => {
    try {
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));
      if (authTokens?.access) {
        setLocalUser({ token: authTokens });
      } else {
        setError('No auth tokens found in localStorage');
      }
    } catch (err) {
      setError('Error parsing localStorage data: ' + err.message);
    }
  }, []);
  
  // Function to fetch fresh user data from API
  const fetchFreshUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));
      if (!authTokens?.access) {
        throw new Error('No access token found');
      }
      
      const response = await apiClient.get('auth/users/me/', {
        headers: {
          'Authorization': `JWT ${authTokens.access}`
        }
      });
      
      setApiUser(response.data);
    } catch (err) {
      setError('API fetch error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  // Clear localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem('authTokens');
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-amber-800 mb-6">User Information Debug</h1>
          
          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={fetchFreshUserData}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Fetch Fresh User Data'}
              </button>
              
              <button 
                onClick={clearLocalStorage}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Clear localStorage and Reload
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LocalStorage User Data */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2 text-black">LocalStorage User Data</h2>
              {localUser ? (
                <pre className="text-xs overflow-auto max-h-96 bg-gray-100 p-3 rounded text-black">
                  {JSON.stringify(localUser, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500">No user data in localStorage</p>
              )}
            </div>
            
            {/* API User Data */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2">API User Data (Fresh)</h2>
              {apiUser ? (
                <pre className="text-xs overflow-auto max-h-96 bg-gray-100 p-3 rounded text-black">
                  {JSON.stringify(apiUser, null, 2)}
                </pre>
              ) : (
                <p className=" text-black">
                  {loading ? 'Loading...' : 'Click "Fetch Fresh User Data" to see API data'}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-sm text-black ">
            <p><strong>Note:</strong> If user type in API data differs from localStorage data, 
            you need to logout and login again to update your local session.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUserInfo; 