import React, { useState, useEffect } from 'react';
import { FaSyringe, FaCalendarAlt, FaHospital, FaUserMd, FaUsers, FaPlus } from 'react-icons/fa';
import apiClient from '../../services/api-client';

// Import modular components
import VaccineList from '../../components/Admin/VaccineList/VaccineList';
import ScheduleList from '../../components/Admin/ScheduleList/ScheduleList';
import VaccineCampaign from '../../components/Admin/VaccineCampaign/VaccineCampaign';
import DoctorList from '../../components/Admin/DoctorList/DoctorList';
import PatientList from '../../components/Admin/PatientList/PatientList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('vaccines');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for each data type
  const [vaccines, setVaccines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // No need for dummy data anymore as we're using real API data
  
  // Fetch data from API
  useEffect(() => {

    const fetchVaccines = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/vaccines/');
        setVaccines(response.data);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
        setError('Failed to load vaccines');
        // Set empty array if API fails
        setVaccines([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSchedules = async () => {
      try {
        const response = await apiClient.get('/vaccination-schedules/');
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        // Set empty array if API fails
        setSchedules([]);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const response = await apiClient.get('/vaccine-campaign/');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        // Set empty array if API fails
        setCampaigns([]);
      }
    };

    // Fetch user data and filter by role
    const fetchUserData = async () => {
      try {
        // First check current user role
        const currentUserResponse = await apiClient.get('/auth/users/me/');
        const currentUser = currentUserResponse.data;
        
        console.log('Current user data:', currentUser);
        
        // Fetch all users
        const allUsersResponse = await apiClient.get('/auth/users/');
        let allUsers = allUsersResponse.data;
        
        console.log('All users data:', allUsers);
        
        // Check if the response is an array or has a results property
        if (!Array.isArray(allUsers) && allUsers.results) {
          allUsers = allUsers.results;
        }
        
        // Filter users by role
        const doctorsList = [];
        const patientsList = [];
        
        // Process each user
        for (const user of allUsers) {
          // Try to get detailed info for this user
          try {
            const userDetailResponse = await apiClient.get(`/auth/users/${user.id}/`);
            const userDetail = userDetailResponse.data;
            
            console.log(`User ${user.id} details:`, userDetail);
            
            if (userDetail.role === 'Doctor') {
              doctorsList.push({
                id: userDetail.id,
                name: userDetail.first_name + ' ' + userDetail.last_name,
                specialization: 'General Practitioner',
                hospital: 'City Hospital',
                phone: userDetail.phone_number || 'N/A',
                email: userDetail.email || 'N/A'
              });
            } else if (userDetail.role === 'Patient') {
              patientsList.push({
                id: userDetail.id,
                name: userDetail.first_name + ' ' + userDetail.last_name,
                age: 30, // Default age
                gender: 'Not specified',
                phone: userDetail.phone_number || 'N/A',
                address: userDetail.address || 'N/A',
                lastVaccine: 'Not available',
                vaccineDate: 'Not available'
              });
            }
          } catch (error) {
            console.error(`Error fetching details for user ${user.id}:`, error);
          }
        }
        
        console.log('Filtered doctors:', doctorsList);
        console.log('Filtered patients:', patientsList);
        
        setDoctors(doctorsList);
        setPatients(patientsList);
        
        // Check current user's role for access control
        if (currentUser.role.toLowerCase() !== 'admin') {
          console.log('User is not an admin');
          setError('You do not have admin privileges');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        setDoctors([]);
        setPatients([]);
      }
    };

    // Fetch data based on active tab to minimize unnecessary API calls
    fetchVaccines(); // Always fetch vaccines for the stats
    fetchUserData(); // Get current user info and all users

    if (activeTab === 'schedules') {
      fetchSchedules();
    } else if (activeTab === 'campaigns') {
      fetchCampaigns();
    }
  }, [activeTab]); // Re-fetch when active tab changes

  // Show loading indicator when data is being fetched
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-screen">
        <div className="text-center bg-red-100 p-6 rounded-lg">
          <p className="text-red-600 font-semibold">{error}</p>
          <p className="mt-2 text-gray-600">Using fallback data instead.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaSyringe className="text-blue-500 text-4xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Vaccines</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{vaccines.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaCalendarAlt className="text-green-500 text-4xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Schedules</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{schedules.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaUsers className="text-purple-500 text-4xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Patients</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{patients.length}</p>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('vaccines')}
              className={`${activeTab === 'vaccines' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FaSyringe className="mr-2" /> Vaccine List
            </button>
            
            <button
              onClick={() => setActiveTab('schedules')}
              className={`${activeTab === 'schedules' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FaCalendarAlt className="mr-2" /> Schedule List
            </button>
            
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`${activeTab === 'campaigns' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FaHospital className="mr-2" /> Vaccine Campaigns
            </button>
            
            <button
              onClick={() => setActiveTab('doctors')}
              className={`${activeTab === 'doctors' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FaUserMd className="mr-2" /> Doctor List
            </button>
            
            <button
              onClick={() => setActiveTab('patients')}
              className={`${activeTab === 'patients' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FaUsers className="mr-2" /> Patient List
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
          {/* Vaccines Tab */}
          {activeTab === 'vaccines' && (
            <VaccineList vaccines={vaccines} setVaccines={setVaccines} />
          )}

          {/* Schedules Tab */}
          {activeTab === 'schedules' && (
            <ScheduleList schedules={schedules} />
          )}
          
          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <VaccineCampaign campaigns={campaigns} setCampaigns={setCampaigns} />
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <DoctorList doctors={doctors} />
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <PatientList patients={patients} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;