import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api-client';

const ResetPassword = () => {
  // Get parameters from URL or localStorage as fallback
  const { uid: urlUid, token: urlToken } = useParams();
  const navigate = useNavigate();
  
  // State for storing and using uid and token
  const [credentials, setCredentials] = useState({
    uid: '',
    token: ''
  });
  
  const [passwords, setPasswords] = useState({
    new_password: '',
    re_new_password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // On initial load, try to get params from URL or localStorage
  useEffect(() => {
    // First try to get from URL
    const uidValue = urlUid || '';
    const tokenValue = urlToken || '';
    
    console.log('URL params:', { uidValue, tokenValue });
    
    // If URL params are not available, check localStorage
    const storedUid = localStorage.getItem('reset_password_uid');
    const storedToken = localStorage.getItem('reset_password_token');
    
    console.log('Stored params:', { storedUid, storedToken });
    
    // Use URL params first, then localStorage as fallback
    const finalUid = uidValue || storedUid || '';
    const finalToken = tokenValue || storedToken || '';
    
    console.log('Final params used:', { finalUid, finalToken });
    
    // Store values in state for use in form submission
    setCredentials({
      uid: finalUid,
      token: finalToken
    });
    
    // Also store in localStorage for persistence across page refreshes
    if (finalUid && finalToken) {
      localStorage.setItem('reset_password_uid', finalUid);
      localStorage.setItem('reset_password_token', finalToken);
    }
    
    // Validate that we have both uid and token
    if (!finalUid || !finalToken) {
      setIsError(true);
      setMessage('Invalid password reset link. Please request a new one.');
    }
  }, [urlUid, urlToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate passwords match
    if (passwords.new_password !== passwords.re_new_password) {
      setMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // Get uid and token from state
    const { uid, token } = credentials;
    
    console.log('Submitting with credentials:', { uid, token });

    try {
      const response = await apiClient.post('auth/users/reset_password_confirm/', {     
        uid,
        token,
        new_password: passwords.new_password,
        re_new_password: passwords.re_new_password
      });
      console.log("Password reset response:", response.data);

      // Clear stored values after successful reset
      localStorage.removeItem('reset_password_uid');
      localStorage.removeItem('reset_password_token');

      setIsSuccess(true);
      setMessage('Your password has been reset successfully.');
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setIsError(true);
      console.error('Password reset failed:', error);
      console.error('Detailed error:', {
        response: error.response,
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      if (error.response?.data) {
        // Handle different error types
        if (error.response.data.token) {
          setMessage('Invalid or expired token. Please request a new password reset link.');
        } else if (error.response.data.new_password) {
          setMessage(error.response.data.new_password[0]);
        } else if (error.response.data.non_field_errors) {
          setMessage(error.response.data.non_field_errors[0]);
        } else {
          // Try to extract any error message
          const errorKeys = Object.keys(error.response.data);
          if (errorKeys.length > 0) {
            const firstKey = errorKeys[0];
            const errorValue = error.response.data[firstKey];
            setMessage(`Error: ${firstKey} - ${Array.isArray(errorValue) ? errorValue[0] : errorValue}`);
          } else {
            setMessage('Failed to reset password. Please try again.');
          }
        }
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-600">Reset Your Password</h2>
        
        {isSuccess ? (
          <div className="text-center">
            <div className="text-green-600 mb-4">{message}</div>
            <p className="text-sm text-gray-600 mb-4">You will be redirected to the login page shortly.</p>
            <Link to="/login" className="text-amber-500 hover:underline">
              Go to Login
            </Link>
          </div>
        ) : isError ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{message}</div>
            <Link to="/forgot-password" className="text-amber-500 hover:underline">
              Request a new reset link
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">
              Please enter your new password below.
            </p>
            
            
            {message && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwords.new_password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
                  required
                  minLength="8"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="re_new_password" className="block mb-2 text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="re_new_password"
                  name="re_new_password"
                  value={passwords.re_new_password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
                  required
                  minLength="8"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md ${
                  isLoading ? 'bg-amber-300' : 'bg-amber-600 hover:bg-amber-700'
                } text-white font-medium transition duration-200`}
              >
                {isLoading ? "Processing..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 