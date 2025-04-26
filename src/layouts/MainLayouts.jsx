import React from 'react';
import { Outlet } from 'react-router';
import Footer from './Footer';
import Navbar from './Navbar';

const MainLayouts = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayouts;