import React, { useState, useEffect } from 'react';
import useAuthContext from '../hooks/useAuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    phone_number: '',
    password: ''
  });
  const { loginUser, errorMsg } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Authentication message from protected routes
  const [authMessage, setAuthMessage] = useState('');
  
  // Get the destination path from state, if available
  const from = location.state?.from || '/';
  
  useEffect(() => {
    // Check if we have a message from a protected route
    if (location.state?.message) {
      setAuthMessage(location.state.message);
    }
  }, [location]);
  
  // Check localStorage on component mount
  useEffect(() => {
    try {
      const tokens = localStorage.getItem('authTokens');
      console.log('Current auth tokens in localStorage:', tokens);
      
      // Test localStorage functionality
      const testKey = 'login_test_' + new Date().getTime();
      localStorage.setItem(testKey, 'test_value');
      const testValue = localStorage.getItem(testKey);
      console.log('localStorage test:', { key: testKey, value: testValue, success: testValue === 'test_value' });
      localStorage.removeItem(testKey);
    } catch (error) {
      console.error('localStorage test failed:', error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Submitting login with data:', loginData);
    
    try {
      const { success } = await loginUser(loginData);
      console.log('Login result:', { success });
      
      if (success) {
        // Verify tokens were saved before navigating
        try {
          const savedTokens = localStorage.getItem('authTokens');
          console.log('Tokens after login (before navigation):', savedTokens);
          
          if (savedTokens) {
            // Navigate to the original requested page, or home if none
            navigate(from);
          } else {
            console.error('Login succeeded but no tokens were saved');
            throw new Error('Login succeeded but tokens were not saved properly');
          }
        } catch (storageError) {
          console.error('Error accessing localStorage after login:', storageError);
          // Continue anyway as a fallback
          navigate(from);
        }
      } else {
        console.log('Login failed without throwing an error');
      }
    } catch (error) {
      console.error('Error during login submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-amber-600 hover:text-amber-500">
                  create a new account
              </Link>
          </p>
        </div>
        
        {/* Display authentication message if any */}
        {authMessage && (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded">
            <p className="text-center text-sm">{authMessage}</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phone_number" className="sr-only">
                Phone Number or Email
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number or Email"
                value={loginData.phone_number}
                onChange={(e) =>
                  setLoginData({ ...loginData, phone_number: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
          </div>

          {errorMsg && (
            <div className="text-red-600 text-sm text-center">{errorMsg}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          
          <div className="mt-3 text-center text-sm">
            <div className="text-gray-600 mb-2">
              Don't have an account yet? <Link to="/register" className="font-medium text-amber-600 hover:text-amber-500">Register here</Link>
            </div>
            <Link to="/forgot-password" className="font-medium text-amber-600 hover:text-amber-500">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 