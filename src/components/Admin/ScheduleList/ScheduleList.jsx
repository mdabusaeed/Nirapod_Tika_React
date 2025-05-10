import React from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ScheduleList = ({ schedules }) => {
  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Schedule List</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center">
          <FaPlus className="mr-2" /> Add New Schedule
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Slots</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.vaccineName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.slots}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.booked}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                    <FaEye className="mr-1" /> View
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900 inline-flex items-center ml-2">
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 inline-flex items-center ml-2">
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleList;
