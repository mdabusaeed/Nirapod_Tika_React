import React from 'react';
import { Link } from 'react-router-dom';
import CountDown from './CountDown';

const CampaignItem = ({ campaign }) => {
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-amber-900 to-amber-950 rounded-xl shadow-xl overflow-hidden group">
      {/* Highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Campaign timer */}
      <div className="p-4 pb-0">
        <CountDown endDate={campaign.end_date} />
      </div>
      
      <div className="p-6 text-center">
        {/* Campaign title */}
        <h3 className="text-xl font-bold text-amber-100 mb-3 group-hover:text-white transition-colors duration-300">
          {campaign.name || 'Untitled Campaign'}
        </h3>
        
        {/* Campaign description */}
        <p className="text-amber-200/80 text-sm mb-4 line-clamp-3 min-h-[4.5rem]">
          {campaign.description || 'No description available for this vaccination campaign.'}
        </p>
        
        {/* Campaign details */}
        <div className="space-y-3 mb-5">
          {/* Date range */}
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-amber-200 text-sm">
              {campaign.start_date && campaign.end_date
                ? `${formatDate(campaign.start_date)} - ${formatDate(campaign.end_date)}`
                : 'Date not specified'}
            </p>
          </div>
          
          {/* Location */}
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-amber-200 text-sm">
              {campaign.location || 'Location not specified'}
            </p>
          </div>
          
          {/* Vaccines */}
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="text-amber-200 text-sm">
              {campaign.vaccines || 'Vaccines not specified'}
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 justify-center mb-3">
          <Link
            to={`/campaign/${campaign.id}`}
            className="px-4 py-2 bg-amber-600/80 text-white text-sm font-medium rounded-md hover:bg-amber-600 transition-colors duration-200"
          >
            Learn More
          </Link>
          <Link
            to="/schedules"
            state={{ selectedCampaign: campaign, fromCampaign: true }}
            className="px-4 py-2 bg-amber-500/80 text-white text-sm font-medium rounded-md hover:bg-amber-500 transition-colors duration-200"
          >
            Book Now
          </Link>
        </div>
      </div>
      
      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  );
};

export default CampaignItem;
