import React from 'react';
import '../index.css';
import useAuthContext from '../hooks/useAuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logoutUser } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div className="navbar bg-yellow-700 shadow-sm">
            {/* Left Side - Logo */}
            <div className="navbar-start">
                <Link to="/" className="btn btn-ghost text-xl text-white">Nirapod Tika</Link>
            </div>

            {/* Center - Navigation Items (visible on larger screens) */}
            <div className="navbar-center hidden lg:flex text-gray-100">
                <ul className="menu menu-horizontal gap-2 px-1">
                    <li><Link to="/" className="hover:bg-yellow-600">Home</Link></li>
                    <li><Link to="/vaccine" className="hover:bg-yellow-600">Vaccines</Link></li>
                    <li><Link to="/campaign" className="hover:bg-yellow-600">Campaigns</Link></li>
                    
                    {/* Show Schedules only if user is logged in */}
                    {user && (
                        <li><Link to="/schedules" className="hover:bg-yellow-600">Schedule</Link></li>
                    )}
                    
                    {/* Show Dashboard only for admin users */}
                    {user && (user.role === 'admin' || user.role === 'Admin') && (
                        <li><Link to="/dashboard" className="hover:bg-yellow-600">Dashboard</Link></li>
                    )}
                </ul>
            </div>

            {/* Right Side - Login/Signup or Profile */}
            <div className="navbar-end gap-2">
                {user ? (
                    // Show profile menu when logged in
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Profile"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                                />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><Link to="/profile">Profile</Link></li>
                            {/* Add Edit Profile menu for doctor/admin users */}
                            {user && (user.is_doctor || user.is_staff || user.is_admin || 
                                    user.user_type === 'doctor' || user.user_type === 'admin' ||
                                    user.role === 'doctor' || user.role === 'admin') && (
                                <li><Link to="/profile/edit">Edit Profile</Link></li>
                            )}
                            <li><a onClick={handleLogout} className="cursor-pointer hover:bg-amber-600">Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    // Show login/signup buttons when not logged in
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-sm bg-amber-600 hover:bg-amber-700 text-white border-none">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-white border-none">
                            Register
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile Menu Button (hidden on larger screens) */}
            <div className="navbar-end lg:hidden">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/vaccine">Vaccines</Link></li>
                        <li><Link to="/campaign">Campaigns</Link></li>
                        
                        {/* Show Schedules only if user is logged in */}
                        {user && (
                            <li><Link to="/schedules">Schedule</Link></li>
                        )}
                        
                        {/* Show Dashboard only for admin users */}
                        {user && (user.role === 'admin' || user.role === 'Admin') && (
                            <li><Link to="/dashboard">Dashboard</Link></li>
                        )}
                        
                        {/* Show login/register when not logged in */}
                        {!user && (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;