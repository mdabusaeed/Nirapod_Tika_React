import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import apiClient from '../../../services/api-client';

const AddCampaignForm = ({ onClose, onCampaignAdded }) => {
  const [vaccines, setVaccines] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    vaccines: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch vaccines for the dropdown
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await apiClient.get('/vaccines/');
        setVaccines(response.data);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };
    
    fetchVaccines();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleVaccineChange = (e) => {
    const selectedVaccines = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
    setFormData({
      ...formData,
      vaccines: selectedVaccines
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Format the data according to API requirements
      const payload = {
        name: formData.name,
        description: formData.description,
        location: formData.location || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        vaccines: formData.vaccines
      };
      
      console.log('Sending campaign data:', payload);
      
      const response = await apiClient.post('/vaccine-campaign/', payload);
      console.log('Campaign added successfully:', response.data);
      
      // Call the callback to update the parent component
      if (onCampaignAdded) {
        onCampaignAdded(response.data);
      }
      
      // Close the form
      onClose();
    } catch (error) {
      console.error('Error adding campaign:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.detail || error.response?.data?.message || 'Failed to add campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Vaccine Campaign</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Campaign Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_date">
              Start Date*
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
              End Date*
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vaccines">
              Vaccines*
            </label>
            <select
              id="vaccines"
              name="vaccines"
              multiple
              value={formData.vaccines}
              onChange={handleVaccineChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              {vaccines.map(vaccine => (
                <option key={vaccine.id} value={vaccine.id}>
                  {vaccine.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple vaccines</p>
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCampaignForm;
