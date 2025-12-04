import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import assignmentService from '../../services/assignmentService';
import userService from '../../services/userService';
import '../../styles/Admin.css';

const AssignReviewers = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [review, setReview] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [availableReviewers, setAvailableReviewers] = useState([]);
    const [selectedReviewer, setSelectedReviewer] = useState('');
    const [stats, setStats] = useState({ total: 0, pending: 0, submitted: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchReview(),
                fetchAssignments(),
                fetchAvailableReviewers()
            ]);
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const fetchReview = async () => {
        const response = await reviewService.getReviewById(id);
        setReview(response.data);
    };

    const fetchAssignments = async () => {
        const response = await assignmentService.getReviewAssignments(id);
        setAssignments(response.data);
        setStats(response.stats);
    };

    const fetchAvailableReviewers = async () => {
        const response = await userService.getAllUsers();
        const reviewResponse = await reviewService.getReviewById(id);
        const currentReview = reviewResponse.data;
        
        const reviewers = response.data.filter(user => 
            user.role === 'employee' && 
            user.is_active && 
            user.id !== currentReview.employee_id
        );
        setAvailableReviewers(reviewers);
    };

    const handleAssignReviewer = async (e) => {
        e.preventDefault();
        
        if (!selectedReviewer) {
            setError('Please select a reviewer');
            return;
        }

        try {
            await assignmentService.createAssignment({
                review_id: parseInt(id),
                reviewer_id: parseInt(selectedReviewer)
            });

            setSuccessMessage('Reviewer assigned successfully');
            setSelectedReviewer('');
            fetchAssignments();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign reviewer');
        }
    };

    const handleRemoveAssignment = async (assignmentId) => {
        if (window.confirm('Are you sure you want to remove this reviewer assignment?')) {
            try {
                await assignmentService.deleteAssignment(assignmentId);
                setSuccessMessage('Assignment removed successfully');
                fetchAssignments();
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to remove assignment');
            }
        }
    };

    const unassignedReviewers = availableReviewers.filter(
        reviewer => !assignments.some(assignment => assignment.reviewer_id === reviewer.id)
    );

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!review) {
        return <div className="error-message">Review not found</div>;
    }

    return (
        <div className="assign-reviewers-container">
            <div className="page-header">
                <div>
                    <h1>Assign Reviewers</h1>
                    <p className="review-info">
                        <strong>Employee:</strong> {review.employee_name} | 
                        <strong> Period:</strong> {review.review_period} | 
                        <strong> Status:</strong> <span className={`status-badge status-${review.status}`}>{review.status}</span>
                    </p>
                </div>
                <button onClick={() => navigate('/admin/reviews')} className="btn-secondary">
                    Back to Reviews
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}


            <div className="stats-grid">
                <div className="stat-card-small">
                    <h3>Total Reviewers</h3>
                    <p className="stat-number">{stats.total}</p>
                </div>
                <div className="stat-card-small">
                    <h3>Pending</h3>
                    <p className="stat-number">{stats.pending}</p>
                </div>
                <div className="stat-card-small">
                    <h3>Submitted</h3>
                    <p className="stat-number">{stats.submitted}</p>
                </div>
            </div>

            <div className="assign-form-card">
                <h2>Assign New Reviewer</h2>
                <form onSubmit={handleAssignReviewer} className="assign-form">
                    <div className="form-group-inline">
                        <select
                            value={selectedReviewer}
                            onChange={(e) => setSelectedReviewer(e.target.value)}
                            className="reviewer-select"
                        >
                            <option value="">Select a reviewer</option>
                            {unassignedReviewers.map((reviewer) => (
                                <option key={reviewer.id} value={reviewer.id}>
                                    {reviewer.first_name} {reviewer.last_name} ({reviewer.email})
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn-primary">
                            Assign Reviewer
                        </button>
                    </div>
                </form>
            </div>

            <div className="assigned-reviewers-card">
                <h2>Assigned Reviewers ({assignments.length})</h2>
                {assignments.length === 0 ? (
                    <p className="no-data">No reviewers assigned yet. Assign reviewers to collect feedback.</p>
                ) : (
                    <div className="reviewers-list">
                        {assignments.map((assignment) => (
                            <div key={assignment.id} className="reviewer-item">
                                <div className="reviewer-info">
                                    <div className="reviewer-name">{assignment.reviewer_name}</div>
                                    <div className="reviewer-email">{assignment.reviewer_email}</div>
                                    <div className="reviewer-meta">
                                        Assigned on: {new Date(assignment.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="reviewer-status">
                                    <span className={`status-badge ${assignment.status === 'submitted' ? 'status-completed' : 'status-draft'}`}>
                                        {assignment.status}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveAssignment(assignment.id)}
                                        className="btn-remove"
                                        disabled={assignment.status === 'submitted'}
                                        title={assignment.status === 'submitted' ? 'Cannot remove - feedback already submitted' : 'Remove assignment'}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignReviewers;