import React, { useState, useEffect } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import { getDoctorProfile, updateDoctorProfile } from './api';
import ProfileFormField from './ProfileFormField';

const DoctorProfileEdit = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  
  // Form fields state
  const [formData, setFormData] = useState({
    phone_number: '',
    nid: '',
    first_name: '',
    last_name: '',
    address: '',
    email: '',
    specialization: '',
    profile_picture: null
  });
  
  // Field errors
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Load initial profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const result = await getDoctorProfile(user.id);
          
          if (result.success) {
            const profileData = result.data;
            console.log('Profile data from API:', profileData);
            setFormData({
              phone_number: profileData.phone_number || '',
              nid: profileData.nid || '',
              first_name: profileData.first_name || '',
              last_name: profileData.last_name || '',
              address: profileData.address || '',
              email: profileData.email || '',
              specialization: profileData.specialization || '',
              profile_picture: null // Don't set file input value
            });
            
            // If there's a profile picture URL, show it as preview
            if (profileData.profile_picture) {
              setProfilePicturePreview(profileData.profile_picture);
            }
          } else {
            setError('Failed to load profile data. Please try again.');
          }
        } catch (err) {
          console.error('Error loading profile:', err);
          setError('An error occurred while loading your profile data.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProfileData();
  }, [user]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_picture: file
      }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
      
      // Clear field error if exists
      if (fieldErrors.profile_picture) {
        setFieldErrors(prev => ({
          ...prev,
          profile_picture: null
        }));
      }
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    // Example validation rules based on API requirements
    if (!formData.phone_number) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^\d{11}$/.test(formData.phone_number)) {
      errors.phone_number = 'Phone number must be 11 digits';
    }
    
    if (!formData.nid) {
      errors.nid = 'NID is required';
    } else if (!/^\d{10,17}$/.test(formData.nid)) {
      errors.nid = 'NID must be between 10-17 digits';
    }
    
    if (!formData.first_name) {
      errors.first_name = 'First name is required';
    } else if (formData.first_name.length > 50) {
      errors.first_name = 'First name cannot exceed 50 characters';
    }
    
    if (!formData.last_name) {
      errors.last_name = 'Last name is required';
    } else if (formData.last_name.length > 50) {
      errors.last_name = 'Last name cannot exceed 50 characters';
    }
    
    if (formData.address && formData.address.length > 200) {
      errors.address = 'Address cannot exceed 200 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.specialization && formData.specialization.length > 100) {
      errors.specialization = 'Specialization cannot exceed 100 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setSuccess(null);
    setError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Create FormData object for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Debug log for form data being sent
      console.log('Form data being sent to API:', Object.fromEntries(submitData.entries()));
      
      const result = await updateDoctorProfile(user.id, submitData);
      console.log('API response after update:', result);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        // Scroll to top to show success message
        window.scrollTo(0, 0);
      } else {
        if (result.error && typeof result.error === 'object') {
          // Handle field-specific errors from API
          const apiErrors = {};
          Object.keys(result.error).forEach(key => {
            apiErrors[key] = Array.isArray(result.error[key]) 
              ? result.error[key][0]
              : result.error[key];
          });
          setFieldErrors(apiErrors);
        } else {
          setError('Failed to update profile. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        <span className="ml-2 text-black">Loading profile...</span>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6 text-black">
      <h2 className="text-xl font-semibold text-black mb-4">Update Profile</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileFormField
            id="phone_number"
            label="Phone Number"
            value={formData.phone_number}
            onChange={handleInputChange}
            required={true}
            minLength={11}
            maxLength={11}
            placeholder="01XXXXXXXXX"
            error={fieldErrors.phone_number}
          />
          
          <ProfileFormField
            id="nid"
            label="NID Number"
            value={formData.nid}
            onChange={handleInputChange}
            required={true}
            minLength={10}
            maxLength={17}
            placeholder="Enter your NID number"
            error={fieldErrors.nid}
          />
          
          <ProfileFormField
            id="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
            required={true}
            maxLength={50}
            placeholder="Enter your first name"
            error={fieldErrors.first_name}
          />
          
          <ProfileFormField
            id="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
            required={true}
            maxLength={50}
            placeholder="Enter your last name"
            error={fieldErrors.last_name}
          />
          
          <ProfileFormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required={true}
            placeholder="Enter your email address"
            error={fieldErrors.email}
          />
          
          <div className="md:col-span-2">
            <ProfileFormField
              id="address"
              label="Address"
              type="textarea"
              value={formData.address}
              onChange={handleInputChange}
              maxLength={200}
              placeholder="Enter your address"
              error={fieldErrors.address}
            />
          </div>
          
          <ProfileFormField
            id="specialization"
            label="Specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            maxLength={100}
            placeholder="Enter your medical specialization"
            error={fieldErrors.specialization}
          />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture
            </label>
            
            {profilePicturePreview && (
              <div className="mb-2">
                <img 
                  src={profilePicturePreview} 
                  alt="Profile preview" 
                  className="w-32 h-32 object-cover rounded-full border border-gray-200"
                />
              </div>
            )}
            
            <input
              id="profile_picture"
              name="profile_picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full px-3 py-2 border ${fieldErrors.profile_picture ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500`}
            />
            
            {fieldErrors.profile_picture && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.profile_picture}</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mr-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfileEdit; 