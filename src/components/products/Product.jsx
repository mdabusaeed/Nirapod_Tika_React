import { useEffect, useState } from 'react';
import apiClient from '../../services/api-client';
import ErrorAlert from '../Common/ErrorAlert';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
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
<section className="bg-amber-50 py-3">
  <div className="max-w-7xl mx-auto px-2 sm:px-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Trending Now</h2>
      <a
        href="#"
        className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors"
      >
        View All →
      </a>
    </div>

    {/* Loading State - Compact */}
    {isLoading && (<Spinning />)}

    {error && <ErrorAlert error={error} />}

    {/* Compact Product Slider */}
    {!isLoading && !error && products.length > 0 && (
      <div className="relative pb-1">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            500: { slidesPerView: 1.8 },
            640: { slidesPerView: 2.3 },
            768: { slidesPerView: 2.8 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.2 },
          }}
          navigation={{
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev',
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="pb-2">
              <ProductItem product={product} compact />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Minimal Navigation Arrows */}
        <button className="swiper-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 rounded-full shadow-md">
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="swiper-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 rounded-full shadow-md">
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )}

    {!isLoading && !error && products.length === 0 && (
      <div className="py-6 text-center text-gray-500 text-sm">
        No trending products available
      </div>
    )}
  </div>
</section>
    );
};

export default Product;