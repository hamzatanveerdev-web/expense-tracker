// components/dashboard/RecentTransactions.js
import React, { useState, useEffect } from 'react';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
    const api_url=process.env.REACT_APP_API_BASE_URL;
  // Fetch recent transactions from backend
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api_url}/transactions?limit=5`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTransactions();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Salary': 'bg-green-100 text-green-800',
      'Shopping': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Transportation': 'bg-cyan-100 text-cyan-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Freelance': 'bg-indigo-100 text-indigo-800',
      'Investment': 'bg-emerald-100 text-emerald-800',
      'Bonus': 'bg-pink-100 text-pink-800',
      'Gift': 'bg-teal-100 text-teal-800',
      'Refund': 'bg-lime-100 text-lime-800',
      'Other Income': 'bg-amber-100 text-amber-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💳</div>
            <p className="text-gray-500 text-sm">No transactions yet</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction._id || transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? 
                    <FiArrowDownLeft className="h-4 w-4 text-green-600" /> :
                    <FiArrowUpRight className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{transaction.name}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold text-sm ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {getTimeAgo(transaction.date)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;