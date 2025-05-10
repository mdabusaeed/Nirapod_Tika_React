import React from 'react';
import { Link } from 'react-router-dom';

const NoSchedulesMessage = () => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-4">You don't have any vaccination schedules yet.</p>
      <Link to="/schedules" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md">
        Schedule Your First Vaccination
      </Link>
    </div>
  );
};

export default NoSchedulesMessage; 