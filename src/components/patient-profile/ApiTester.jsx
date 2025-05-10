import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthContext from '../../hooks/useAuthContext';

const ApiTester = () => {
  const { user } = useAuthContext();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState('patient-profile');
  const [authType, setAuthType] = useState('JWT');
  const [requestMethod, setRequestMethod] = useState('GET');
  const [requestData, setRequestData] = useState('{}');
  const [baseUrl, setBaseUrl] = useState('https://nirapod-tika-sub.vercel.app/api/v1');
  
  const getToken = () => {
    try {
      const authTokensStr = localStorage.getItem('authTokens');
      if (!authTokensStr) return null;
      
      const authTokens = JSON.parse(authTokensStr);
      return authTokens?.access || null;
    } catch (error) {
      console.error('Error parsing auth tokens:', error);
      return null;
    }
  };
  
  const endpoints = [
    { id: 'patient-profile', label: 'Patient Profile', url: `patient-profile/${user?.id}/` },
    { id: 'users-me', label: 'Users Me', url: 'auth/users/me/' },
    { id: 'vaccine-list', label: 'Vaccine List', url: 'vaccines/' },
    { id: 'custom', label: 'Custom Endpoint', url: '' }
  ];
  
  const authTypes = [
    { id: 'JWT', label: 'JWT Authentication' },
    { id: 'Token', label: 'Token Authentication' },
    { id: 'None', label: 'No Authentication' }
  ];
  
  const methods = [
    { id: 'GET', label: 'GET' },
    { id: 'POST', label: 'POST' },
    { id: 'PATCH', label: 'PATCH' },
    { id: 'PUT', label: 'PUT' },
    { id: 'DELETE', label: 'DELETE' }
  ];
  
  const runTest = async () => {
    setLoading(true);
    
    try {
      // Prepare endpoint URL
      let endpointUrl = '';
      const selectedEndpointObj = endpoints.find(e => e.id === selectedEndpoint);
      
      if (selectedEndpoint === 'custom') {
        // For custom endpoint, use the input field
        const customEndpoint = document.getElementById('custom-endpoint').value;
        endpointUrl = customEndpoint.startsWith('/') 
          ? customEndpoint.substring(1) 
          : customEndpoint;
      } else {
        // For predefined endpoints
        endpointUrl = selectedEndpointObj.url;
      }
      
      const fullUrl = `${baseUrl}/${endpointUrl}`;
      
      // Prepare headers
      let headers = {
        'Content-Type': 'application/json'
      };
      
      const token = getToken();
      if (token && authType !== 'None') {
        headers['Authorization'] = `${authType} ${token}`;
      }
      
      // Prepare data for POST, PUT, PATCH requests
      let data = {};
      if (['POST', 'PUT', 'PATCH'].includes(requestMethod)) {
        try {
          data = JSON.parse(requestData);
        } catch (e) {
          console.error('Invalid JSON input:', e);
          setTestResults([
            {
              id: Date.now(),
              success: false,
              title: 'JSON Parse Error',
              message: `Invalid JSON input: ${e.message}`,
              data: null,
              request: { url: fullUrl, method: requestMethod, headers, data: requestData }
            },
            ...testResults
          ]);
          setLoading(false);
          return;
        }
      }
      
      // Make the API request
      console.log(`Making ${requestMethod} request to ${fullUrl}`);
      console.log('Headers:', headers);
      if (['POST', 'PUT', 'PATCH'].includes(requestMethod)) {
        console.log('Data:', data);
      }
      
      let response;
      switch (requestMethod) {
        case 'GET':
          response = await axios.get(fullUrl, { headers });
          break;
        case 'POST':
          response = await axios.post(fullUrl, data, { headers });
          break;
        case 'PUT':
          response = await axios.put(fullUrl, data, { headers });
          break;
        case 'PATCH':
          response = await axios.patch(fullUrl, data, { headers });
          break;
        case 'DELETE':
          response = await axios.delete(fullUrl, { headers });
          break;
        default:
          throw new Error(`Unsupported method: ${requestMethod}`);
      }
      
      // Add successful result
      setTestResults([
        {
          id: Date.now(),
          success: true,
          title: `${requestMethod} ${endpointUrl} - Success (${response.status})`,
          message: 'Request successful',
          data: response.data,
          request: { url: fullUrl, method: requestMethod, headers, data: requestMethod !== 'GET' ? data : null }
        },
        ...testResults
      ]);
    } catch (error) {
      console.error('API request failed:', error);
      
      setTestResults([
        {
          id: Date.now(),
          success: false,
          title: `${requestMethod} ${selectedEndpoint} - Failed`,
          message: error.message,
          data: error.response?.data || null,
          status: error.response?.status,
          statusText: error.response?.statusText,
          is500Error: error.response?.status === 500,
          errorHint: error.response?.status === 500 ? 
            'Server 500 error suggests a backend issue. Try: 1) Different auth format, 2) JSON instead of FormData, 3) Removing file uploads, or 4) Contact backend team.' : 
            undefined,
          request: { 
            url: `${baseUrl}/${selectedEndpoint === 'custom' ? document.getElementById('custom-endpoint').value : endpoints.find(e => e.id === selectedEndpoint).url}`, 
            method: requestMethod,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authType !== 'None' ? `${authType} ${getToken()}` : undefined
            },
            data: requestMethod !== 'GET' ? requestData : null
          }
        },
        ...testResults
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-amber-800 mb-4">API Tester</h2>
      
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
            Endpoint
          </label>
          <select 
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            {endpoints.map(endpoint => (
              <option key={endpoint.id} value={endpoint.id}>
                {endpoint.label}: {endpoint.url}
              </option>
            ))}
          </select>
          
          {selectedEndpoint === 'custom' && (
            <input
              id="custom-endpoint"
              type="text"
              placeholder="Enter custom endpoint (e.g., patient-profile/123/)"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Authentication Type
          </label>
          <select 
            value={authType}
            onChange={(e) => setAuthType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            {authTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Request Method
          </label>
          <select 
            value={requestMethod}
            onChange={(e) => setRequestMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            {methods.map(method => (
              <option key={method.id} value={method.id}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
        
        {['POST', 'PUT', 'PATCH'].includes(requestMethod) && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Body (JSON)
            </label>
            <textarea
              value={requestData}
              onChange={(e) => setRequestData(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm"
            />
          </div>
        )}
      </div>
      
      <button 
        onClick={runTest}
        disabled={loading}
        className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-75 disabled:cursor-not-allowed mb-4"
      >
        {loading ? 'Testing...' : 'Run API Test'}
      </button>
      
      {testResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Test Results</h3>
          <div className="space-y-3">
            {testResults.map(result => (
              <div 
                key={result.id} 
                className={`p-4 rounded-md border ${result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}
              >
                <h4 className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.title}
                </h4>
                <p className="mt-1">{result.message}</p>
                
                {/* Display error details */}
                {result.status && (
                  <p><strong>Status:</strong> {result.status} {result.statusText}</p>
                )}
                
                {/* 500 Error Helper */}
                {result.is500Error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-medium text-red-800">Server Error (500) Troubleshooting:</p>
                    <p className="text-xs text-red-700 mt-1">{result.errorHint}</p>
                  </div>
                )}
                
                <div className="mt-2">
                  <h5 className="font-medium text-gray-700 mb-1">Request:</h5>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.request, null, 2)}
                  </pre>
                </div>
                
                {result.data && (
                  <div className="mt-2">
                    <h5 className="font-medium text-gray-700 mb-1">Response:</h5>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTester; 