// src/pages/Transactions.js - Updated with Add Transaction Modal
import React, { useState, useEffect } from 'react';
import { FiPlus, FiDownload, FiUpload, FiSearch } from 'react-icons/fi';
import TransactionTable from '../components/transactions/TransactionTable';
import ImportModal from '../components/transactions/ImportModal';
import AddTransactionModal from '../components/transactions/NewTransactionModal';
import toast, { Toaster } from 'react-hot-toast';
import API from '../api';
const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add this state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userid,setuserid]=useState("");

const api_url=process.env.REACT_APP_API_BASE_URL;




  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
    setLoading(true);

    const response = await API.get("/transactions");
    setTransactions(response.data);
    setError(null);
  } catch (err) {
    setError(err.message);
    console.error("Error fetching transactions:", err);
  } finally {
    setLoading(false);
  }
  };
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add new transaction
  const handleAddTransaction = async (transactionData) => {
    try {
    
        const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  if (!userId) {
    toast.error("User ID missing. Please login again.");
    return;
  }

  const response = await API.post("/transactions", {
    ...transactionData,
    userId: userId
  });


    const newTransaction = response.data;

    // Update local state
    setTransactions([newTransaction, ...transactions]);
    setIsAddModalOpen(false);
    toast.success("Successfully added transaction!");
  } catch (err) {
    console.error("Error adding transaction:", err);
    toast.error("Failed to add transaction");
  }
}

  // Export all transactions to CSV
  const handleExport = async () => {
    try {
      const headers = ['ID', 'Name', 'Amount', 'Type', 'Category', 'Date', 'Status', 'Description'];
      
      const csvRows = transactions.map(transaction => [
        transaction.id || transaction._id,
        `"${transaction.name.replace(/"/g, '""')}"`,
        Math.abs(transaction.amount).toFixed(2),
        transaction.type,
        `"${transaction.category}"`,
        transaction.date,
        transaction.status,
        `"${(transaction.description || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers, ...csvRows]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error exporting transactions:', err);
     toast.error("Failed to export transactions")
    }
  };

  const handleImport = async (importedData) => {
   try {
    // Axios automatically adds Authorization header and handles token refresh
    const response = await API.post("/transactions/import", {
      transactions: importedData,
    });

    const result = response.data;

    // Refresh transactions list
    fetchTransactions();
    setIsImportModalOpen(false);

    toast.success(`Successfully imported ${result.importedCount} transactions`);
  } catch (err) {
    console.error("Error importing transactions:", err);
    toast.error("Failed to import transactions");
  }
};
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
       await API.delete(`/transactions/${id}`);

    // Remove from local state
    setTransactions(transactions.filter(transaction => transaction.id !== id && transaction._id !== id));

    toast.success("Transaction deleted successfully!");
  } catch (err) {
    console.error("Error deleting transaction:", err);
    toast.error("Failed to delete transaction");
  }
  };
  }
  const filteredTransactions = transactions.filter(transaction => {
    if (searchTerm && !transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.category !== 'all' && transaction.category !== filters.category) return false;
    if (filters.type !== 'all' && transaction.type !== filters.type) return false;
    if (filters.status !== 'all' && transaction.status !== filters.status) return false;
    
    // Date range filtering
    if (filters.dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          if (transactionDate.toDateString() !== today.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          if (transactionDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
          if (transactionDate <monthAgo) return false;
          break;
        case 'year':
          const yearAgo = new Date(today.setFullYear(today.getFullYear() - 1));
          if (transactionDate < yearAgo) return false;
          break;
        default:
          break;
      }
    }
    
    return true;
  });

  const stats = {
    total: transactions.length,
    income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    expense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Manage and review all your transactions</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiUpload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiDownload className="h-4 w-4" />
            <span>Export All</span>
          </button>
          {/* Updated New Transaction Button */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <FiPlus className="h-4 w-4" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

     {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-20">
    <div className="flex items-center justify-between h-full">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Transactions</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-xl">
        <FiDownload className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-20">
    <div className="flex items-center justify-between h-full">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Income</p>
        <p className="text-2xl font-bold text-green-600 mt-1">${stats.income.toFixed(2)}</p>
      </div>
      <div className="p-3 bg-green-50 rounded-xl">
        <FiDownload className="h-6 w-6 text-green-600" />
      </div>
    </div>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-20">
    <div className="flex items-center justify-between h-full">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Expenses</p>
        <p className="text-2xl font-bold text-red-600 mt-1">${stats.expense.toFixed(2)}</p>
      </div>
      <div className="p-3 bg-red-50 rounded-xl">
        <FiUpload className="h-6 w-6 text-red-600" />
      </div>
    </div>
  </div>
</div>


      {/* Export Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiDownload className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Ready to export {transactions.length} transactions
              </p>
              <p className="text-sm text-blue-700">
                Click "Export All" to download all transactions as CSV file
              </p>
            </div>
          </div>
         
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transportation">Transportation</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
            </select>
            
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select 
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable 
        transactions={filteredTransactions}
        onDelete={handleDeleteTransaction}
        searchTerm={searchTerm}
        onExport={handleExport}
        onAddTransaction={handleAddTransaction} // Pass the function
      />

      {/* Import Modal */}
      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTransaction}
      />
    </div>
  );
};

export default Transactions;