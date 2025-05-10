import React, { useState } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import AddVaccineForm from './AddVaccineForm';

const VaccineList = ({ vaccines, setVaccines }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Vaccine List</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus className="mr-2" /> Add New Vaccine
        </button>
      </div>
      
      {/* Add Vaccine Form Modal */}
      {showAddForm && (
        <AddVaccineForm 
          onClose={() => setShowAddForm(false)} 
          onVaccineAdded={(newVaccine) => {
            setVaccines([...vaccines, newVaccine]);
          }} 
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dose</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vaccines.map((vaccine) => (
              <tr key={vaccine.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vaccine.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vaccine.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vaccine.manufacturer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vaccine.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vaccine.dose}</td>
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

export default VaccineList;
