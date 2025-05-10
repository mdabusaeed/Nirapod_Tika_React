import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import campaignService from '../../services/campaign-service';
import Spinning from '../Common/Spinning';
import CampaignItem from './campaignItem';

const Campaign = ({ limit = 6, showViewAll = true }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                // Use our dedicated campaign service
                // This service uses the Vercel backend URL specifically for campaigns
                const campaignData = await campaignService.getAllCampaigns(limit);
                console.log("Campaign Data:", campaignData);
                setCampaigns(campaignData || []);
            } catch (error) {
                console.error("API Error:", error);
                
                // Check for specific error types
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Response data:", error.response.data);
                    console.log("Response status:", error.response.status);
                    console.log("Response headers:", error.response.headers);
                    
                    if (error.response.status === 403) {
                        setError("Access forbidden. You may not have permission to view campaigns or need to log in.");
                    } else {
                        setError(`Server error: ${error.response.status}. Please try again later.`);
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log("Request:", error.request);
                    setError("No response from server. Please check your connection.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error message:", error.message);
                    setError("Failed to load campaigns. Please check your connection or try again later.");
                }
                
                setCampaigns([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, [limit]);

    return (
        <section className="py-10 bg-gradient-to-b from-amber-800 to-amber-900">
            <div className="container max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h2 className="text-2xl font-bold text-white">Vaccine Campaigns</h2>
                        <p className="text-amber-200 mt-1">Special vaccination drives and health initiatives</p>
                    </div>
                    
                    {showViewAll && (
                        <Link
                            to="/campaign"
                            className="inline-flex items-center px-4 py-2 bg-amber-500 border border-transparent rounded-md font-semibold text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-800 focus:ring-amber-500 transition-all duration-300"
                        >
                            View All Campaigns
                            <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <Spinning color="text-amber-500" />
                    </div>
                )}

                {error && (
                    <div className="text-center bg-red-100 text-red-700 p-4 rounded-lg shadow-inner mx-auto max-w-3xl">
                        <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-medium">{error}</p>
                        <p className="mt-2 text-sm">Please try again later or contact support.</p>
                    </div>
                )}

                {!loading && !error && campaigns.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-amber-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-white text-lg">No active campaigns at the moment</p>
                        <p className="text-amber-200 mt-2">Please check back soon for upcoming vaccination campaigns</p>
                    </div>
                )}

                {!loading && !error && campaigns.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {campaigns.map((campaign) => (
                            <div key={campaign.id} className="transform transition-transform duration-300 hover:scale-105 hover:z-10">
                                <CampaignItem campaign={campaign} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Campaign;