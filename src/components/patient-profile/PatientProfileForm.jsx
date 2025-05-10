import React from 'react';

// Add debugging to check if inputs are working
const PatientProfileForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit,
  fieldErrors,
  saving,
  profileExists = true  // Default to true for backward compatibility
}) => {
  // Debug function to test input changes directly
  const debugChange = (name, value) => {
    console.log(`Field '${name}' changed to: ${value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-amber-800 mb-3 pb-2 border-b border-amber-200">
            Personal Information
          </h3>
        </div>
        
        {/* First Name */}
        <div className="col-span-1">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input 
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name || ''}
            onChange={(e) => {
              debugChange('first_name', e.target.value);
              handleInputChange(e);
            }}
            maxLength={150}
            className={`w-full text-black px-3 py-2 border ${fieldErrors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500`}
            placeholder="Enter your first name"
          />
          {fieldErrors.first_name && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.first_name}</p>
          )}
        </div>
        
        {/* Last Name */}
        <div className="col-span-1">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input 
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name || ''}
            onChange={(e) => {
              debugChange('last_name', e.target.value);
              handleInputChange(e);
            }}
            maxLength={150}
            className={`w-full text-black px-3 py-2 border ${fieldErrors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500`}
            placeholder="Enter your last name"
          />
          {fieldErrors.last_name && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.last_name}</p>
          )}
        </div>
        
        {/* Phone Number - Read Only */}
        <div className="col-span-1">
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ''}
            readOnly
            className="w-full px-3 py-2 text-black border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">Phone number cannot be changed</p>
        </div>
        
        {/* Email - Always read-only */}
        <div className="col-span-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            readOnly
            maxLength={254}
            className="w-full px-3 py-2 text-black border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none text-gray-500"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>
        
        {/* NID Number - Always read-only */}
        <div className="col-span-1">
          <label htmlFor="nid" className="block text-sm font-medium text-gray-700 mb-1">
            NID Number
          </label>
          <input
            type="text"
            id="nid"
            name="nid"
            value={formData.nid || ''}
            readOnly
            maxLength={20}
            className="w-full px-3 text-black py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none text-gray-500"
          />
          {fieldErrors.nid && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.nid}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">NID cannot be changed</p>
        </div>
        
        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={(e) => {
              debugChange('address', e.target.value);
              handleInputChange(e);
            }}
            placeholder="Enter your current address"
            rows={2}
            className={`w-full text-black px-3 py-2 border ${fieldErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500`}
          />
          {fieldErrors.address && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>
          )}
        </div>
        
        {/* Medical Details */}
        <div className="md:col-span-2">
          <label htmlFor="medical_details" className="block text-sm font-medium text-gray-700 mb-1">
            Medical Details
          </label>
          <textarea
            id="medical_details"
            name="medical_details"
            value={formData.medical_details || ''}
            onChange={(e) => {
              debugChange('medical_details', e.target.value);
              handleInputChange(e);
            }}
            placeholder="Enter any relevant medical information, allergies, or conditions"
            rows={3}
            className={`w-full text-black px-3 py-2 border ${fieldErrors.medical_details ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500`}
          />
          {fieldErrors.medical_details && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.medical_details}</p>
          )}
        </div>
      </div>
      
      {/* Debugging area */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 text-xs">
        <p className="font-semibold mb-1">Form values (debug):</p>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
      
      {/* Form Actions */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={saving || !profileExists}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : profileExists ? 'Update Profile' : 'Cannot Update Profile'}
        </button>
        {!profileExists && (
          <p className="mt-2 text-xs text-center text-red-600">
            You don't have a profile yet. Please try logging out and back in.
          </p>
        )}
      </div>
      
      {/* Server error messages */}
      {Object.keys(fieldErrors).length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
            {Object.entries(fieldErrors).map(([field, error]) => (
              <li key={field}><strong>{field}:</strong> {error}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default PatientProfileForm; 