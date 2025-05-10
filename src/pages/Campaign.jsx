import React from 'react';
import CampaignComponent from '../components/vaccine_campaign/Campaign';

const Campaign = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="relative bg-amber-900 text-white">
                <div className="absolute inset-0 bg-[url('/src/assets/images/vaccine-pattern.png')] opacity-10"></div>
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 py-14 md:py-16 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Vaccination Campaigns</h1>
                        <p className="text-xl text-amber-200 mb-6">
                            Join our vaccination initiatives to protect yourself and your community from preventable diseases.
                        </p>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-amber-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-amber-100">
                                    Nirapod Tika vaccination campaigns provide essential vaccines at special rates, with expert medical professionals ensuring your safety throughout the process.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
                    <h2 className="text-2xl font-bold text-amber-800 text-center mb-8">Why Join Our Campaigns?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg bg-amber-50">
                            <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-amber-800 mb-2">Cost Effective</h3>
                            <p className="text-gray-600">Special rates and discounts during campaign periods make essential vaccines more accessible.</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-lg bg-amber-50">
                            <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-amber-800 mb-2">Enhanced Safety</h3>
                            <p className="text-gray-600">Our campaigns follow strict medical protocols with experienced healthcare professionals.</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-lg bg-amber-50">
                            <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-amber-800 mb-2">Community Health</h3>
                            <p className="text-gray-600">By participating, you help build community immunity and protect vulnerable populations.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Campaigns */}
            <div className="bg-gray-50 py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
                    <h2 className="text-2xl font-bold text-amber-800 text-center mb-6">Current Campaigns</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto text-center mb-10">
                        Explore our ongoing vaccination campaigns. Each campaign offers special benefits and focuses on 
                        specific vaccines to address current health needs in our community.
                    </p>
                    
                    {/* Campaign component shows all campaigns */}
                    <CampaignComponent showViewAll={false} limit={0} />
                </div>
            </div>
        </div>
    );
};

export default Campaign; 