import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import feedbackService from '../../services/feedbackService';
import '../../styles/Employee.css';

const SubmitFeedback = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [existingFeedback, setExistingFeedback] = useState(null);
    const [formData, setFormData] = useState({
        strengths: '',
        areas_for_improvement: '',
        achievements: '',
        suggestions: '',
        overall_rating: 3,
        additional_comments: ''
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAssignmentDetails();
    }, [assignmentId]);

    const fetchAssignmentDetails = async () => {
        try {
            const response = await feedbackService.getAssignmentDetails(assignmentId);
            setAssignment(response.data.assignment);
            
            if (response.data.feedback) {
                const answers = JSON.parse(response.data.feedback.answers);
                setFormData(answers);
                setExistingFeedback(response.data.feedback);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load assignment details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        if (formData.strengths.length < 10) {
            setError('Strengths must be at least 10 characters');
            setSubmitting(false);
            return;
        }

        if (formData.areas_for_improvement.length < 10) {
            setError('Areas for improvement must be at least 10 characters');
            setSubmitting(false);
            return;
        }

        try {
            await feedbackService.submitFeedback({
                assignment_id: parseInt(assignmentId),
                answers: formData
            });

            navigate('/employee/reviews', { 
                state: { message: 'Feedback submitted successfully!' }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading assignment details...</div>;
    }

    if (!assignment) {
        return <div className="error-message">Assignment not found</div>;
    }

    if (existingFeedback) {
        return (
            <div className="feedback-submitted-container">
                <div className="feedback-submitted-card">
                    <div className="success-icon">✓</div>
                    <h1>Feedback Already Submitted</h1>
                    <p>You have already submitted feedback for this performance review.</p>
                    <div className="submitted-info">
                        <p><strong>Employee:</strong> {assignment.employee_name}</p>
                        <p><strong>Review Period:</strong> {assignment.review_period}</p>
                        <p><strong>Submitted on:</strong> {new Date(existingFeedback.submitted_at).toLocaleString()}</p>
                    </div>
                    <button 
                        onClick={() => navigate('/employee/reviews')}
                        className="btn-primary"
                    >
                        Back to My Reviews
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-form-container">
            <div className="feedback-header">
                <h1>Submit Performance Feedback</h1>
                <div className="assignment-info">
                    <p><strong>Employee:</strong> {assignment.employee_name}</p>
                    <p><strong>Review Period:</strong> {assignment.review_period}</p>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-section">
                    <label htmlFor="strengths" className="required-label">
                        What are the employee's key strengths?
                    </label>
                    <textarea
                        id="strengths"
                        name="strengths"
                        value={formData.strengths}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder="Describe specific strengths, skills, and positive attributes you've observed..."
                        className="feedback-textarea"
                    />
                    <small className="char-count">
                        {formData.strengths.length} characters (minimum 10)
                    </small>
                </div>

                <div className="form-section">
                    <label htmlFor="areas_for_improvement" className="required-label">
                        What areas could the employee improve?
                    </label>
                    <textarea
                        id="areas_for_improvement"
                        name="areas_for_improvement"
                        value={formData.areas_for_improvement}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder="Provide constructive feedback on areas where the employee can grow and develop..."
                        className="feedback-textarea"
                    />
                    <small className="char-count">
                        {formData.areas_for_improvement.length} characters (minimum 10)
                    </small>
                </div>

                <div className="form-section">
                    <label htmlFor="achievements">
                        Notable achievements during this review period
                    </label>
                    <textarea
                        id="achievements"
                        name="achievements"
                        value={formData.achievements}
                        onChange={handleChange}
                        rows="4"
                        placeholder="List any significant accomplishments, projects completed, or goals achieved..."
                        className="feedback-textarea"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="suggestions">
                        Suggestions for professional development
                    </label>
                    <textarea
                        id="suggestions"
                        name="suggestions"
                        value={formData.suggestions}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Recommend training, resources, or opportunities that could benefit the employee..."
                        className="feedback-textarea"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="overall_rating" className="required-label">
                        Overall Performance Rating
                    </label>
                    <div className="rating-container">
                        <input
                            type="range"
                            id="overall_rating"
                            name="overall_rating"
                            min="1"
                            max="5"
                            value={formData.overall_rating}
                            onChange={handleChange}
                            className="rating-slider"
                        />
                        <div className="rating-labels">
                            <span className={formData.overall_rating === 1 ? 'active' : ''}>1 - Needs Improvement</span>
                            <span className={formData.overall_rating === 2 ? 'active' : ''}>2 - Below Expectations</span>
                            <span className={formData.overall_rating === 3 ? 'active' : ''}>3 - Meets Expectations</span>
                            <span className={formData.overall_rating === 4 ? 'active' : ''}>4 - Exceeds Expectations</span>
                            <span className={formData.overall_rating === 5 ? 'active' : ''}>5 - Outstanding</span>
                        </div>
                        <div className="rating-value">
                            Selected Rating: <strong>{formData.overall_rating}</strong>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <label htmlFor="additional_comments">
                        Additional Comments (Optional)
                    </label>
                    <textarea
                        id="additional_comments"
                        name="additional_comments"
                        value={formData.additional_comments}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Any other feedback or observations you'd like to share..."
                        className="feedback-textarea"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/employee/reviews')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>

                <div className="form-notice">
                    <p>Please review your feedback carefully. Once submitted, it cannot be edited.</p>
                </div>
            </form>
        </div>
    );
};

export default SubmitFeedback;