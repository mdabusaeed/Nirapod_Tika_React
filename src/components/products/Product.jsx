import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api-client';
import ErrorAlert from '../Common/ErrorAlert';
import ProductItem from './ProductItem';
import Spinning from '../Common/Spinning';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        apiClient
        .get('/vaccines')
        .then((res) => {
            setProducts(res.data);
        })
        .catch(err => {
            console.error("API Error:", err);
            setError(err.message);
        })
        .finally(() => setIsLoading(false));
    }, []);

    return (
        <section className="py-8 bg-gradient-to-b from-amber-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-amber-700">Trending Now</h2>
                        <p className="text-gray-600 mt-1">Our most popular vaccines and healthcare products</p>
                    </div>
                    <Link
                        to="/vaccine"
                        className="inline-flex items-center px-4 py-2 bg-amber-600 border border-transparent rounded-md font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 ease-in-out shadow-md"
                    >
                        View All
                        <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>

                {/* Loading State */}
                {isLoading && (<Spinning />)}

                {error && <ErrorAlert error={error} />}

                {/* Grid of Products */}
                {!isLoading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-4">
                        {products.map((product) => (
                            <div key={product.id} className="transform transition-transform duration-300 hover:scale-105">
                                <ProductItem product={product} compact={true} />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !error && products.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-amber-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-600 text-lg">No trending products available at the moment</p>
                        <p className="text-gray-500 mt-2">Please check back soon for new arrivals</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Product;