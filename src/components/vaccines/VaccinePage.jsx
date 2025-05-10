import React, { useState, useEffect } from 'react';
import useFetchVaccines from '../../hooks/useFetchVaccines';
import VaccineList from './VaccineList';
import Pagination from './Pagination';
import Filters from './Filters';
const VaccinePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const { vaccines, totalPages } = useFetchVaccines(
        currentPage,
        priceRange,
        searchQuery,
        sortOrder
    );

    const handlePriceRangeChange = (index, value) => {
        setPriceRange((prev) => {
            const newPriceRange = [...prev];
            newPriceRange[index] = value;
            return newPriceRange;
        });
        setCurrentPage(1);
    };

    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
        setCurrentPage(1);
    };


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-2xl shadow-lg transition-shadow hover:shadow-xl">
            <h1 className="text-2xl font-bold mb-4 text-black text-center ">See all Vaccines</h1>
            <Filters
                priceRange={priceRange}
                handlePriceChange={handlePriceRangeChange}
                onSortChange={handleSortChange}
                sortOrder={sortOrder}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                searchQuery={searchQuery}
                handleSearchQuery={setSearchQuery}
            />

            <VaccineList vaccines={vaccines}/>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default VaccinePage;