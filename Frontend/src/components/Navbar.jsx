import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              Performance Review System
            </Link>
            
            {isAdmin() ? (
              <div className="flex space-x-4">
                <Link
                  to="/admin/dashboard"
                  className="hover:bg-indigo-700 px-3 py-2 rounded transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/pending-users"
                  className="hover:bg-indigo-700 px-3 py-2 rounded transition"
                >
                  Pending Users
                </Link>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/employee/dashboard"
                  className="hover:bg-indigo-700 px-3 py-2 rounded transition"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              <span className="ml-2 px-2 py-1 bg-indigo-700 rounded text-xs">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;