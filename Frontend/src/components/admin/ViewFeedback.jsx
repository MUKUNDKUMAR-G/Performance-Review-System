import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import feedbackService from '../../services/feedbackService';
import reviewService from '../../services/reviewService';
import '../../styles/Admin.css';

const ViewFeedback = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [review, setReview] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [reviewResponse, feedbackResponse] = await Promise.all([
                reviewService.getReviewById(id),
                feedbackService.getReviewFeedback(id)
            ]);

            setReview(reviewResponse.data);
            setFeedback(feedbackResponse.data);
        } catch (err) {
            setError('Failed to load feedback');
        } finally {
            setLoading(false);
        }
    };

    const getRatingLabel = (rating) => {
        const labels = {
            1: 'Needs Improvement',
            2: 'Below Expectations',
            3: 'Meets Expectations',
            4: 'Exceeds Expectations',
            5: 'Outstanding'
        };
        return labels[rating] || 'N/A';
    };

    const getAverageRating = () => {
        if (feedback.length === 0) return 0;
        const sum = feedback.reduce((acc, f) => acc + (f.answers.overall_rating || 0), 0);
        return (sum / feedback.length).toFixed(1);
    };

    if (loading) {
        return <div className="loading">Loading feedback...</div>;
    }
    if (!review) {
    return <div className="error-message">Review not found</div>;
}

return (
    <div className="view-feedback-container">
        <div className="page-header">
            <div>
                <h1>Performance Review Feedback</h1>
                <div className="review-summary">
                    <p><strong>Employee:</strong> {review.employee_name}</p>
                    <p><strong>Review Period:</strong> {review.review_period}</p>
                    <p><strong>Status:</strong> <span className={`status-badge status-${review.status}`}>{review.status}</span></p>
                </div>
            </div>
            <button onClick={() => navigate('/admin/reviews')} className="btn-secondary">
                Back to Reviews
            </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="feedback-stats">
            <div className="stat-card-small">
                <h3>Total Feedback</h3>
                <p className="stat-number">{feedback.length}</p>
            </div>
            <div className="stat-card-small">
                <h3>Average Rating</h3>
                <p className="stat-number">{getAverageRating()} / 5.0</p>
            </div>
        </div>

        {feedback.length === 0 ? (
            <div className="empty-state">
                <p>No feedback submitted yet for this review.</p>
            </div>
        ) : (
            <div className="feedback-list">
                {feedback.map((item, index) => (
                    <div key={item.id} className="feedback-card">
                        <div className="feedback-card-header">
                            <h3>Feedback #{index + 1}</h3>
                            <div className="feedback-meta">
                                <span className="reviewer-name">By: {item.reviewer_name}</span>
                                <span className="submission-date">
                                    {new Date(item.submitted_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="feedback-card-body">
                            <div className="feedback-section">
                                <h4>Overall Rating</h4>
                                <div className="rating-display">
                                    <span className="rating-stars">
                                        {'★'.repeat(item.answers.overall_rating)}
                                        {'☆'.repeat(5 - item.answers.overall_rating)}
                                    </span>
                                    <span className="rating-text">
                                        {item.answers.overall_rating} / 5 - {getRatingLabel(item.answers.overall_rating)}
                                    </span>
                                </div>
                            </div>

                            <div className="feedback-section">
                                <h4>Key Strengths</h4>
                                <p>{item.answers.strengths}</p>
                            </div>

                            <div className="feedback-section">
                                <h4>Areas for Improvement</h4>
                                <p>{item.answers.areas_for_improvement}</p>
                            </div>

                            {item.answers.achievements && (
                                <div className="feedback-section">
                                    <h4>Notable Achievements</h4>
                                    <p>{item.answers.achievements}</p>
                                </div>
                            )}

                            {item.answers.suggestions && (
                                <div className="feedback-section">
                                    <h4>Professional Development Suggestions</h4>
                                    <p>{item.answers.suggestions}</p>
                                </div>
                            )}

                            {item.answers.additional_comments && (
                                <div className="feedback-section">
                                    <h4>Additional Comments</h4>
                                    <p>{item.answers.additional_comments}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
};

export default ViewFeedback;