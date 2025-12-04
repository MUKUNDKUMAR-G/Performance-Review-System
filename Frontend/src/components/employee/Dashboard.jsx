import React from 'react';
import useAuth from '../../hooks/useAuth';
import '../../styles/Employee.css';

const EmployeeDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <h1>Welcome, {user.first_name}!</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon"></div>
                    <div className="stat-content">
                        <h3>Pending Reviews</h3>
                        <p className="stat-number">0</p>
                        <p className="stat-description">Reviews waiting for your feedback</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon"></div>
                    <div className="stat-content">
                        <h3>Completed</h3>
                        <p className="stat-number">0</p>
                        <p className="stat-description">Feedback submissions completed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard