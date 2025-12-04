import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import '../../styles/Admin.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        pendingApprovals: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await userService.getAllUsers();
            const users = response.data;

            const stats = {
                totalEmployees: users.filter(u => u.role === 'employee').length,
                activeEmployees: users.filter(u => u.role === 'employee' && u.is_active).length,
                pendingApprovals: users.filter(u => !u.is_active).length
            };

            setStats(stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Total Employees</h3>
                        <p className="stat-number">{stats.totalEmployees}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Active Employees</h3>
                        <p className="stat-number">{stats.activeEmployees}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Pending Approvals</h3>
                        <p className="stat-number">{stats.pendingApprovals}</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <a href="/admin/employees" className="action-btn">
                        Manage Employees
                    </a>
                    <a href="/admin/reviews" className="action-btn">
                        Manage Reviews
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;