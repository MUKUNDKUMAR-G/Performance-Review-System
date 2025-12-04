import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Feedback Review System
                </Link>

                {isAuthenticated && (
                    <div className="navbar-menu">
                        <div className="navbar-user">
                            <span className="user-name">
                                {user.first_name} {user.last_name}
                            </span>
                            <span className="user-role">
                                ({user.role})
                            </span>
                        </div>
                        <button onClick={handleLogout} className="btn-logout">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;