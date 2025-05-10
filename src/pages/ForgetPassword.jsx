import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import apiClient from '../services/api-client';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgotPassword } = useAuthContext();

  const checkEmailExists = async (email) => {
    try {
      console.log("Checking if email exists:", email);
      const response = await apiClient.post('check-email/', { email });
      console.log("Email check response:", response.data);
      return response.data.exists;
    } catch (error) {
      console.error('Email check failed:', error);
      // If API returns a 404, then the email doesn't exist
      if (error.response?.status === 404) {
        return false;
      }
      // For other errors, we'll proceed with the password reset anyway
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // First check if email exists in the database
      const emailExists = await checkEmailExists(email);
      
      if (!emailExists) {
        setIsSuccess(false);
        setMessage('No account found with this email. Please use your registered email address.');
        setIsLoading(false);
        return;
      }
      
      // If email exists, proceed with password reset
      await forgotPassword(email);
      setIsSuccess(true);
      setMessage('Password reset link has been sent to your email. Please check your inbox (and spam folder) for a link to reset your password.');
    } catch (error) {
      setIsSuccess(false);
      if (error.response?.data?.email) {
        setMessage(error.response.data.email[0]);
      } else {
        setMessage('Password reset request failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-600">Password Reset</h2>
        
        {isSuccess ? (
          <div className="text-center">
            <div className="text-green-600 mb-4">{message}</div>
            <p className="text-sm text-gray-600 mb-4">
              Click on the link in your email to set a new password. If you don't see the email, check your spam folder.
            </p>
            <Link to="/login" className="text-amber-500 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">
              Enter your email address, and we'll send you a link to reset your password.
            </p>
            
            {message && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-amber-600">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md ${
                  isLoading ? 'bg-amber-300' : 'bg-amber-600 hover:bg-amber-700'
                } text-white font-medium transition duration-200`}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <Link to="/login" className="text-amber-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </>   
        )}
      </div>
    </div>
  );
};

export default ForgetPassword; 