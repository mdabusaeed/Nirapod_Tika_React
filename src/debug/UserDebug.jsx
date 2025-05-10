import React, { useState, useEffect } from 'react';

const UserDebug = () => {
  const [userData, setUserData] = useState(null);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    // Get all data from localStorage
    try {
      const authTokens = localStorage.getItem('authTokens');
      if (authTokens) {
        setTokenData(JSON.parse(authTokens));
      }
      
      const user = localStorage.getItem('user');
      if (user) {
        setUserData(JSON.parse(user));
      }
    } catch (err) {
      console.error('Error parsing localStorage data:', err);
    }
  }, []);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Debug Information</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Token Data</h2>
        {tokenData ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-black">
            {JSON.stringify(tokenData, null, 2)}
          </pre>
        ) : (
          <p>No token data found in localStorage</p>
        )}
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">User Data</h2>
        {userData ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-black">
            {JSON.stringify(userData, null, 2)}
          </pre>
        ) : (
          <p>No user data found in localStorage</p>
        )}
      </div>
      
      <button 
        onClick={() => {
          localStorage.removeItem('authTokens');
          localStorage.removeItem('user');
          window.location.reload();
        }}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Clear localStorage and Reload
      </button>
    </div>
  );
};

export default UserDebug; 