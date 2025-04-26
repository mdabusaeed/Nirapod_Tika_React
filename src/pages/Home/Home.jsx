import React from 'react';
import HeroCarousel from '../../component/Home/HeroCarousel';
import Featurs from '../../component/Home/Featurs';
import Product from '../../component/products/Product'; 
const Home = () => {
    return (
        <div>
            <HeroCarousel />
            <Featurs />
            <Product />
        </div>
    );
};

export default Home;