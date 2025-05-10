import { Navigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';

// This component wraps routes that should only be accessible to authenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        <p className="ml-2 text-gray-700">Loading...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname, message: "You must be logged in to access this page." }} />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute; 