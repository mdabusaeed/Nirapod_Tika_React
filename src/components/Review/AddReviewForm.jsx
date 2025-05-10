import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import apiClient from '../../services/api-client';

const AddReviewForm = ({ onClose, onReviewAdded }) => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    vaccine: '',
    rating: 5,
    comment: ''
  });
  
  // Fetch vaccines
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        // Fetch all vaccines
        const vaccinesResponse = await apiClient.get('/vaccines/');
        setVaccines(vaccinesResponse.data);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
        setError('Failed to load vaccines. Please try again later.');
      }
    };
    
    fetchVaccines();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      rating: newRating
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const payload = {
        vaccine: parseInt(formData.vaccine, 10),
        rating: formData.rating,
        comment: formData.comment
      };
      
      console.log('Sending review data:', payload);
      
      const response = await apiClient.post('/review/', payload);
      console.log('Review added successfully:', response.data);
      
      setSuccess('Your review has been submitted successfully!');
      
      // Call the callback to update the parent component
      if (onReviewAdded) {
        onReviewAdded(response.data);
      }
      
      // Close the form after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error adding review:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.detail || error.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    const maxRating = 5;
    
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingChange(i)}
          className={`text-xl focus:outline-none ${i <= formData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          <FaStar />
        </button>
      );
    }
    
    return stars;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Your Review</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vaccine">
              Select Vaccine*
            </label>
            <select
              id="vaccine"
              name="vaccine"
              value={formData.vaccine}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">-- Select a vaccine --</option>
              {vaccines.map(vaccine => (
                <option key={vaccine.id} value={vaccine.id}>
                  {vaccine.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rating*
            </label>
            <div className="flex space-x-1">
              {renderStars()}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
              Your Review*
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Share your experience with this vaccine..."
              required
            />
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
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewForm;
