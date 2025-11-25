// pages/Settings.js
import React from 'react';
import { FiUser, FiGlobe, FiBell, FiLock, FiDatabase } from "react-icons/fi";

const Settings = ({ theme, setTheme }) => {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Customize your finance tracking experience</p>
        </div>
       
 {/* Theme Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border dark:border-gray-700">
       

        <label className="text-gray-700 dark:text-gray-300 font-medium">
          Theme
        </label>

        <select
          className="mt-2 w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light"> Light</option>
          <option value="dark"> Dark</option>
        </select>
      </div>


      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Profile Settings */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FiUser className="text-blue-500 text-xl" />
            <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Manage your personal information.
          </p>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            Edit Profile
          </button>
        </div>

        {/* Currency Settings */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FiGlobe className="text-green-500 text-xl" />
            <h2 className="text-lg font-semibold text-gray-800">Currency & Locale</h2>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Select your preferred currency and region.
          </p>

          <select className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white">
            <option value="USD">$ USD — US Dollar</option>
            <option value="EUR">€ EUR — Euro</option>
            <option value="GBP">£ GBP — British Pound</option>
            <option value="PKR">₨ PKR — Pakistani Rupee</option>
            <option value="INR">₹ INR — Indian Rupee</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FiBell className="text-yellow-500 text-xl" />
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Control alerts for spending, budgets, and reminders.
          </p>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" defaultChecked />
              <span className="text-sm text-gray-700">Monthly budget alerts</span>
            </label>

            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm text-gray-700">Large transaction warnings</span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FiLock className="text-red-500 text-xl" />
            <h2 className="text-lg font-semibold text-gray-800">Security</h2>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Update password and protect your financial data.
          </p>

          <button className="text-blue-600 text-sm font-medium hover:underline">
            Change Password
          </button>
        </div>

        {/* Data Management */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <FiDatabase className="text-purple-500 text-xl" />
            <h2 className="text-lg font-semibold text-gray-800">Data Management</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Export your data or clear your account history.
          </p>

          <div className="flex space-x-4">
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
              Export Transactions
            </button>
            <button className="px-4 py-2 rounded-lg bg-red-100 text-red-600 text-sm hover:bg-red-200">
              Delete All Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
