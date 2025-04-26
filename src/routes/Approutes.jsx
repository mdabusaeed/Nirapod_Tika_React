import React from 'react';
import { Route, Routes } from 'react-router';
import MainLayouts from '../layouts/MainLayouts';
import Home from '../pages/home/Home';

const Approutes = () => {
    return (
        <Routes>
            <Route element={<MainLayouts />} >
                <Route path="/" element={<Home />} />
            </Route>
        </Routes>
    );
};

export default Approutes;