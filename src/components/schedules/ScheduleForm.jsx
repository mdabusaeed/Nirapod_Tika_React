import React from 'react';

const ScheduleForm = ({
  user,
  vaccineId,
  scheduleData,
  vaccines,
  campaigns,
  loadingVaccines,
  loadingCampaigns,
  dateInputRefs,
  handleChange,
  handleDateChange,
  openCalendar,
  handleSubmit,
  loading
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Vaccine Selection - shown only if vaccineId is not provided */}
      {!vaccineId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Vaccine
          </label>
          <select
            name="vaccine"
            value={scheduleData.vaccine}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-800"
            required
            disabled={loadingVaccines}
          >
            <option value="">Select a vaccine</option>
            {vaccines.map(vaccine => (
              <option key={vaccine.id} value={vaccine.id}>
                {vaccine.name}
              </option>
            ))}
          </select>
          {loadingVaccines && <p className="text-sm text-gray-500 mt-1">Loading vaccines...</p>}
        </div>
      )}
      
      {/* Campaign dropdown with None option */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Campaign (Optional)
        </label>
        <select
          name="campaign"
          value={scheduleData.campaign}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-800"
          disabled={loadingCampaigns}
        >
          <option value="">None</option>
          {campaigns.map(campaign => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name || `Campaign ${campaign.id}`}
            </option>
          ))}
        </select>
        {loadingCampaigns && <p className="text-sm text-gray-500 mt-1">Loading campaigns...</p>}
      </div>
      
      {/* Payment Method - with cash as default */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method
        </label>
        <select
          name="payment_method"
          value={scheduleData.payment_method}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-800"
          required
        >
          <option value="cash">Cash on Delivery</option>
          <option value="online">Online Payment</option>
          <option value="insurance">Insurance</option>
        </select>
      </div>
      
      {/* Dose Date - Single date only */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dose Date
        </label>
        <div className="flex items-center mb-2 text-gray-800">
          <div className="flex-1 relative">
            <input
              ref={el => dateInputRefs.current[0] = el}
              type="date"
              value={scheduleData.dose_dates[0] || ''}
              onChange={(e) => handleDateChange(0, e.target.value)}
              className="w-full p-2 border rounded text-gray-800 pr-10"
              min={new Date().toISOString().split('T')[0]} // Cannot select dates in the past
              // Force calendar by disabling direct input
              onKeyDown={(e) => e.preventDefault()}
              readOnly={false} // Allow focus for calendar popup
              required
              onClick={(e) => e.target.showPicker()} // Open calendar on click 
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600"
              onClick={() => openCalendar(0)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">Please click on the date field or calendar icon to select a date.</p>
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !scheduleData.vaccine || !user}
        className={`w-full p-3 rounded text-white ${
          loading || !scheduleData.vaccine || !user
            ? 'bg-gray-400'
            : 'bg-amber-600 hover:bg-amber-700'
        }`}
      >
        {loading ? 'Scheduling...' : 'Schedule Vaccination'}
      </button>
    </form>
  );
};

export default ScheduleForm; 