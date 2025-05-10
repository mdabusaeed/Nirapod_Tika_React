import React from 'react';
import MobileScheduleList from './MobileScheduleList';
import DesktopScheduleList from './DesktopScheduleList';
import NoSchedulesMessage from './NoSchedulesMessage';

const SchedulesSection = ({
  schedules,
  error,
  deleteSuccess,
  loadingSchedules,
  showDebug,
  setShowDebug,
  getFirstUnpaidSchedule,
  handlePayment,
  fetchUserSchedules,
  formatDateTime,
  formatDate,
  getOrderDate,
  getDeliveryDate,
  getVaccinePrice,
  handleDeleteSchedule,
  deletingId
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-amber-50 px-6 py-3 border-b border-amber-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-amber-800">Your Vaccination Schedules</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="text-amber-600 hover:text-amber-800 px-2 py-1 text-xs border border-amber-200 rounded-md bg-white"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
          <button 
            onClick={fetchUserSchedules}
            className="text-amber-600 hover:text-amber-800"
            disabled={loadingSchedules}
          >
            <div className="flex items-center">
              {loadingSchedules ? (
                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-amber-600 rounded-full mr-1"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {loadingSchedules ? 'Refreshing...' : 'Refresh'}
            </div>
          </button>
        </div>
      </div>
      <div className="p-6 overflow-x-auto">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {deleteSuccess && (
          <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4 border-l-4 border-green-500 flex items-center shadow-sm">
            <div className="mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-grow text-left">
              <p className="font-medium">{deleteSuccess}</p>
            </div>
          </div>
        )}
        
        {/* Add pay button for any unpaid schedules */}
        {getFirstUnpaidSchedule() && (
          <div className="bg-amber-50 text-amber-700 p-3 rounded-md mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-3 md:mb-0">
              <p className="font-medium text-lg">You have unpaid online vaccinations</p>
              <p className="text-sm text-amber-600">Complete your payment to confirm your schedule</p>
            </div>
            <button
              onClick={() => handlePayment(getFirstUnpaidSchedule())}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-md text-sm flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pay Now
            </button>
          </div>
        )}
        
        {loadingSchedules ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-amber-600 mr-2"></div>
            <p className="text-gray-600">Loading your schedules...</p>
          </div>
        ) : schedules.length > 0 ? (
          <>
            {/* Mobile view for small screens */}
            <MobileScheduleList 
              schedules={schedules}
              formatDateTime={formatDateTime}
              formatDate={formatDate}
              getOrderDate={getOrderDate}
              getDeliveryDate={getDeliveryDate}
              getVaccinePrice={getVaccinePrice}
              handlePayment={handlePayment}
              handleDeleteSchedule={handleDeleteSchedule}
              deletingId={deletingId}
              showDebug={showDebug}
            />
            
            {/* Desktop view for medium and larger screens */}
            <DesktopScheduleList 
              schedules={schedules}
              formatDateTime={formatDateTime}
              formatDate={formatDate}
              getOrderDate={getOrderDate}
              getDeliveryDate={getDeliveryDate}
              getVaccinePrice={getVaccinePrice}
              handlePayment={handlePayment}
              handleDeleteSchedule={handleDeleteSchedule}
              deletingId={deletingId}
              showDebug={showDebug}
            />
          </>
        ) : (
          <NoSchedulesMessage />
        )}
      </div>
      
      {/* Add debugging info section at the bottom */}
      <div className="border-t border-gray-100 px-6 py-3">
        <button 
          onClick={() => setShowDebug(!showDebug)} 
          className="text-xs text-gray-500 hover:text-amber-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {showDebug ? 'Hide Raw Data' : 'Show Raw Data'}
        </button>
        
        {showDebug && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md overflow-auto text-xs font-mono">
            <pre>{JSON.stringify(schedules, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulesSection; 