import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://nirapod-tika-sub.vercel.app/api/v1/",
    // baseURL: "http://127.0.0.1:8000/api/v1/",
});

// Function to get a fresh token from localStorage
const getFreshToken = () => {
    try {
        const authTokensStr = localStorage.getItem('authTokens');
        if (!authTokensStr) {
            console.warn('No auth tokens found in localStorage');
            return null;
        }
        
        const authTokens = JSON.parse(authTokensStr);
        if (!authTokens?.access) {
            console.warn('No access token found in auth tokens');
            return null;
        }
        
        return authTokens.access;
    } catch (error) {
        console.error('Error getting fresh token:', error);
        return null;
    }
};

// Add authentication interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Always get a fresh token from localStorage for each request
        const token = getFreshToken();
        
        if (token) {
            // Check if the URL contains 'patient-profile'
            if (config.url && config.url.includes('patient-profile')) {
                // Use JWT format for patient profile endpoints
                config.headers.Authorization = `JWT ${token}`;
                console.log('Auth: Added JWT format for patient-profile endpoint');
            } else {
                // Use JWT format for all other endpoints
                config.headers.Authorization = `JWT ${token}`;
                console.log('Auth: Added JWT format for standard endpoint');
            }
            
            // Always include Content-Type for authenticated requests
            if (!config.headers['Content-Type'] && config.method !== 'get') {
                config.headers['Content-Type'] = 'application/json';
            }
        } else {
            console.warn('No token available for request:', config.url);
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add request interceptor for debugging
apiClient.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            data: config.data,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            } : 'No response',
            request: error.request ? 'Request was made but no response received' : 'Error setting up request'
        });
        return Promise.reject(error);
    }
);

export default apiClient;