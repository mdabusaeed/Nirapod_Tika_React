import React from 'react';
import VaccineItem from './VaccineItem';

const VaccineList = ({vaccines, loading}) => {
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {vaccines.map((vaccine) => (
                <VaccineItem key={vaccine.id} vaccine={vaccine} />
            ))}
        </div>
    );
};

export default VaccineList;