import React from 'react';
import '../index.css';

const Navbar = () => {
    return (
        <div  className="navbar bg-yellow-700 shadow-sm">
            {/* Left Side - Logo */}
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">Nirapod Tika</a>
            </div>

            {/* Center - Navigation Items (visible on larger screens) */}
            <div className="navbar-center hidden lg:flex text-gray-100">
                <ul className="menu menu-horizontal gap-2 px-1">
                    <li><a className="hover:bg-base-200">Home</a></li>
                    <li><a className="hover:bg-base-200">Vaccine Centers</a></li>
                    <li><a className="hover:bg-base-200">Bookings</a></li>
                    <li><a className="hover:bg-base-200">About</a></li>
                </ul>
            </div>

            {/* Right Side - Search and Profile */}
            <div className="navbar-end gap-2">
                {/* Search Input (hidden on small screens) */}
                <div className="hidden md:block">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="input input-bordered w-36 md:w-auto bg-gray-800" 
                    />
                </div>
                
                {/* Profile Dropdown */}
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
                        <li><a>Profile</a></li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>

            {/* Mobile Menu Button (hidden on larger screens) */}
            <div className="navbar-end lg:hidden ">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a>Home</a></li>
                        <li><a>Vaccine Centers</a></li>
                        <li><a>Bookings</a></li>
                        <li><a>About</a></li>
                        <li className="md:hidden"><a>Search</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;