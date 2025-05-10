import React from 'react';
import { Link } from 'react-router-dom';

const PersonalInfo = ({ user, formatDate }) => {
  console.log('User data in PersonalInfo:', user); // Debug log to see user data
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="bg-amber-50 px-6 py-3 border-b border-amber-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-amber-800">Personal Information</h2>
        <Link 
          to={user.role === 'doctor' || user.role === 'admin' ? '/profile/edit' : '/profile/patient/edit'} 
          className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </Link>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Full Name</p>
            <p className="text-gray-800 font-medium">
              {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p className="text-gray-800 font-medium">{user.email || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <p className="text-gray-800 font-medium">{user.phone_number || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">NID</p>
            <p className="text-gray-800 font-medium">{user.nid || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Address</p>
            <p className="text-gray-800 font-medium">{user.address || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Account Created</p>
            <p className="text-gray-800 font-medium">
              {user.date_joined ? formatDate(user.date_joined) : 'Not available'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">User Role</p>
            <p className="text-gray-800 font-medium">
              {user.role || 'Not specified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo; 