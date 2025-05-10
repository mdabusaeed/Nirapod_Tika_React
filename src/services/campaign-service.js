import axios from 'axios';

// Campaign service for handling campaign-related API calls
const campaignService = {
  // Function to fetch all campaigns
  getAllCampaigns: async (limit = 0) => {
    try {
      // Get auth token from localStorage
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));
      const token = authTokens?.access;
      
      // Create headers with authentication token
      // Try without JWT prefix and with additional headers
      const headers = {
        'Authorization': token ? `${token}` : '',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Use the Vercel deployed backend for campaign API
      // This won't affect other API calls that use apiClient
      const response = await axios.get('https://nirapod-tika-sub.vercel.app/api/v1/vaccine-campaign/', { headers });
      
      // If limit is set, only return that many campaigns
      const data = response.data;
      return limit > 0 ? data.slice(0, limit) : data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },
  
  // Function to fetch a single campaign by ID
  getCampaignById: async (campaignId) => {
    try {
      // Get auth token from localStorage
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));
      const token = authTokens?.access;
      
      // Create headers with authentication token
      // Try without JWT prefix and with additional headers
      const headers = {
        'Authorization': token ? `${token}` : '',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Use the Vercel deployed backend for campaign API
      const response = await axios.get(`https://nirapod-tika-sub.vercel.app/api/v1/vaccine-campaign/${campaignId}/`, { headers });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching campaign with ID ${campaignId}:`, error);
      throw error;
    }
  },
  
  // Function to get campaigns by vaccine ID
  getCampaignsByVaccineId: async (vaccineId) => {
    try {
      // Get all campaigns first
      const allCampaigns = await campaignService.getAllCampaigns();
      
      // Filter campaigns that include the specified vaccine
      return allCampaigns.filter(campaign => 
        campaign.vaccines && campaign.vaccines.includes(parseInt(vaccineId))
      );
    } catch (error) {
      console.error(`Error fetching campaigns for vaccine ID ${vaccineId}:`, error);
      throw error;
    }
  }
};

export default campaignService;