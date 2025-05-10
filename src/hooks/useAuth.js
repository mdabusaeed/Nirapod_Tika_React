import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api-client";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [errorMassage, setErrorMassage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Improved token getter with better error handling and logging
    const getToken = () => {
        try {
            const tokenString = localStorage.getItem('authTokens');
            console.log('Raw token from localStorage:', tokenString);
            
            if (!tokenString) {
                console.log('No tokens found in localStorage');
                return null;
            }
            
            // Try to parse the token
            const parsedToken = JSON.parse(tokenString);
            console.log('Parsed token:', parsedToken);
            
            // Validate token structure
            if (!parsedToken || !parsedToken.access || !parsedToken.refresh) {
                console.warn('Invalid token structure in localStorage');
                // Clean up invalid token
                localStorage.removeItem('authTokens');
                return null;
            }
            
            return parsedToken;
        } catch (error) {
            console.error('Error getting token from localStorage:', error);
            // Clean up on parse error
            localStorage.removeItem('authTokens');
            return null;
        }
    }

    const [authTokens, setAuthTokens] = useState(getToken());

    // Function to refresh token
    const refreshToken = async () => {
        try {
            console.log('Attempting to refresh token');
            const token = getToken();
            if (token) {
                console.log('Refresh token being used:', token.refresh);
                const response = await apiClient.post("auth/jwt/refresh/", { refresh: token.refresh });
                if (response.data) {
                    const newTokens = {
                        access: response.data.access,
                        refresh: token.refresh
                    };
                    console.log('New tokens after refresh:', newTokens);
                    setAuthTokens(newTokens);
                    
                    // Try-catch for localStorage operations
                    try {
                        localStorage.setItem('authTokens', JSON.stringify(newTokens));
                        console.log('Successfully saved new tokens to localStorage');
                    } catch (storageError) {
                        console.error('Failed to save tokens to localStorage:', storageError);
                    }
                    
                    return newTokens;
                }
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            console.error('Error response:', error.response?.data);
            setAuthTokens(null);
            localStorage.removeItem('authTokens');
            navigate('/login');
        }
    };

    //Fetch user profile
    const fetchUserProfile = async () => {
        setErrorMassage("");
        try {
            console.log('Fetching user profile with token:', authTokens?.access);
            const response = await apiClient.get("auth/users/me/", {
                headers: {
                    'Authorization': `JWT ${authTokens?.access}`
                }
            });
            console.log('User Profile Data:', response.data);
            setUser(response.data);
        } catch (error) {
            console.error('Profile fetch failed:', error);
            if (error.response?.status === 401) {
                console.log('401 error, attempting token refresh');
                const newTokens = await refreshToken();
                if (newTokens) {
                    console.log('Retrying profile fetch with new token');
                    try {
                        const response = await apiClient.get("auth/users/me/", {
                            headers: {
                                'Authorization': `JWT ${newTokens.access}`
                            }
                        });
                        console.log('User Profile Data after refresh:', response.data);
                        setUser(response.data);
                    } catch (retryError) {
                        console.error('Profile fetch failed after token refresh:', retryError);
                        setErrorMassage('Failed to fetch user profile after token refresh');
                        setUser(null);
                    }
                }
            } else {
                setErrorMassage(error.response?.data?.detail || 'Failed to fetch user profile');
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (authTokens) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [authTokens]);

    //Register user
    const registerUser = async (userData) => {
        setErrorMassage("");
        try {
            // Format user data according to API requirements
            const requestData = {
                email: userData.email,
                phone_number: userData.phone_number,
                nid: userData.nid,
                password: userData.password,
                // Include additional fields based on API requirements
                first_name: userData.first_name,
                last_name: userData.last_name,
                address: userData.address
            };
            
            // Print request data for debugging
            console.log("Register Request:", requestData);
            
            const response = await apiClient.post("auth/users/", requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            
            console.log("Register Response:", response.data);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            console.error('Error Data:', error.response?.data);
            console.error('Error Status:', error.response?.status);
            
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.phone_number) {
                    setErrorMassage(errorData.phone_number[0]);
                } else if (errorData.password) {
                    setErrorMassage(errorData.password[0]);
                } else if (errorData.email) {
                    setErrorMassage(errorData.email[0]);
                } else if (errorData.non_field_errors) {
                    setErrorMassage(errorData.non_field_errors[0]);
                } else if (typeof errorData === 'object') {
                    // Handle case where errorData is an object with error messages
                    const errorMessage = Object.values(errorData).flat().join(', ');
                    setErrorMassage(errorMessage);
                } else {
                    setErrorMassage('Registration failed. Please try again.');
                }
            } else {
                setErrorMassage('Registration failed. Please try again.');
            }
            throw error;
        }
    }

    // Update user profile
    const updateUserProfile = async (userData) => {
        setErrorMassage("");
        try {
            const response = await apiClient.put("auth/users/me/", userData, {
                headers: {
                    'Authorization': `JWT ${authTokens?.access}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    };

    //Update user password
    const updateUserPassword = async (passwordData) => {
        setErrorMassage("");
        try {
            const response = await apiClient.post("auth/users/set_password/", passwordData);
            setErrorMassage("Password updated successfully!");
            return response.data;
        } catch (error) {
            console.error('Password update failed:', error);
            if (error.response?.data?.current_password) {
                setErrorMassage("Current password is incorrect");
            } else if (error.response?.data?.new_password) {
                setErrorMassage("New password is invalid. Please try a different password.");
            } else {
                setErrorMassage("Failed to update password. Please try again.");
            }
            throw error;
        }
    };

    //Login user
    const loginUser = async (userData) => {
        setLoading(true);
        setErrorMassage("");
        
        const loginEndpoint = "auth/jwt/create/";
        const originalInputValue = userData.phone_number.trim();
        const password = userData.password;
        
        // Format phone number (add Bangladesh country code if it starts with 0)
        let formattedPhoneNumber = originalInputValue;
        if (originalInputValue.startsWith('01') && !originalInputValue.startsWith('+880')) {
            // Convert to Bangladesh international format (+88)
            formattedPhoneNumber = "+880" + originalInputValue.substring(1);
            console.log(`Converted phone format from ${originalInputValue} to ${formattedPhoneNumber}`);
        }
        
        // Only use phone number for login
        const loginData = {
            phone_number: originalInputValue,
            password: password
        };
        
        let error = null;
        
        try {
            console.log('Attempting login with:', loginData);
            
            const response = await apiClient.post(loginEndpoint, loginData, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            
            console.log('Login Response:', response.data);
            
            if (response.data?.access && response.data?.refresh) {
                const tokens = {
                    access: response.data.access,
                    refresh: response.data.refresh
                };
                
                // Set tokens in state
                setAuthTokens(tokens);
                
                // Save tokens to localStorage
                try {
                    localStorage.setItem('authTokens', JSON.stringify(tokens));
                    console.log('Saved tokens to localStorage');
                } catch (storageError) {
                    console.error('Error saving tokens to localStorage:', storageError);
                }
                
                // Fetch user profile
                try {
                    await fetchUserProfile();
                } catch (profileError) {
                    console.error('Error fetching profile after login:', profileError);
                }
                
                // Success! Return and exit the function
                setLoading(false);
                return { success: true };
            }
        } catch (err) {
            console.log(`Login attempt failed:`, loginData);
            console.error('Error:', err.response?.data || err.message);
            error = err;
        }
        
        // If we got here, login attempt failed
        if (error) {
            console.error('Login attempt failed. Error:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.data) {
                const errorData = error.response.data;
                
                if (errorData.detail) {
                    if (errorData.detail === 'No active account found with the given credentials') {
                        setErrorMassage(
                            "Account not found. Please check if: 1) You need to register first, 2) Your credentials are correct, or 3) Your account is activated."
                        );
                    } else {
                        setErrorMassage(errorData.detail);
                    }
                } else if (errorData.phone_number) {
                    setErrorMassage(Array.isArray(errorData.phone_number) ? errorData.phone_number[0] : errorData.phone_number);
                } else if (errorData.password) {
                    setErrorMassage(Array.isArray(errorData.password) ? errorData.password[0] : errorData.password);
                } else if (errorData.email) {
                    setErrorMassage(Array.isArray(errorData.email) ? errorData.email[0] : errorData.email);
                } else {
                    setErrorMassage("Login failed. Please check your credentials and try again.");
                }
            } else {
                setErrorMassage("Login failed. Please try again.");
            }
        } else {
            setErrorMassage("Unknown error during login. Please try again.");
        }
        
        setLoading(false);
        return { success: false };
    }

    //Logout user
    const logoutUser = async () => {
        try {
            console.log('Logging out user');
            // Clear localStorage with error handling
            try {
                localStorage.removeItem('authTokens');
                console.log('Auth tokens removed from localStorage');
            } catch (storageError) {
                console.error('Error removing tokens from localStorage:', storageError);
            }
            
            setUser(null);
            setAuthTokens(null);
            setErrorMassage("");
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setErrorMassage('Logout failed. Please try again.');
        }
    }

    //forgot password
    const forgotPassword = async (email) => {
        try {
            const response = await apiClient.post("auth/users/reset_password/", { email });
            return response.data;
        } catch (error) {
            console.error('Password reset failed:', error);
            throw error;
        }
    };

    const contextData = {
        user,
        loginUser,
        registerUser,
        logoutUser,
        errorMassage,
        loading,
        updateUserProfile,
        updateUserPassword,
        forgotPassword,
    };

    return contextData;
};

export default useAuth;