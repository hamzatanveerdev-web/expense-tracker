// src/components/transactions/TransactionTable.js - Updated with Add Transaction
import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiEye, FiChevronDown, FiChevronUp, FiDownload, FiPlus } from 'react-icons/fi';
import AddTransactionModal from './NewTransactionModal'; // Import the modal

const TransactionTable = ({ transactions, onDelete, onEdit, searchTerm, onExport, onAddTransaction }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Handle saving new transactions
  const handleSaveTransaction = (transactionData) => {
    if (onAddTransaction) {
      onAddTransaction(transactionData);
    }
    setIsAddModalOpen(false);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortField === 'amount') {
      aValue = Math.abs(aValue);
      bValue = Math.abs(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Salary': 'bg-green-100 text-green-800',
      'Shopping': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Transportation': 'bg-cyan-100 text-cyan-800',
      'Freelance': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );

  if (transactions.length === 0) {
    return (
      <>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
         
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {searchTerm ? 'No transactions found' : 'No transactions yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first transaction'}
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Add Your First Transaction
          </button>
        </div>

        {/* Add Transaction Modal */}
        <AddTransactionModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveTransaction}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header with Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Transactions ({transactions.length})
            </h3>
            <p className="text-sm text-gray-600">
              Showing {sortedTransactions.length} of {transactions.length} transactions
            </p>
          </div>
          <div className="flex items-center space-x-3">
           
            <button
              onClick={onExport}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload className="h-4 w-4" />
              <span className="text-sm font-medium">Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortableHeader field="name">Transaction</SortableHeader>
                <SortableHeader field="category">Category</SortableHeader>
                <SortableHeader field="date">Date</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="amount">Amount</SortableHeader>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTransactions.map((transaction) => (
                <React.Fragment key={transaction.id || transaction._id}>
                  <tr 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === (transaction.id || transaction._id) ? null : (transaction.id || transaction._id))}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.name}
                          </div>
                          {transaction.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {transaction.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(transaction.category)}`}>
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // View details - implement as needed
                            console.log('View transaction:', transaction);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEdit) {
                              onEdit(transaction);
                            }
                          }}
                          className="text-gray-600 hover:text-gray-900 p-1 transition-colors"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(transaction.id || transaction._id);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 transition-colors"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === (transaction.id || transaction._id) && (
                    <tr className="bg-blue-50">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Transaction ID:</span>
                            <p className="text-gray-600">#{transaction.id || transaction._id}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Type:</span>
                            <p className="text-gray-600 capitalize">{transaction.type}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Description:</span>
                            <p className="text-gray-600">{transaction.description || 'No description'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Full Date:</span>
                            <p className="text-gray-600">
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedTransactions.length}</span> of{' '}
              <span className="font-medium">{transactions.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </>
  );
};

export default TransactionTable;