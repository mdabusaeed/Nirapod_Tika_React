import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../services/api-client';
import useAuthContext from '../../hooks/useAuthContext';
import ScheduleForm from './ScheduleForm';
import SuccessMessage from './SuccessMessage';

const VSchedules = ({ vaccineId }) => {
  const { user } = useAuthContext();
  const [scheduleData, setScheduleData] = useState({
    vaccine: vaccineId || '',
    campaign: '',
    payment_method: "cash",
    dose_dates: [""]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [vaccines, setVaccines] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loadingVaccines, setLoadingVaccines] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [scheduleId, setScheduleId] = useState(null);
  
  // References for date input elements
  const dateInputRefs = useRef([]);
  
  // Update schedule data when vaccineId prop changes
  useEffect(() => {
    if (vaccineId) {
      setScheduleData(prev => ({
        ...prev,
        vaccine: vaccineId
      }));
    }
  }, [vaccineId]);
  
  // Fetch available vaccines for dropdown if no vaccineId is provided
  useEffect(() => {
    if (!vaccineId) {
      fetchVaccines();
    }
    // Fetch campaigns regardless
    fetchCampaigns();
  }, [vaccineId]);
  
  // Update refs when dose_dates length changes
  useEffect(() => {
    dateInputRefs.current = dateInputRefs.current.slice(0, scheduleData.dose_dates.length);
  }, [scheduleData.dose_dates.length]);
 
  const fetchVaccines = async () => {
    setLoadingVaccines(true);
    try {
      // Get auth token from localStorage
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));
      const token = authTokens?.access;
      
      const response = await apiClient.get('vaccines/', {
        headers: {
          'Authorization': `JWT ${token}`
        }
      });
      
      setVaccines(response.data);
      if (response.data.length > 0 && !vaccineId) {
        setScheduleData(prev => ({
          ...prev,
          vaccine: response.data[0].id
        }));
      }
    } catch (err) {
      console.error('Error fetching vaccines:', err);
    } finally {
      setLoadingVaccines(false);
    }
  };
  
  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      // Get auth token from localStorage
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));
      const token = authTokens?.access;
      
      // Try to fetch campaigns from API
      const response = await apiClient.get('campaign-campaign/', {
        headers: {
          'Authorization': `JWT ${token}`
        }
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setCampaigns(response.data);
        
        // Don't set a default campaign, allow users to select "None"
        setScheduleData(prev => ({
          ...prev,
          campaign: ''
        }));
      } else {
        // If empty response, use empty array
        setCampaigns([]);
        // Don't set a default campaign, allow users to select "None"
        setScheduleData(prev => ({
          ...prev,
          campaign: ''
        }));
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      // If API call fails, use empty array
      setCampaigns([]);
      // Don't set a default campaign, allow users to select "None"
      setScheduleData(prev => ({
        ...prev,
        campaign: ''
      }));
    } finally {
      setLoadingCampaigns(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (index, value) => {
    setScheduleData(prev => ({
      ...prev,
      dose_dates: [value] // Always keep only one date
    }));
  };
  
  // Function to open the calendar programmatically
  const openCalendar = (index) => {
    if (dateInputRefs.current[index]) {
      const dateInput = dateInputRefs.current[index];
      // Using a click to open the calendar
      dateInput.showPicker();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is logged in
      if (!user || !user.id) {
        setError('You must be logged in to schedule a vaccination');
        setLoading(false);
        return;
     }
      
      // Validate the form data
      if (!scheduleData.vaccine) {
        setError('Please select a vaccine');
        setLoading(false);
        return;
      }
      
      // Campaign is now optional, no validation needed
      
      // Filter out empty dates and ensure proper format
      const selectedDate = scheduleData.dose_dates.find(date => date !== "") || "";
      
      // Format selected date in ISO format if it exists
      let formattedDate = "";
      if (selectedDate) {
        const dateObj = new Date(selectedDate);
        formattedDate = dateObj.toISOString().split('T')[0];
      }
      
      if (!formattedDate) {
        setError('Please select a dose date');
        setLoading(false);
        return;
      }
      
      // Format the request data according to updated backend schema
      const requestData = {
        vaccine: Number(scheduleData.vaccine),
        campaign: scheduleData.campaign ? Number(scheduleData.campaign) : null, // Allow null for "None" option
        payment_method: scheduleData.payment_method,
        dose_date: formattedDate, // Single date instead of array
        patient: Number(user.id)
      };
      
      // Add more detailed logging
      console.log('User data:', user);
      console.log('Form data:', scheduleData);
      console.log('Formatted date:', formattedDate);
      console.log('Final request data:', requestData);
      
      // Get auth token from localStorage
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));
      const token = authTokens?.access;
      
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      console.log('Sending request to API...');
      
      // Make the API request with auth header - use the updated endpoint structure
      const response = await apiClient.post('vaccination-schedules/', requestData, {
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API response received:', response.status);
      
      console.log('Schedule created:', response.data);
      
      // Set success to true immediately
      setSuccess(true);
        
      // Save the schedule ID for later reference
      if (response.data && response.data.schedule_id) {
        console.log('Got schedule_id in new format:', response.data.schedule_id);
        setScheduleId(response.data.schedule_id);
      }
      // Check for the traditional response format
      else if (response.data && response.data.id) {
        console.log('Got schedule ID in traditional format:', response.data.id);
        setScheduleId(response.data.id);
      }
      
      // Reset form after successful submission
      setScheduleData({
        vaccine: vaccineId || '',
        campaign: '',
        payment_method: "cash",
        dose_dates: [""]
      });
    } catch (err) {
      console.error('Schedule error:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      
      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = err.response.status;
        const errorData = err.response.data;
        
        if (status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (status === 400) {
          // Format validation errors
          if (typeof errorData === 'object') {
            const errorMessages = Object.entries(errorData)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
            setError(errorMessages || 'Invalid data submitted. Please check your form.');
          } else {
            setError('Invalid data submitted. Please check your form.');
          }
        } else if (status === 403) {
          setError('You do not have permission to schedule vaccinations.');
        } else if (status === 404) {
          setError('The requested resource was not found. Please try again later.');
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(errorData.message || 'An error occurred while scheduling the vaccination');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your internet connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Failed to make request. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-amber-600">Schedule Vaccination</h1>
      
      {!user && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          You need to be logged in to schedule vaccinations. Please log in and try again.
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success ? (
        <SuccessMessage 
          scheduleId={scheduleId}
          paymentMethod={scheduleData.payment_method}
          onScheduleAnother={() => {
            setSuccess(false);
          }}
          loading={loading}
        />
      ) : (
        <ScheduleForm
          user={user}
          vaccineId={vaccineId}
          scheduleData={scheduleData}
          vaccines={vaccines}
          campaigns={campaigns}
          loadingVaccines={loadingVaccines}
          loadingCampaigns={loadingCampaigns}
          dateInputRefs={dateInputRefs}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          openCalendar={openCalendar}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default VSchedules;