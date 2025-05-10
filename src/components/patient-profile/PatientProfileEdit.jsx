import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import { getPatientProfile, updatePatientProfile, createPatientProfile } from './api';
import PatientProfileForm from './PatientProfileForm';
import TokenDebugger from './TokenDebugger';
import ApiConnectionTester from './ApiConnectionTester';

const PatientProfileEdit = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [showDebugger, setShowDebugger] = useState(false);
  
  // Form fields state
  const [formData, setFormData] = useState({
    phone_number: '',
    nid: '',
    first_name: '',
    last_name: '',
    address: '',
    email: '',
    medical_details: ''
  });
  
  // Field errors
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Load initial profile data
  useEffect(() => {
    // Debug token structure
    const debugTokenStructure = () => {
      try {
        const authTokensStr = localStorage.getItem('authTokens');
        console.log('DEBUG: Auth tokens from localStorage:', authTokensStr);
        
        if (authTokensStr) {
          const authTokens = JSON.parse(authTokensStr);
          console.log('DEBUG: Parsed auth tokens structure:', {
            hasAccess: !!authTokens?.access,
            hasRefresh: !!authTokens?.refresh,
            tokenType: typeof authTokens?.access
          });
        } else {
          console.warn('DEBUG: No auth tokens found in localStorage');
        }
      } catch (err) {
        console.error('DEBUG: Error parsing auth tokens:', err);
      }
    };
    
    // Call the debug function
    debugTokenStructure();
    
    const fetchProfileData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          console.log('Fetching profile data for user ID:', user.id);
          const result = await getPatientProfile(user.id);
          console.log('Profile fetch result:', result);
          
          if (result.success) {
            // Profile exists
            setProfileExists(true);
            
            // Determine the profile ID - use profile.id if available, otherwise try user.id
            const profileData = result.data;
            let profileIdValue = null;
            
            if (profileData.id !== undefined) {
              profileIdValue = profileData.id;
              console.log('Using profile.id for profile ID:', profileIdValue);
            } else if (profileData.user !== undefined) {
              profileIdValue = profileData.user;
              console.log('Using profile.user for profile ID:', profileIdValue);
            } else if (user?.id) {
              profileIdValue = user.id;
              console.log('Falling back to user.id for profile ID:', profileIdValue);
            }
            
            console.log('Setting profileId:', profileIdValue, 'Type:', typeof profileIdValue);
            setProfileId(profileIdValue);
            
            // Store original data for comparison
            setOriginalData(profileData);
            
            setFormData({
              phone_number: profileData.phone_number || user.phone_number || '',
              nid: profileData.nid || '',
              first_name: profileData.first_name || '',
              last_name: profileData.last_name || '',
              address: profileData.address || '',
              email: profileData.email || user.email || '',
              medical_details: profileData.medical_details || ''
            });
          } else {
            // Profile doesn't exist yet - prepopulate with user data
            setProfileExists(false);
            console.log('Profile does not exist, using user data:', user);
            
            setFormData(prevData => {
              const updatedData = {
                ...prevData,
                phone_number: user.phone_number || '',
                email: user.email || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                nid: user.nid || '',
                address: user.address || ''
              };
              console.log('Initial form data set to:', updatedData);
              return updatedData;
            });
            
            // Store original data for comparison
            setOriginalData({
              phone_number: user.phone_number || '',
              email: user.email || '',
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              nid: user.nid || '',
              address: user.address || '',
              medical_details: ''
            });
          }
        } catch (err) {
          console.error('Error loading patient profile:', err);
          setError('Error loading profile data. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProfileData();
  }, [user]);
  
  // Monitor profileId changes
  useEffect(() => {
    console.log('Current profileId state:', profileId);
  }, [profileId]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change: field=${name}, value=${value}`);
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      console.log('Updated form data:', updated);
      return updated;
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    // No need to validate email and NID for updates
    // We'll only validate if there are any fields to update
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      console.log('Validation errors:', validationErrors);
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Only handle update profile functionality
      // Get only specific fields that should be editable
      const editableFields = ['first_name', 'last_name', 'address', 'medical_details'];
      const changedFields = {};
      
      // Only include fields that have actually changed AND are editable
      editableFields.forEach(field => {
        if (formData[field] !== originalData[field]) {
          changedFields[field] = formData[field];
        }
      });
      
      console.log('Changed fields for update:', changedFields);
      
      // If no fields changed, show a message and return
      if (Object.keys(changedFields).length === 0) {
        setSaving(false);
        setSuccess('No changes detected. Your profile remains the same.');
        return;
      }
      
      // Prepare data
      const submissionData = new FormData();
      
      // Add changed fields to FormData
      Object.keys(changedFields).forEach(key => {
        submissionData.append(key, changedFields[key]);
      });
      
      // Update profile
      console.log('Updating profile with ID:', profileId);
      // Ensure profileId is a number without any colons
      if (!profileId) {
        console.error('Profile ID is undefined, attempting to use user ID instead');
        
        if (user?.id) {
          console.log('Using user ID as fallback for profile ID:', user.id);
          const cleanUserId = String(user.id).replace(/[^0-9]/g, '');
          const result = await updatePatientProfile(cleanUserId, submissionData);
          
          if (result.success) {
            console.log('Profile updated successfully using user ID:', result.data);
            setSuccess('Profile updated successfully!');
            
            // Update original data for future change detection
            setOriginalData(prev => ({
              ...prev,
              ...changedFields
            }));
          } else {
            console.error('Profile update failed using user ID:', result);
            handleApiError(result);
          }
        } else {
          console.error('No user ID available as fallback');
          setError('Could not update profile: Profile ID is missing and no user ID is available. Please try logging out and logging in again.');
        }
        
        setSaving(false);
        return;
      }
      
      const cleanProfileId = String(profileId).replace(/[^0-9]/g, '');
      console.log('Using cleaned profile ID for update:', cleanProfileId);
      const result = await updatePatientProfile(cleanProfileId, submissionData);
      
      if (result.success) {
        console.log('Profile updated successfully:', result.data);
        setSuccess('Profile updated successfully!');
        
        // Update original data for future change detection
        setOriginalData(prev => ({
          ...prev,
          ...changedFields
        }));
      } else {
        console.error('Profile update failed:', result);
        handleApiError(result);
      }
    } catch (err) {
      console.error('Error during form submission:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle API errors
  const handleApiError = (result) => {
    // Extract error messages from API response
    if (result.error && typeof result.error === 'object') {
      // Handle specific uniqueness errors
      if (result.error.nid && 
          typeof result.error.nid === 'string' && 
          result.error.nid.includes('already exists')) {
        setError('A profile with this NID already exists. Please check your information and try again.');
        return;
      }
      
      if (result.error.email && 
          typeof result.error.email === 'string' && 
          result.error.email.includes('already exists')) {
        setError('A profile with this email already exists. Please check your information and try again.');
        return;
      }
      
      // Handle phone number already exists error
      if (result.error.phone_number && 
          typeof result.error.phone_number === 'string' && 
          result.error.phone_number.includes('already exists')) {
        setError('A profile with this phone number already exists. If this is your profile, please try logging in again.');
        return;
      }

      // API returned field-specific errors
      setFieldErrors(result.error);
      setError('Please fix the errors below.');
    } else if (result.status === 401) {
      // Authentication error
      setError('Authentication failed. Please log in again.');
    } else if (result.message) {
      // Specific error message
      setError(result.message);
    } else {
      // Generic error
      setError(result.error || 'An unexpected error occurred. Please try again.');
    }
  };
  
  // Add function to force refresh profile data
  const refreshProfileData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('Force refreshing profile data for user ID:', user?.id);
      if (!user?.id) {
        setError('User ID is missing. Please try logging out and back in.');
        setLoading(false);
        return;
      }
      
      const result = await getPatientProfile(user.id);
      console.log('Profile refresh result:', result);
      
      if (result.success) {
        // Profile exists
        setProfileExists(true);
        
        // Determine the profile ID - use profile.id if available, otherwise try user.id
        const profileData = result.data;
        let profileIdValue = null;
        
        if (profileData.id !== undefined) {
          profileIdValue = profileData.id;
          console.log('Using profile.id for profile ID:', profileIdValue);
        } else if (profileData.user !== undefined) {
          profileIdValue = profileData.user;
          console.log('Using profile.user for profile ID:', profileIdValue);
        } else if (user?.id) {
          profileIdValue = user.id;
          console.log('Falling back to user.id for profile ID:', profileIdValue);
        }
        
        console.log('Setting profileId:', profileIdValue, 'Type:', typeof profileIdValue);
        setProfileId(profileIdValue);
        
        // Store original data for comparison
        setOriginalData(profileData);
        
        setFormData({
          phone_number: profileData.phone_number || user.phone_number || '',
          nid: profileData.nid || '',
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          address: profileData.address || '',
          email: profileData.email || user.email || '',
          medical_details: profileData.medical_details || ''
        });
        
        setSuccess('Profile data refreshed successfully!');
      } else if (result.status === 404) {
        // Profile doesn't exist - try to create one
        console.log('Profile not found. Attempting to create one with user data:', user);
        
        // Create profile data from user info
        const profileData = new FormData();
        if (user.email) profileData.append('email', user.email);
        if (user.phone_number) profileData.append('phone_number', user.phone_number);
        if (user.first_name) profileData.append('first_name', user.first_name);
        if (user.last_name) profileData.append('last_name', user.last_name);
        
        // Use NID if available, or generate a placeholder (backend may reject this)
        const nid = user.nid || `TEMP${Date.now()}`;
        profileData.append('nid', nid);
        
        try {
          const createResult = await createPatientProfile(profileData);
          console.log('Profile creation result:', createResult);
          
          if (createResult.success) {
            // Profile created successfully
            setProfileExists(true);
            
            // Get profile ID from created profile
            const createdProfileData = createResult.data;
            let profileIdValue = null;
            
            if (createdProfileData.id !== undefined) {
              profileIdValue = createdProfileData.id;
              console.log('Using created profile.id for profile ID:', profileIdValue);
            } else if (createdProfileData.user !== undefined) {
              profileIdValue = createdProfileData.user;
              console.log('Using created profile.user for profile ID:', profileIdValue);
            } else if (user?.id) {
              profileIdValue = user.id;
              console.log('Falling back to user.id for created profile ID:', profileIdValue);
            }
            
            console.log('Setting profileId from created profile:', profileIdValue);
            setProfileId(profileIdValue);
            
            // Store original data
            setOriginalData(createdProfileData);
            
            // Update form data
            setFormData({
              phone_number: createdProfileData.phone_number || user.phone_number || '',
              nid: createdProfileData.nid || nid,
              first_name: createdProfileData.first_name || user.first_name || '',
              last_name: createdProfileData.last_name || user.last_name || '',
              address: createdProfileData.address || '',
              email: createdProfileData.email || user.email || '',
              medical_details: createdProfileData.medical_details || ''
            });
            
            setSuccess('Profile created successfully! You can now update your information.');
          } else {
            // Failed to create profile
            setProfileExists(false);
            setError(`Could not create profile: ${createResult.error?.detail || 'Unknown error'}`);
          }
        } catch (createErr) {
          console.error('Error creating profile:', createErr);
          setProfileExists(false);
          setError('Could not create profile. Please try logging out and back in.');
        }
      } else {
        // Some other error
        setProfileExists(false);
        setError('Could not find your profile. Please try logging out and back in.');
      }
    } catch (err) {
      console.error('Error refreshing profile data:', err);
      setError('Error refreshing profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-t-4 border-amber-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Loading profile data...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-800">
          {profileExists ? 'Edit Your Profile' : 'Your Profile'}
        </h1>
        <div>
          <button
            onClick={() => setShowDebugger(!showDebugger)}
            className="text-sm text-gray-500 hover:text-amber-600"
          >
            {showDebugger ? 'Hide Debug Tools' : 'Show Debug Tools'}
          </button>
        </div>
      </div>
      
      {!profileExists && (
        <div className="mb-6 p-4 rounded-md bg-yellow-50 border border-yellow-200">
          <p className="text-yellow-800 font-medium">
            Your profile doesn't seem to exist in our system. Click below to create a profile or log out and log back in.
          </p>
          <button 
            onClick={refreshProfileData}
            className="mt-2 text-sm bg-amber-100 px-3 py-1 rounded-md hover:bg-amber-200"
          >
            Create/Refresh Profile
          </button>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}
      
      {/* Main form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <PatientProfileForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          fieldErrors={fieldErrors}
          saving={saving}
          profileExists={profileExists}
        />
      </div>
      
      {/* Debugging tools */}
      {showDebugger && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h2 className="text-xl font-medium mb-4">Debugging Tools</h2>
          
          <div className="flex flex-col space-y-4">
            <TokenDebugger />
            <ApiConnectionTester />
            
            <div className="p-4 bg-white rounded border border-gray-300">
              <h3 className="font-medium mb-2">Current State</h3>
              <pre className="text-xs overflow-auto max-h-64 bg-gray-100 p-2 rounded">
                {JSON.stringify({
                  profileExists,
                  profileId,
                  formData,
                  originalData,
                  fieldErrors,
                  success,
                  error
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <Link to="/" className="text-amber-600 hover:text-amber-800">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PatientProfileEdit; 