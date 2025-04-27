import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api-client';
import Spinning from '../Common/Spinning';
import CampaignItem from './campaignItem';
const Campaign = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await apiClient.get('/vaccine-campaign');
                console.log("API Response:", response.data);
                setCampaigns(response.data || []);
            } catch (error) {
                console.error("API Error:", error);
                setError(error.message || "Failed to fetch campaigns");
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    if (loading) {
        return (
            <Spinning />
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                Error: {error}
            </div>
        );
    }

    if (!campaigns || campaigns.length === 0) {
        return (
            <div className="text-center text-gray-500 p-4">
                No campaigns available
            </div>
        );
    }

    return (
        <section className="py-4 bg-yellow-900">
            <div className=" container mx-auto px-3">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Vaccine Campaigns</h2>
                <a
                    href="#"
                    className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors"
                >
                    View All →
                </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
                    {campaigns.map((campaign) => (
                        <CampaignItem key={campaign.id} 
                        campaign={campaign} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Campaign;