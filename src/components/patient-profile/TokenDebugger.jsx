import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TokenDebugger = () => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formDataTest, setFormDataTest] = useState(false);
  const [testingFormData, setTestingFormData] = useState(false);
  
  // Extract token info on component mount
  useEffect(() => {
    try {
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) {
        setError('No auth tokens found in localStorage');
        return;
      }
      
      const authTokens = JSON.parse(authTokensStr);
      if (!authTokens || !authTokens.access) {
        setError('Invalid token structure - missing access token');
        return;
      }
      
      // Safely display token info without revealing the full token
      const token = authTokens.access;
      setTokenInfo({
        exists: true,
        length: token.length,
        prefix: token.substring(0, 10) + '...',
        suffix: '...' + token.substring(token.length - 10),
        expiryCheck: checkTokenExpiry(token)
      });
    } catch (err) {
      setError(`Error parsing token: ${err.message}`);
    }
  }, []);
  
  // Check if token might be expired
  const checkTokenExpiry = (token) => {
    try {
      // JWT tokens are in format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) return 'Not a valid JWT format';
      
      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check exp claim
      if (payload.exp) {
        const expiryDate = new Date(payload.exp * 1000);
        const now = new Date();
        return {
          isExpired: expiryDate < now,
          expiryDate: expiryDate.toLocaleString(),
          timeRemaining: Math.floor((expiryDate - now) / 1000) + ' seconds'
        };
      }
      
      return 'No expiry found in token';
    } catch (err) {
      return `Error checking expiry: ${err.message}`;
    }
  };
  
  // Test the token with different auth formats
  const testToken = async () => {
    setLoading(true);
    setError(null);
    setTestResults({});
    
    try {
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) {
        setError('No auth tokens found in localStorage');
        return;
      }
      
      const authTokens = JSON.parse(authTokensStr);
      if (!authTokens || !authTokens.access) {
        setError('Invalid token structure - missing access token');
        return;
      }
      
      const token = authTokens.access;
      const userId = getUserIdFromToken(token);
      
      // Create an axios instance for testing
      const api = axios.create({
        baseURL: "https://nirapod-tika-sub.vercel.app/api/v1/",
      });
      
      // Test endpoints with different auth formats
      const results = {};
      
      // Test JWT format with /auth/users/me/
      try {
        const jwtResp = await api.get('auth/users/me/', {
          headers: { 'Authorization': `JWT ${token}` }
        });
        results.jwtAuth = {
          success: true,
          status: jwtResp.status,
          message: 'JWT authentication succeeded with /auth/users/me/'
        };
      } catch (err) {
        results.jwtAuth = {
          success: false,
          status: err.response?.status,
          message: `JWT authentication failed: ${err.message}`
        };
      }
      
      // Test Token format with /auth/users/me/
      try {
        const tokenResp = await api.get('auth/users/me/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        results.tokenAuth = {
          success: true,
          status: tokenResp.status,
          message: 'Token authentication succeeded with /auth/users/me/'
        };
      } catch (err) {
        results.tokenAuth = {
          success: false,
          status: err.response?.status,
          message: `Token authentication failed: ${err.message}`
        };
      }
      
      // Test patient profile endpoint with both formats
      if (userId) {
        try {
          const jwtProfileResp = await api.get(`patient-profile/${userId}/`, {
            headers: { 'Authorization': `JWT ${token}` }
          });
          results.jwtProfileAuth = {
            success: true,
            status: jwtProfileResp.status,
            message: 'JWT authentication succeeded with patient-profile endpoint'
          };
        } catch (err) {
          results.jwtProfileAuth = {
            success: false,
            status: err.response?.status,
            message: `JWT authentication failed with patient-profile: ${err.message}`
          };
        }
        
        try {
          const tokenProfileResp = await api.get(`patient-profile/${userId}/`, {
            headers: { 'Authorization': `Token ${token}` }
          });
          results.tokenProfileAuth = {
            success: true,
            status: tokenProfileResp.status,
            message: 'Token authentication succeeded with patient-profile endpoint'
          };
        } catch (err) {
          results.tokenProfileAuth = {
            success: false,
            status: err.response?.status,
            message: `Token authentication failed with patient-profile: ${err.message}`
          };
        }

        // If form data test is enabled, test it
        if (formDataTest) {
          setTestingFormData(true);
          try {
            // Create a simple FormData
            const formData = new FormData();
            formData.append('user', userId);
            formData.append('test_field', 'Test value ' + new Date().toISOString());
            
            // Test with JWT
            try {
              const formDataJwtResp = await api.patch(`patient-profile/${userId}/`, formData, {
                headers: { 'Authorization': `JWT ${token}` }
              });
              results.formDataJwt = {
                success: true,
                status: formDataJwtResp.status,
                message: 'FormData with JWT succeeded',
                data: formDataJwtResp.data
              };
            } catch (err) {
              results.formDataJwt = {
                success: false,
                status: err.response?.status,
                message: `FormData with JWT failed: ${err.message}`,
                error: err.response?.data
              };
            }
            
            // Test with Token
            try {
              const formDataTokenResp = await api.patch(`patient-profile/${userId}/`, formData, {
                headers: { 'Authorization': `Token ${token}` }
              });
              results.formDataToken = {
                success: true,
                status: formDataTokenResp.status,
                message: 'FormData with Token succeeded',
                data: formDataTokenResp.data
              };
            } catch (err) {
              results.formDataToken = {
                success: false,
                status: err.response?.status,
                message: `FormData with Token failed: ${err.message}`,
                error: err.response?.data
              };
            }
          } catch (err) {
            results.formDataTest = {
              success: false,
              message: `FormData test error: ${err.message}`
            };
          } finally {
            setTestingFormData(false);
          }
        }
      }
      
      setTestResults(results);
    } catch (err) {
      setError(`Testing error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Extract user ID from JWT token
  const getUserIdFromToken = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload.user_id;
    } catch (err) {
      console.error('Error extracting user ID from token:', err);
      return null;
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-amber-800 mb-4">Authentication Debugger</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Token Information</h3>
        {tokenInfo ? (
          <div className="bg-gray-50 p-4 rounded-md">
            <p><strong>Token exists:</strong> {tokenInfo.exists ? 'Yes' : 'No'}</p>
            <p><strong>Length:</strong> {tokenInfo.length} characters</p>
            <p><strong>Preview:</strong> {tokenInfo.prefix + tokenInfo.suffix}</p>
            <p><strong>Expiry:</strong> {typeof tokenInfo.expiryCheck === 'string' 
              ? tokenInfo.expiryCheck 
              : tokenInfo.expiryCheck.isExpired 
                ? `Expired at ${tokenInfo.expiryCheck.expiryDate}` 
                : `Valid until ${tokenInfo.expiryCheck.expiryDate} (${tokenInfo.expiryCheck.timeRemaining} remaining)`}
            </p>
          </div>
        ) : (
          <p>No token information available</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={formDataTest} 
            onChange={(e) => setFormDataTest(e.target.checked)}
            className="form-checkbox h-4 w-4 text-amber-500"
          />
          <span>Test FormData (PATCH) with both auth formats</span>
        </label>
        <p className="text-xs text-gray-500 ml-6">
          Will attempt to update your profile with a test field
        </p>
      </div>
      
      <button 
        onClick={testToken}
        disabled={loading || testingFormData}
        className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-75 disabled:cursor-not-allowed mb-4"
      >
        {loading ? 'Testing...' : testingFormData ? 'Testing FormData...' : 'Test Authentication'}
      </button>
      
      {Object.keys(testResults).length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Test Results</h3>
          <div className="space-y-3">
            {Object.entries(testResults).map(([key, result]) => (
              <div 
                key={key} 
                className={`p-3 rounded-md ${result.success ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <p><strong>{key}:</strong> {result.message}</p>
                <p><strong>Status:</strong> {result.status}</p>
                
                {result.data && (
                  <details>
                    <summary className="cursor-pointer text-sm text-blue-600">View Response Data</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded-md overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
                
                {result.error && (
                  <details>
                    <summary className="cursor-pointer text-sm text-red-600">View Error Details</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded-md overflow-auto max-h-40">
                      {JSON.stringify(result.error, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            <p><strong>Recommendation:</strong></p>
            {testResults.jwtAuth?.success && !testResults.tokenAuth?.success && (
              <p>Use JWT format for all authentication headers.</p>
            )}
            {!testResults.jwtAuth?.success && testResults.tokenAuth?.success && (
              <p>Use Token format for all authentication headers.</p>
            )}
            {testResults.jwtAuth?.success && testResults.tokenAuth?.success && (
              <p>Both authentication formats work with the main API.</p>
            )}
            {testResults.jwtProfileAuth?.success && !testResults.tokenProfileAuth?.success && (
              <p>Use JWT format for patient profile endpoints.</p>
            )}
            {!testResults.jwtProfileAuth?.success && testResults.tokenProfileAuth?.success && (
              <p>Use Token format for patient profile endpoints.</p>
            )}
            {(!testResults.jwtAuth?.success && !testResults.tokenAuth?.success) && (
              <p>Neither authentication format is working. The token may be invalid or expired.</p>
            )}
            
            {/* FormData test recommendations */}
            {testResults.formDataJwt?.success && !testResults.formDataToken?.success && (
              <p className="mt-2"><strong>FormData:</strong> Use JWT format for form uploads.</p>
            )}
            {!testResults.formDataJwt?.success && testResults.formDataToken?.success && (
              <p className="mt-2"><strong>FormData:</strong> Use Token format for form uploads.</p>
            )}
            {testResults.formDataJwt?.success && testResults.formDataToken?.success && (
              <p className="mt-2"><strong>FormData:</strong> Both authentication formats work for form uploads.</p>
            )}
            {testResults.formDataJwt && testResults.formDataToken && 
              !testResults.formDataJwt.success && !testResults.formDataToken.success && (
              <p className="mt-2 text-red-600">
                <strong>FormData:</strong> Form uploads are failing with both authentication formats. 
                Check the server logs or try a different approach.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenDebugger; 