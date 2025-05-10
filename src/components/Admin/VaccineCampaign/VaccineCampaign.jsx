import React, { useState } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import AddCampaignForm from './AddCampaignForm';

const VaccineCampaign = ({ campaigns, setCampaigns }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const getStatusBadge = (status) => {
    const badgeColors = {
      'Ongoing': 'bg-green-500',
      'Upcoming': 'bg-yellow-500',
      'Planned': 'bg-blue-500',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${badgeColors[status] || 'bg-gray-500'}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Vaccine Campaigns</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus className="mr-2" /> Add New Campaign
        </button>
      </div>
      
      {/* Add Campaign Form Modal */}
      {showAddForm && (
        <AddCampaignForm 
          onClose={() => setShowAddForm(false)} 
          onCampaignAdded={(newCampaign) => {
            setCampaigns([...campaigns, newCampaign]);
          }} 
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Group</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccines</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.endDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.target}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.vaccines.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(campaign.status)}</td>
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

export default VaccineCampaign;
