import React from 'react';
import CountDown from './CountDown';

const CampaignItem = ({ campaign }) => {
  return (
    <div
      className="relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl max-w-sm mx-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-50 pointer-events-none"></div>
      <figure className="p-6">

        <CountDown endDate={campaign.end_date} />

      </figure>
      <div className="p-6 pt-0 text-center">
        <h3 className="text-xl font-semibold text-gray-300 mb-2 truncate">
          {campaign.name || 'Untitled Campaign'}
        </h3>
        <p className="text-gray-200 text-sm mb-3 line-clamp-3">
          {campaign.description || 'No description available.'}
        </p>
        <div className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-amber-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-200 text-sm">
            {campaign.start_date && campaign.end_date
              ? `${campaign.start_date} - ${campaign.end_date}`
              : 'Date not specified'}
          </p>
        </div>
        <div className="flex items-center mb-4">
          <svg
            className="w-5 h-5 text-amber-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-200 text-sm">
            {campaign.location || 'Location not specified'}
          </p>
        </div>
        <div className="flex items-center mb-4">
            <svg
                className="w-5 h-5 text-amber-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l2-2m0 0l3-3m-3 3l-3-3m3 3l-2-2m6-2h-3.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-1.414 0L5.586 7.293A1 1 0 005 8v3.586a1 1 0 00.293.707l6.414 6.414a1 1 0 001.414 0l6.414-6.414A1 1 0 0019 11.586V8a1 1 0 00-1-1z"
                />
            </svg>
            <p className="text-gray-200 text-sm">
                {campaign.vaccines || 'Vaccines not specified'}
            </p>
            </div>
        <a
          href="#"
          className="inline-block px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-full hover:bg-yellow-700 transition-colors duration-200"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

export default CampaignItem;