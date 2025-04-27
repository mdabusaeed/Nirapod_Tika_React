import React from 'react';
import HeroCarousel from '../../components/Home/HeroCarousel';
import Featurs from '../../components/Home/Featurs';
import Product from '../../components/products/product';
import Campaign from '../../components/vaccine_campaign/Campaign';
const Home = () => {
    return (
        <div>
            <HeroCarousel />
            <Featurs />
            <Product />
            <Campaign />
        </div>
    );
};

export default Home;