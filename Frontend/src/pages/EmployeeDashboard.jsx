import React from 'react';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-gray-600">You're logged in as an employee</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              🚀 Coming Soon
            </h2>
            <p className="text-blue-700">
              Performance review features will be available here soon. You'll be able to:
            </p>
            <ul className="mt-4 text-left text-blue-700 space-y-2 max-w-md mx-auto">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                View performance reviews assigned to you
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Submit feedback for your colleagues
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Track your submitted reviews
              </li>
            </ul>
          </div>

          <div className="text-gray-500 text-sm">
            Your account is verified and active ✓
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;