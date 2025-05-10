import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    return (
        <div className='flex justify-center mb-6'>
            {Array.from({ length: totalPages }, (__, i) => (
                <button 
                    key={i} 
                    onClick={() => onPageChange(i + 1)}
                    className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? "bg-amber-600 text-white" : "bg-gray-200"}`}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );
};

export default Pagination; 