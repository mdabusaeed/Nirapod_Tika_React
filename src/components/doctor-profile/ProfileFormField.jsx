import React from 'react';

const ProfileFormField = ({ 
  id, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  minLength, 
  maxLength, 
  placeholder,
  error
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-black mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          value={value || ''}
          onChange={onChange}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black`}
          rows={4}
        />
      ) : type === 'file' ? (
        <input
          id={id}
          name={id}
          type="file"
          onChange={onChange}
          required={required}
          accept="image/*"
          className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value || ''}
          onChange={onChange}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black`}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {(minLength || maxLength) && !error && (
        <p className="mt-1 text-xs text-black">
          {minLength && `Min ${minLength} characters`}
          {minLength && maxLength && ' • '}
          {maxLength && `Max ${maxLength} characters`}
        </p>
      )}
    </div>
  );
};

export default ProfileFormField; 