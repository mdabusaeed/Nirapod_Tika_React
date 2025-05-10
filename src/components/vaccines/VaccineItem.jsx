import React from 'react';
import defaultImage from '../../assets/images/default_product.jpg'; 
import { useNavigate } from 'react-router-dom';

const VaccineItem = ({ vaccine }) => {
  const navigate = useNavigate();
  
  const handleBookNow = () => {
    // Navigate to the schedules page with vaccine info as state data
    navigate('/schedules', { 
      state: { 
        selectedVaccine: vaccine,
        fromBookNow: true
      } 
    });
  };
  
  const infoItem = (iconPaths, text, color = 'amber-600') => (
    <div className="flex items-center mb-3">
      <svg className={`w-5 h-5 text-${color} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {iconPaths.map((d, i) => (
          <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
        ))}
      </svg>
      <p className="text-gray-600 text-sm font-medium">{text}</p>
    </div>
  );

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 max-w-sm mx-auto group">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-50 pointer-events-none" />
      <figure className="p-6">
        <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300">
          <img
            src={vaccine.images?.length > 0 ? vaccine.images[0]?.image : defaultImage}
            alt={vaccine.name || 'Vaccine image'}
            className="w-full h-48 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </figure>
      <div className="p-6 pt-0">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate group-hover:text-amber-600 transition-colors duration-300">
          {vaccine.name || 'Untitled Vaccine'}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
          {vaccine.description || 'No description available.'}
        </p>
        {infoItem(
          ['M10 19l-7-7m0 0l7-7m-7 7h18'],
          vaccine.price ? `$${parseFloat(vaccine.price).toFixed(2)}` : 'Price not specified'
        )}
        {infoItem(
          ['M7 16l-4-4m0 0l4-4m-4 4h18'],
          vaccine.manufacturer || 'Manufacturer not specified'
        )}
        {infoItem(
          ['M12 4v16m8-8H4'],
          vaccine.doses_required ? `${vaccine.doses_required} dose(s)` : 'Doses not specified'
        )}
        <button
          onClick={handleBookNow}
          className="inline-block px-6 py-2 mt-4 bg-amber-600 text-white text-sm font-medium rounded-full hover:bg-amber-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default VaccineItem;