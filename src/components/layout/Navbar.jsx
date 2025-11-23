// components/layout/Navbar.js
import React, { useEffect, useState } from 'react';
import { FiBell, FiSearch, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
  import toast from 'react-hot-toast';
const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userprofile, setuserprofile] = useState([]); // Use null instead of empty array
const [firstnameletter ,setletter]=useState('');
useEffect(() => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      setuserprofile(parsedUser); 
     //get first letter 
   const firstTwoLetters = parsedUser.name ? parsedUser.name[0] : '';
   setletter(firstTwoLetters)
      console.log(firstTwoLetters);
    } catch (error) {
      console.error('Error parsing user data:', error);
      setuserprofile(null);
    }
  }
}, []);


const logoutuser = () => {
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  toast.success(userprofile.name+' Logout successfully');
setTimeout(() => {
  window.location.href = '/login';
}, 1000);
 
}
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search transactions, categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-0.5">
          {/* Wallet Balance */}
          <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <MdOutlineAccountBalanceWallet className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">$12,458.00</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <FiBell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{firstnameletter}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{userprofile.name}</p>
                <p className="text-xs text-gray-500">{userprofile.role}</p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <FiUser className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <FiSettings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button onClick={logoutuser}  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                  <FiLogOut className="h-4 w-4" />
                    <span >Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;