import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthContext from '../../hooks/useAuthContext';

const ApiConnectionTester = () => {
  const { user } = useAuthContext();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessOnly, setShowSuccessOnly] = useState(false);
  const [baseUrl, setBaseUrl] = useState('https://nirapod-tika-sub.vercel.app/api/v1');
  const [tokenDetails, setTokenDetails] = useState(null);
  const [headerTypes, setHeaderTypes] = useState([
    { id: 'jwt', enabled: true, format: 'JWT' },
    { id: 'token', enabled: true, format: 'Token' },
    { id: 'bearer', enabled: true, format: 'Bearer' },
    { id: 'none', enabled: false, format: 'None' }
  ]);

  // Extract token details on component mount
  useEffect(() => {
    try {
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) {
        setTokenDetails({ error: 'No auth tokens found in localStorage' });
        return;
      }
      
      const authTokens = JSON.parse(authTokensStr);
      if (!authTokens || !authTokens.access) {
        setTokenDetails({ error: 'Invalid token structure - missing access token' });
        return;
      }
      
      const token = authTokens.access;
      
      // Decode JWT token to extract info
      try {
        const parts = token.split('.');
        const payload = parts.length === 3 ? JSON.parse(atob(parts[1])) : null;
        
        setTokenDetails({
          token: {
            length: token.length,
            prefix: token.substring(0, 10) + '...',
            suffix: '...' + token.substring(token.length - 10)
          },
          payload: payload,
          expiryInfo: payload?.exp ? {
            expiryDate: new Date(payload.exp * 1000).toLocaleString(),
            isExpired: new Date(payload.exp * 1000) < new Date(),
            timeRemaining: Math.round((new Date(payload.exp * 1000) - new Date()) / 1000)
          } : null
        });
      } catch (decodeErr) {
        setTokenDetails({
          token: {
            length: token.length,
            prefix: token.substring(0, 10) + '...',
            suffix: '...' + token.substring(token.length - 10)
          },
          error: 'Failed to decode token: ' + decodeErr.message
        });
      }
    } catch (error) {
      setTokenDetails({ error: `Error processing token: ${error.message}` });
    }
  }, []);

  // Predefined endpoints to test
  const endpoints = [
    { 
      name: 'Authentication Check',
      path: 'auth/users/me/',
      method: 'GET',
      description: 'Verifies if authentication is working'
    },
    { 
      name: 'Patient Profile',
      path: `patient-profile/${user?.id}/`,
      method: 'GET',
      description: 'Tests access to patient profile data'
    },
    { 
      name: 'Vaccines List',
      path: 'vaccines/',
      method: 'GET',
      description: 'Tests access to vaccines data'
    }
  ];
  
  // Function to get token
  const getToken = () => {
    try {
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) return null;
      
      const authTokens = JSON.parse(authTokensStr);
      return authTokens?.access || null;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };
  
  // Run comprehensive test across all configured endpoints and auth types
  const runComprehensiveTest = async () => {
    setLoading(true);
    setResults([]);
    
    // First check for double slash issues in endpoints
    const doubleSlashIssues = endpoints.filter(endpoint => 
      endpoint.path.includes('//') || 
      (endpoint.path.endsWith('/') && endpoint.path.split('/').length > 2 && endpoint.path.includes('undefined'))
    );
    
    // Create initial results with double slash check
    const initialResults = [];
    if (doubleSlashIssues.length > 0) {
      initialResults.push({
        id: Date.now(),
        success: false,
        title: 'URL Format Check - FAILED',
        message: `Warning: ${doubleSlashIssues.length} endpoints have double slash issues that may cause CORS problems`,
        details: doubleSlashIssues.map(e => e.path).join(', '),
        timestamp: new Date().toISOString()
      });
    } else {
      initialResults.push({
        id: Date.now(),
        success: true,
        title: 'URL Format Check - SUCCESS',
        message: 'No double slash issues detected in endpoints',
        timestamp: new Date().toISOString()
      });
    }
    
    const token = getToken();
    if (!token) {
      setResults([
        ...initialResults,
        {
          id: Date.now() + 1,
          success: false,
          title: 'Authentication Error',
          message: 'No authentication token available',
          timestamp: new Date().toISOString()
        }
      ]);
      setLoading(false);
      return;
    }
    
    // Create all test combinations
    const testCombinations = [];
    
    for (const endpoint of endpoints) {
      for (const headerType of headerTypes.filter(h => h.enabled)) {
        testCombinations.push({
          endpoint,
          headerType
        });
      }
    }
    
    // Execute all tests sequentially
    const newResults = [];
    
    for (const test of testCombinations) {
      const { endpoint, headerType } = test;
      const url = `${baseUrl}/${endpoint.path}`;
      
      try {
        console.log(`Testing ${endpoint.method} ${url} with ${headerType.format} authentication`);
        
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (headerType.id !== 'none') {
          headers['Authorization'] = `${headerType.format} ${token}`;
        }
        
        const response = await axios({
          method: endpoint.method,
          url,
          headers
        });
        
        newResults.push({
          id: Date.now() + Math.random(),
          success: true,
          title: `${endpoint.name} - SUCCESS`,
          endpoint: endpoint.path,
          authType: headerType.format,
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          timestamp: new Date().toISOString(),
          headers: response.headers
        });
        
      } catch (error) {
        newResults.push({
          id: Date.now() + Math.random(),
          success: false,
          title: `${endpoint.name} - FAILED`,
          endpoint: endpoint.path,
          authType: headerType.format,
          status: error.response?.status,
          statusText: error.response?.statusText,
          error: error.message,
          errorData: error.response?.data,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    setResults([...initialResults, ...newResults]);
    setLoading(false);
  };
  
  // Filter results based on success/failure
  const filteredResults = showSuccessOnly 
    ? results.filter(r => r.success) 
    : results;
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-amber-800 mb-4">API Connection Tester</h2>
      
      {/* Token Information Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Authentication Token Information</h3>
        
        {tokenDetails ? (
          tokenDetails.error ? (
            <div className="text-red-600">{tokenDetails.error}</div>
          ) : (
            <div>
              <p><strong>Token Length:</strong> {tokenDetails.token.length} characters</p>
              <p><strong>Token Preview:</strong> {tokenDetails.token.prefix}{tokenDetails.token.suffix}</p>
              
              {tokenDetails.payload && (
                <div className="mt-2">
                  <p><strong>User ID:</strong> {tokenDetails.payload.user_id}</p>
                  {tokenDetails.payload.email && <p><strong>Email:</strong> {tokenDetails.payload.email}</p>}
                  
                  {tokenDetails.expiryInfo && (
                    <div className={`mt-2 ${tokenDetails.expiryInfo.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                      <p>
                        <strong>Expiry:</strong> {tokenDetails.expiryInfo.isExpired 
                          ? `Expired at ${tokenDetails.expiryInfo.expiryDate}` 
                          : `Valid until ${tokenDetails.expiryInfo.expiryDate}`
                        }
                      </p>
                      {!tokenDetails.expiryInfo.isExpired && (
                        <p><strong>Time Remaining:</strong> {Math.floor(tokenDetails.expiryInfo.timeRemaining / 60)} minutes</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        ) : (
          <p>Loading token information...</p>
        )}
      </div>
      
      {/* Configuration Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Test Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Authentication Header Types
            </label>
            <div className="flex flex-wrap gap-3">
              {headerTypes.map(headerType => (
                <label key={headerType.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={headerType.enabled}
                    onChange={() => {
                      setHeaderTypes(headerTypes.map(h => 
                        h.id === headerType.id ? {...h, enabled: !h.enabled} : h
                      ));
                    }}
                    className="mr-1"
                  />
                  <span>{headerType.format}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            onClick={runComprehensiveTest}
            disabled={loading}
            className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Run Comprehensive Tests'}
          </button>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showSuccessOnly}
              onChange={() => setShowSuccessOnly(!showSuccessOnly)}
              className="mr-2"
            />
            <span>Show successful tests only</span>
          </label>
        </div>
      </div>
      
      {/* Results Section */}
      {filteredResults.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Test Results</h3>
          
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auth Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map(result => (
                  <tr key={result.id} className={result.success ? "bg-green-50" : "bg-red-50"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.endpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.authType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.status} {result.statusText}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {result.success ? (
                        <details>
                          <summary>View Response</summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded-md overflow-auto max-h-40">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <details>
                          <summary>View Error</summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded-md overflow-auto max-h-40">
                            {JSON.stringify(result.errorData || result.error, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Summary of findings */}
      {results.length > 0 && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Authentication Findings</h3>
          
          <div className="space-y-2">
            {endpoints.map(endpoint => {
              const endpointResults = results.filter(r => r.endpoint === endpoint.path);
              const successfulAuths = endpointResults
                .filter(r => r.success)
                .map(r => r.authType);
              
              return (
                <div key={endpoint.path} className="border-b pb-2">
                  <p className="font-medium">{endpoint.name} ({endpoint.path}):</p>
                  {successfulAuths.length > 0 ? (
                    <>
                      <p className="text-green-600">
                        Working authentication types: {successfulAuths.join(', ')}
                      </p>
                      <p className="text-sm">
                        Recommendation: Use {successfulAuths[0]} format for this endpoint.
                      </p>
                    </>
                  ) : (
                    <p className="text-red-600">
                      No successful authentication methods found for this endpoint.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Overall recommendation */}
          <div className="mt-4 pt-2 border-t">
            <p className="font-medium">Overall Recommendation:</p>
            
            {(() => {
              // Count successes per auth type
              const authSuccessCounts = {};
              headerTypes.forEach(h => {
                authSuccessCounts[h.format] = results.filter(
                  r => r.success && r.authType === h.format
                ).length;
              });
              
              // Find the most successful auth type
              const authSuccessesSorted = Object.entries(authSuccessCounts)
                .sort((a, b) => b[1] - a[1])
                .filter(([, count]) => count > 0);
              
              if (authSuccessesSorted.length > 0) {
                const [bestFormat, bestCount] = authSuccessesSorted[0];
                return (
                  <p className="text-sm">
                    <strong className="text-green-600">{bestFormat}</strong> authentication format works best across all endpoints 
                    ({bestCount} successful tests). However, some endpoints may require different authentication formats.
                  </p>
                );
              } else {
                return (
                  <p className="text-sm text-red-600">
                    No successful authentication methods found across any endpoints. Please check if your token is valid.
                  </p>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTester; 