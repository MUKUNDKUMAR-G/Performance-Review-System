import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/Sidebar.css';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="sidebar">
            <div className="sidebar-menu">
                {user.role === 'admin' ? (
                    <>
                        <Link to="/admin/dashboard" className={`sidebar-item ${isActive('/admin/dashboard')}`}>
                            Dashboard
                        </Link>
                        <Link to="/admin/employees" className={`sidebar-item ${isActive('/admin/employees')}`}>
                            Employees
                        </Link>
                        <Link to="/admin/reviews" className={`sidebar-item ${isActive('/admin/reviews')}`}>
                            Reviews
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/employee/dashboard" className={`sidebar-item ${isActive('/employee/dashboard')}`}>
                            Dashboard
                        </Link>
                        <Link to="/employee/reviews" className={`sidebar-item ${isActive('/employee/reviews')}`}>
                            My Reviews
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;