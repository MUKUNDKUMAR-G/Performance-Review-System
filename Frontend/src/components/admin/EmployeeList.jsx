import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import '../../styles/Admin.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await userService.getAllUsers();
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await userService.toggleUserStatus(id, !currentStatus);
            setSuccessMessage(`Employee ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            fetchEmployees();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to update employee status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await userService.deleteUser(id);
                setSuccessMessage('Employee deleted successfully');
                fetchEmployees();
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete employee');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading employees...</div>;
    }

    return (
        <div className="employee-list-container">
            <div className="page-header">
                <h1>Employee Management</h1>
                <Link to="/admin/employees/new" className="btn-primary">
                    Add New Employee
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="table-container">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">No employees found</td>
                            </tr>
                        ) : (
                            employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{employee.first_name} {employee.last_name}</td>
                                    <td>{employee.email}</td>
                                    <td>
                                        <span className={`role-badge ${employee.role}`}>
                                            {employee.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${employee.is_active ? 'active' : 'inactive'}`}>
                                            {employee.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{new Date(employee.created_at).toLocaleDateString()}</td>
                                    <td className="action-buttons">
                                        <Link 
                                            to={`/admin/employees/edit/${employee.id}`}
                                            className="btn-edit"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleToggleStatus(employee.id, employee.is_active)}
                                            className={`btn-toggle ${employee.is_active ? 'deactivate' : 'activate'}`}
                                        >
                                            {employee.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee.id)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeList;