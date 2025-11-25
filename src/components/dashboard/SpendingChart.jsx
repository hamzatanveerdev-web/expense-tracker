import React, { useEffect, useState } from 'react';
import { FiPieChart } from 'react-icons/fi';
import API from '../../api';
const SpendingChart = () => {
  const [categories, setCategories] = useState([]);

  const colors = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-teal-500"
  ];
    const api_url=process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
     
        const res = await API.get(`/transactions/dashboard/spending-by-category`);
        setCategories(res.data);
      } catch (error) {
        console.error("Failed loading spending categories:", error);
      }
    };

fetchData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
        <FiPieChart className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie Placeholder (still your custom UI) */}
        <div className="relative h-48 flex items-center justify-center">
          <div className="relative w-32 h-32">

            {categories.map((category, index) => {
              const sliceColor = colors[index % colors.length];
              return (
                <div
                  key={category.name}
                  className={`absolute inset-0 rounded-full border-8 ${sliceColor} opacity-80`}
                  style={{
                    clipPath: `polygon(
                      50% 50%, 
                      50% 0%, 
                      ${50 + 50 * Math.cos(2 * Math.PI * (index / categories.length))}% 
                      ${50 + 50 * Math.sin(2 * Math.PI * (index / categories.length))}%
                    )`
                  }}
                />
              );
            })}

          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            categories.map((category, index) => {
              const color = colors[index % colors.length];

              return (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${category.amount}</p>
                    <p className="text-xs text-gray-500">{category.percentage}%</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default SpendingChart;
