import React from 'react';
import { useLocation } from 'react-router-dom';
import VSchedules from '../components/schedules/VSchedules';

const Schedules = () => {
    const location = useLocation();
    const selectedVaccine = location.state?.selectedVaccine;
    const selectedProduct = location.state?.selectedProduct;
    const fromBookNow = location.state?.fromBookNow;
    
    // Extract the ID based on what was passed (vaccine or product)
    const itemId = selectedVaccine?.id || selectedProduct?.id;
    
    return (
        <div className="container mx-auto py-8">
            {fromBookNow && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6 mx-auto max-w-md">
                    <p className="font-medium text-center">
                        {selectedVaccine ? 'You are scheduling the following vaccine:' : 'You are scheduling:'}
                    </p>
                    <p className="text-center font-bold text-xl mt-1">
                        {selectedVaccine?.name || selectedProduct?.name || 'Selected Item'}
                    </p>
                </div>
            )}
            
            <VSchedules vaccineId={itemId} />
        </div>
    );
};

export default Schedules;