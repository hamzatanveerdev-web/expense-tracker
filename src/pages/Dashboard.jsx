// pages/Dashboard.js - FULLY DYNAMIC
import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from 'react-icons/fi';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import StatCard from '../components/dashboard/StatCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingChart from '../components/dashboard/SpendingChart';
import API from '../api';
const api_url=process.env.REACT_APP_API_BASE_URL;
const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = '/';
    }
    
 },[])
  // Fetch dashboard stats from backend
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/transactions/dashboard/stats`);
       const data = response.data;
        
        setDashboardData(data);
        
        // Determine trend and color based on actual data
        const incomeTrend = parseFloat(data.trends.incomeChange) >= 0 ? 'up' : 'down';
        const expenseTrend = parseFloat(data.trends.expenseChange) <= 0 ? 'down' : 'up';
        const savingsTrend = parseFloat(data.trends.savingsChange) >= 0 ? 'up' : 'down';
        const balanceTrend = data.totalBalance >= 0 ? 'up' : 'down';

        setStats([
          {
            title: 'Total Balance',
            value: `$${data.totalBalance.toFixed(2)}`,
            change: `${balanceTrend === 'up' ? '+' : ''}${data.trends.savingsChange}%`,
            trend: balanceTrend,
            icon: MdOutlineAccountBalanceWallet,
            color: data.totalBalance >= 0 ? 'blue' : 'red'
          },
          {
            title: 'Income',
            value: `$${data.totalIncome.toFixed(2)}`,
            change: `${incomeTrend === 'up' ? '+' : ''}${data.trends.incomeChange}%`,
            trend: incomeTrend,
            icon: FiTrendingUp,
            color: parseFloat(data.trends.incomeChange) >= 0 ? 'green' : 'red'
          },
          {
            title: 'Expenses',
            value: `$${data.totalExpense.toFixed(2)}`,
            change: `${expenseTrend === 'up' ? '+' : ''}${data.trends.expenseChange}%`,
            trend: expenseTrend,
            icon: FiTrendingDown,
            color: parseFloat(data.trends.expenseChange) <= 0 ? 'green' : 'red'
          },
          {
            title: 'Savings Rate',
            value: `${data.savingsRate}%`,
            change: `${savingsTrend === 'up' ? '+' : ''}${data.trends.savingsChange}%`,
            trend: savingsTrend,
            icon: FiActivity,
            color: parseFloat(data.savingsRate) >= 20 ? 'green' : parseFloat(data.savingsRate) >= 10 ? 'yellow' : 'red'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto "></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! {dashboardData && `You have ${dashboardData.totalTransactions} transactions`}
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Transactions - Pass real data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart transactions={dashboardData?.transactions} />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;