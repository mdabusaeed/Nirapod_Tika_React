import React from 'react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ user }) => {
  // Debug logs
  console.log('User in ProfileHeader:', user);
  console.log('User role:', user?.role);
  
  // Check if user is a doctor or admin by user_type or any available field
  // This check is intentionally broad to catch any way the backend might indicate a doctor or admin
  // For testing, we're forcing canEditProfile to true
  const canEditProfile = true; // Force to true for testing
  
  // Original logic (commented out for testing)
  /*
  const canEditProfile = user && (
    user.is_doctor || 
    user.is_staff || 
    user.is_admin || 
    user.user_type === 'doctor' || 
    user.user_type === 'admin' ||
    user.role === 'doctor' ||
    user.role === 'admin'
  );
  */
  
  console.log('canEditProfile:', canEditProfile);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="bg-amber-600 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Your Profile</h1>
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 text-3xl font-bold mb-4 md:mb-0 md:mr-6">
            {user.first_name ? user.first_name.charAt(0) : user.email.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'User'}
            </h2>
            {user.email && <p className="text-gray-600">{user.email}</p>}
            {user.phone_number && <p className="text-gray-600">{user.phone_number}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/schedules" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md">
                Schedule Vaccination
              </Link>
              
              {canEditProfile ? (
                <Link to="/profile/edit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md">
                  Edit Profile
                </Link>
              ) : (
                <Link to="/profile/patient/edit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md">
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 