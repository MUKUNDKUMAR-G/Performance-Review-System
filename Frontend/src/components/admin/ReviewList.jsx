import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import '../../styles/Admin.css';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await reviewService.getAllReviews();
            setReviews(response.data);
        } catch (err) {
            setError('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this review? All associated assignments and feedback will also be deleted.')) {
            try {
                await reviewService.deleteReview(id);
                setSuccessMessage('Review deleted successfully');
                fetchReviews();
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete review');
            }
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'draft':
                return 'status-draft';
            case 'active':
                return 'status-active';
            case 'completed':
                return 'status-completed';
            default:
                return '';
        }
    };

    if (loading) {
        return <div className="loading">Loading reviews...</div>;
    }

    return (
        <div className="review-list-container">
            <div className="page-header">
                <h1>Performance Reviews</h1>
                <Link to="/admin/reviews/new" className="btn-primary">
                    Create New Review
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="table-container">
                <table className="review-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Review Period</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">No reviews found</td>
                            </tr>
                        ) : (
                            reviews.map((review) => (
                                <tr key={review.id}>
                                    <td>{review.id}</td>
                                    <td>
                                        <div>
                                            <div className="employee-name">{review.employee_name}</div>
                                            <div className="employee-email">{review.employee_email}</div>
                                        </div>
                                    </td>
                                    <td>{review.review_period}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeClass(review.status)}`}>
                                            {review.status}
                                        </span>
                                    </td>
                                    <td>{review.created_by_name}</td>
                                    <td>{new Date(review.created_at).toLocaleDateString()}</td>
                                    <td className="action-buttons">
                                        <Link 
                                            to={`/admin/reviews/${review.id}/assign`}
                                            className="btn-assign"
                                        >
                                            Assign Reviewers
                                        </Link>
                                        <Link 
                                            to={`/admin/reviews/${review.id}/feedback`}
                                            className="btn-view-feedback"
                                        >
                                            View Feedback
                                        </Link>
                                        <Link 
                                            to={`/admin/reviews/edit/${review.id}`}
                                            className="btn-edit"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(review.id)}
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

export default ReviewList;