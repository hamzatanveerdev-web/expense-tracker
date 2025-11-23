// src/components/transactions/ImportModal.js
import React, { useState } from 'react';
import { FiX, FiUpload, FiDownload } from 'react-icons/fi';

const ImportModal = ({ isOpen, onClose, onImport }) => {
  const [importData, setImportData] = useState('');
  const [importType, setImportType] = useState('csv');
  const [previewData, setPreviewData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImportData(e.target.result);
        parseCSVData(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const parseCSVData = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(header => header.trim());
    
    const parsedData = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(value => value.trim());
      return {
        id: index + 1,
        name: values[0] || 'Unknown',
        amount: parseFloat(values[1]) || 0,
        type: values[2]?.toLowerCase() === 'income' ? 'income' : 'expense',
        category: values[3] || 'Other',
        date: values[4] || new Date().toISOString().split('T')[0],
        description: values[5] || '',
        status: 'completed'
      };
    });

    setPreviewData(parsedData.slice(0, 5)); // Show first 5 rows as preview
  };

  const handleImport = () => {
    if (previewData.length > 0) {
      onImport(previewData);
      onClose();
      setImportData('');
      setPreviewData([]);
    }
  };

  const sampleCSV = `name,amount,type,category,date,description
Starbucks Coffee,45.00,expense,Food & Dining,2024-01-15,Morning coffee
Salary Deposit,3200.00,income,Salary,2024-01-10,Monthly salary
Amazon Purchase,89.99,expense,Shopping,2024-01-08,Electronics`;

  const downloadSample = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Import Transactions</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Import Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Import Format
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['csv', 'json', 'excel'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setImportType(type)}
                  className={`py-3 px-4 rounded-lg border-2 transition-all ${
                    importType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <input
                type="file"
                accept=".csv,.json,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all inline-block"
              >
                Choose File
              </label>
              <p className="text-sm text-gray-600 mt-2">
                or drag and drop your file here
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports CSV, JSON, Excel files
              </p>
            </div>
          </div>

          {/* Sample Download */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900">Need a template?</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Download our CSV template to ensure proper formatting
                </p>
              </div>
              <button
                onClick={downloadSample}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <FiDownload className="h-4 w-4" />
                <span className="text-sm font-medium">Download Template</span>
              </button>
            </div>
          </div>

          {/* Data Preview */}
          {previewData.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Preview ({previewData.length} transactions)
              </h4>
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previewData.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-gray-900">{transaction.name}</td>
                        <td className={`px-4 py-2 font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full capitalize ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-600">{transaction.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={previewData.length === 0}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiUpload className="h-4 w-4" />
            <span>Import {previewData.length} Transactions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;