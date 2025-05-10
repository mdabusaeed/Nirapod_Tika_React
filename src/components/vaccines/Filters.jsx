import React from 'react';

const Filters = ({ 
    priceRange, 
    onSortChange, 
    searchQuery,
    handlePriceChange,
    handleSearchQuery,
    sortOrder
}) => {
    return (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-shadow hover:shadow-xl">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Price Range
                </label>
                {/* Min Range */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Minimum Price</label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="number"
                            min="0"
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                            className="w-24 p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 text-gray-700"
                        />
                        <input
                            type="range"
                            min="0"
                            max={priceRange[1]}
                            step="10"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-600 transition-colors "
                        />
                    </div>
                </div>
                {/* Max Range */}
                <div>
                    <label className="block text-sm text-gray-600 mb-2">Maximum Price</label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="number"
                            min={priceRange[0]}
                            max="100000"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                            className="w-24 p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 text-gray-700 "
                        />
                        <input
                            type="range"
                            min={priceRange[0]}
                            max="100000"
                            step="10"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-600 transition-colors"
                        />
                    </div>
                </div>
                {/* Price Display */}
                <div className="flex justify-between text-sm text-gray-600 mt-4">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>

            {/* Sorting */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-shadow hover:shadow-xl">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Sort By
                </label>
                <select
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 text-gray-700"
                    value={sortOrder}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>

            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Search
                </label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchQuery(e.target.value)}
                    placeholder="Search vaccines..."
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-gray-50 text-amber-700 placeholder-gray-400"
                    aria-label="Search vaccines by name"
                />
            </div>
        </div>
    );
};

export default Filters;