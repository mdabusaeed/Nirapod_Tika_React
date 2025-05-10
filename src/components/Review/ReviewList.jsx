import React, { useState, useEffect } from 'react';
import { FaStar, FaPlus } from 'react-icons/fa';
import apiClient from '../../services/api-client';
import AddReviewForm from './AddReviewForm';
import useAuthContext from '../../hooks/useAuthContext';

const ReviewList = ({ vaccineId }) => {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Fetch reviews for a specific vaccine if vaccineId is provided
        const url = vaccineId ? `/review/?vaccine=${vaccineId}` : '/review/';
        const response = await apiClient.get(url);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [vaccineId]);
  
  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const maxRating = 5;
    
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span key={i} className={`text-sm ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
          <FaStar />
        </span>
      );
    }
    
    return stars;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Vaccine Reviews</h2>
        {user && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
          >
            <FaPlus className="mr-2" /> Add Review
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to leave a review!
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-800">{review.user_name || 'Anonymous'}</div>
                  <div className="flex mt-1">{renderStars(review.rating)}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Review Form Modal */}
      {showAddForm && (
        <AddReviewForm 
          onClose={() => setShowAddForm(false)} 
          onReviewAdded={(newReview) => {
            setReviews([newReview, ...reviews]);
          }} 
        />
      )}
    </div>
  );
};

export default ReviewList;
