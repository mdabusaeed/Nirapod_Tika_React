import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api-client';

const FetchAndRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get auth token
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        if (!authTokens?.access) {
          setError('No access token found - please login again');
          setLoading(false);
          return;
        }
        
        // Make API call to get user data
        const response = await apiClient.get('auth/users/me/', {
          headers: {
            'Authorization': `JWT ${authTokens.access}`
          }
        });
        
        // Get user data from response
        const userData = response.data;
        console.log('User data:', userData);
        setUserData(userData);
        
        // Check if user is doctor/admin
        const isDoctor = userData.is_doctor || 
                         userData.user_type === 'doctor' || 
                         userData.role === 'doctor';
        
        const isAdmin = userData.is_staff || 
                        userData.is_admin || 
                        userData.user_type === 'admin' || 
                        userData.role === 'admin';
        
        console.log('Is Doctor:', isDoctor);
        console.log('Is Admin:', isAdmin);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirect to appropriate profile edit page
        setTimeout(() => {
          if (isDoctor || isAdmin) {
            navigate('/profile/edit');
          } else {
            navigate('/profile/patient/edit');
          }
        }, 1500); // Small delay to show the message
        
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error: ' + (error.response?.data?.detail || error.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">User Profile Fixer</h1>
        
        {loading && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-4 border-amber-500 border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-black">Fetching your profile data...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700"
            >
              Go to Login
            </button>
          </div>
        )}
        
        {!loading && !error && userData && (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700">Your profile data has been successfully retrieved!</p>
              <p className="mt-2 text-green-700">Redirecting you to the appropriate profile page...</p>
            </div>
            
            <div className="mt-4 flex justify-center space-x-4">
              <button 
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Doctor/Admin Profile
              </button>
              
              <button 
                onClick={() => navigate('/profile/patient/edit')}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Patient Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchAndRedirect; 