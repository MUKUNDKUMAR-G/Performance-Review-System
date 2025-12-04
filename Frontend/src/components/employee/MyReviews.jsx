import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import feedbackService from '../../services/feedbackService';
import '../../styles/Employee.css';

const MyReviews = () => {
    const location = useLocation();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchAssignments();

        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            window.history.replaceState({}, document.title);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [location]);

    const fetchAssignments = async () => {
        try {
            const response = await feedbackService.getMyAssignments();
            setAssignments(response.data);
        } catch (err) {
            setError('Failed to fetch assignments');
        } finally {
            setLoading(false);
        }
    };

    const pendingAssignments = assignments.filter(
        a => a.status === 'pending' && a.review_status === 'active'
    );
    const completedAssignments = assignments.filter(a => a.status === 'submitted');

    if (loading) {
        return <div className="loading">Loading your reviews...</div>;
    }

    return (
        <div className="my-reviews-container">
            <h1>My Performance Reviews</h1>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="reviews-section">
                <h2>Pending Feedback ({pendingAssignments.length})</h2>
                {pendingAssignments.length === 0 ? (
                    <div className="empty-state">
                        <p>No pending reviews. You're all caught up!</p>
                    </div>
                ) : (
                    <div className="reviews-grid">
                        {pendingAssignments.map((assignment) => (
                            <div key={assignment.id} className="review-card">
                                <div className="review-card-header">
                                    <h3>{assignment.employee_name}</h3>
                                    <span className="status-badge status-pending">Pending</span>
                                </div>
                                <div className="review-card-body">
                                    <p><strong>Review Period:</strong> {assignment.review_period}</p>
                                    <p><strong>Employee Email:</strong> {assignment.employee_email}</p>
                                    <p className="review-meta">
                                        Assigned on: {new Date(assignment.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="review-card-footer">
                                    <Link 
                                        to={`/employee/feedback/${assignment.id}`}
                                        className="btn-primary"
                                    >
                                        Submit Feedback
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="reviews-section">
                <h2>Completed Feedback ({completedAssignments.length})</h2>
                {completedAssignments.length === 0 ? (
                    <div className="empty-state">
                        <p>No completed reviews yet.</p>
                    </div>
                ) : (
                    <div className="completed-reviews-list">
                        {completedAssignments.map((assignment) => (
                            <div key={assignment.id} className="completed-review-item">
                                <div className="completed-review-info">
                                    <h4>{assignment.employee_name}</h4>
                                    <p>{assignment.review_period}</p>
                                </div>
                                <div className="completed-review-meta">
                                    <span className="status-badge status-completed">✓ Completed</span>
                                    <span className="completion-date">
                                        Assigned: {new Date(assignment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviews;