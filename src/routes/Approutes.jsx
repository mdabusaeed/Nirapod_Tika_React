import React from 'react';
import { Route, Routes } from 'react-router';
import MainLayouts from '../layouts/MainLayouts';
import Home from '../pages/Home/Home';
import Vaccine from '../pages/Vaccine';
import Schedules from '../pages/Schedules';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ActivateAccount from '../pages/ActivateAccount';
import ForgetPassword from '../pages/ForgetPassword';
import ResetPassword from '../pages/ResetPassword';
import RedirectReset from '../pages/RedirectReset';
import ProtectedRoute from '../components/ProtectedRoute';
import Campaign from '../pages/Campaign';
import Profile from '../pages/Profile';
import Payment from '../pages/Payment';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFail from '../pages/PaymentFail';
import PaymentRedirect from '../pages/PaymentRedirect';
import DoctorProfileEdit from '../components/doctor-profile/DoctorProfileEdit';
import { PatientProfileEdit } from '../components/patient-profile';
import ShowUserInfo from '../debug/ShowUserInfo';
import UserDebug from '../debug/UserDebug';
import FetchAndRedirect from '../debug/FetchAndRedirect';
import AdminDashboard from '../pages/Admin/AdminDashboard';

const Approutes = () => {
  return (
    <Routes>
      <Route element={<MainLayouts />}>
        <Route path="/" element={<Home />} />
        <Route path="/vaccine" element={<Vaccine />} />
        <Route path="/campaign" element={<Campaign />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/schedules" element={
          <ProtectedRoute>
            <Schedules />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Doctor/Admin Profile Edit Route */}
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <DoctorProfileEdit />
          </ProtectedRoute>
        } />
        
        {/* Patient Profile Edit Route */}
        <Route path="/profile/patient/edit" element={
          <ProtectedRoute>
            <PatientProfileEdit />
          </ProtectedRoute>
        } />
        
        {/* Debug Routes */}
        <Route path="/debug/user" element={
          <ProtectedRoute>
            <ShowUserInfo />
          </ProtectedRoute>
        } />
        
        <Route path="/debug/simple" element={<UserDebug />} />
        
        <Route path="/debug/fix" element={
          <ProtectedRoute>
            <FetchAndRedirect />
          </ProtectedRoute>
        } />
        
        {/* Payment processing routes */}
        <Route path="/payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        
        {/* Payment redirect handler - catches all payment URLs and redirects appropriately */}
        <Route path="/payment/success" element={
          <ProtectedRoute>
            <PaymentRedirect />
          </ProtectedRoute>
        } />
        <Route path="/payment/success/" element={
          <ProtectedRoute>
            <PaymentRedirect />
          </ProtectedRoute>
        } />
        <Route path="/payment/success/*" element={
          <ProtectedRoute>
            <PaymentRedirect />
          </ProtectedRoute>
        } />
        
        <Route path="/payment/fail/" element={
          <ProtectedRoute>
            <PaymentRedirect />
          </ProtectedRoute>
        } />
        <Route path="/payment/fail/*" element={
          <ProtectedRoute>
            <PaymentRedirect />
          </ProtectedRoute>
        } />
        <Route path="/payment/fail" element={
          <ProtectedRoute>
            <PaymentRedirect />
          </ProtectedRoute>
        } />
        
        {/* New payment result pages with simplified URLs */}
        <Route path="/payment-success" element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        } />
        <Route path="/payment-fail" element={
          <ProtectedRoute>
            <PaymentFail />
          </ProtectedRoute>
        } />
        
        {/* Direct access test routes (for debugging) */}
        <Route path="/test-payment-success" element={<PaymentSuccess />} />
        <Route path="/test-payment-fail" element={<PaymentFail />} />
        
        {/* Admin Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate/:uid/:token" element={<ActivateAccount />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        
        {/* Handle any password reset URL format from the backend */}
        <Route path="/password/reset/*" element={<RedirectReset />} />
        <Route path="/reset/*" element={<RedirectReset />} />
      </Route>
    </Routes>
  );
};

export default Approutes;
