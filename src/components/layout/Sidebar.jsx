// components/layout/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiCreditCard, 
  FiPieChart, 
  FiFolder, 
  FiSettings,
  FiPlusCircle
} from 'react-icons/fi';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Transactions', href: '/transactions', icon: FiCreditCard },
  
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];//

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FiCreditCard className="h-5 w-5 text-white" />
            </div>
       <span className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
   FinTrack
</span>


          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
          <div className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
               
                <item.icon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Add Transaction Button */}
          <div className="px-4 mt-8">
            <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <FiPlusCircle className="h-5 w-5" />
              <span>New Transaction</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;