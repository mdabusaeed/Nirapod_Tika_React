import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RedirectReset = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Log full URL and location info for debugging
    console.log('Reset redirect triggered');
    console.log('Current location:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      fullUrl: window.location.href
    });

    // Extract the query parameters from the URL
    const searchParams = new URLSearchParams(location.search);
    
    // Get uid and token from the URL parameters
    const uid = searchParams.get('uid') || '';
    const token = searchParams.get('token') || '';
    console.log('URL query params:', { uid, token });
    
    // Alternative way to extract parameters if they're part of the path
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    console.log('Path parts:', pathParts);
    
    // Try to find uid and token in the path if not in query params
    const uidIndex = pathParts.indexOf('uid');
    const tokenIndex = pathParts.indexOf('token');
    
    const pathUid = uidIndex >= 0 && uidIndex + 1 < pathParts.length ? pathParts[uidIndex + 1] : '';
    const pathToken = tokenIndex >= 0 && tokenIndex + 1 < pathParts.length ? pathParts[tokenIndex + 1] : '';
    console.log('Path-extracted params:', { pathUid, pathToken });
    
    // Use the values from query params first, fall back to path values
    const finalUid = uid || pathUid;
    const finalToken = token || pathToken;
    
    // If we still don't have uid/token, try to find them in the path directly
    // This is for URLs like /reset/abc123/xyz789/
    if (!finalUid || !finalToken) {
      // Look for potential uid/token in the path segments
      if (pathParts.length >= 2) {
        // Assume the last two parts might be uid and token
        const potentialUid = pathParts[pathParts.length - 2];
        const potentialToken = pathParts[pathParts.length - 1];
        
        console.log('Potential uid/token from path:', { potentialUid, potentialToken });
        
        if (potentialUid && potentialToken) {
          // Store in localStorage before redirecting
          localStorage.setItem('reset_password_uid', potentialUid);
          localStorage.setItem('reset_password_token', potentialToken);
          
          console.log('Stored in localStorage and redirecting with:', { uid: potentialUid, token: potentialToken });
          // Redirect with these values
          navigate(`/reset-password/${potentialUid}/${potentialToken}`);
          return;
        }
      }
    }
    
    // Redirect to our app's reset password page if we have both uid and token
    if (finalUid && finalToken) {
      // Store in localStorage for persistence
      localStorage.setItem('reset_password_uid', finalUid);
      localStorage.setItem('reset_password_token', finalToken);
      
      console.log('Stored in localStorage and redirecting with final values:', { uid: finalUid, token: finalToken });
      navigate(`/reset-password/${finalUid}/${finalToken}`);
    } else {
      // Handle the case where we couldn't extract uid and token
      console.log('Could not extract uid/token, redirecting to forgot password');
      navigate('/forgot-password', { 
        state: { error: 'Invalid password reset link. Please request a new one.' } 
      });
    }
  }, [location, navigate]);

  // Show a loading indicator while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700">Redirecting to password reset...</p>
      </div>
    </div>
  );
};

export default RedirectReset; 