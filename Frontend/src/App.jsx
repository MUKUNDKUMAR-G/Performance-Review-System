import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import EmployeeList from './components/admin/EmployeeList';
import EmployeeForm from './components/admin/EmployeeForm';
import EmployeeDashboard from './components/employee/Dashboard';

import './styles/App.css';
import useAuth from './hooks/useAuth';

const DashboardLayout = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    return (
        <>
            <Navbar />
            {isAuthenticated && (
                <div className="main-container">
                    <Sidebar />
                    <div className="content-area">
                        {children}
                    </div>
                </div>
            )}
            {!isAuthenticated && children}
        </>
    );
};

const Home = () => {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    if (user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    return <Navigate to="/employee/dashboard" replace />;
};

const Unauthorized = () => (
    <div className="error-page">
        <h1>403 - Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
    </div>
);

const App = () =>{
    return (
        <Router>
            <AuthProvider>
                <DashboardLayout>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* Admin routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/employees"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <EmployeeList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/employees/new"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                  <EmployeeForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/employees/edit/:id"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                  <EmployeeForm />
                                </ProtectedRoute>
                            }
                        />
                                  
                    <Route
                        path="/employee/dashboard"
                        element={
                            <ProtectedRoute requiredRole="employee">
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </DashboardLayout>
        </AuthProvider>
    </Router>
);
}

export default App;