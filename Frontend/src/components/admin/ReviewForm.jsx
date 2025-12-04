import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import userService from '../../services/userService';
import '../../styles/Admin.css';
const ReviewForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [formData, setFormData] = useState({
    employee_id: '',
    review_period: '',
    status: 'draft'
});

const [employees, setEmployees] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

useEffect(() => {
    fetchEmployees();
    if (isEditMode) {
        fetchReview();
    }
}, [id]);

const fetchEmployees = async () => {
    try {
        const response = await userService.getAllUsers();
        const employeeList = response.data.filter(user => user.role === 'employee' && user.is_active);
        setEmployees(employeeList);
    } catch (err) {
        setError('Failed to fetch employees');
    }
};

const fetchReview = async () => {
    try {
        const response = await reviewService.getReviewById(id);
        const review = response.data;
        setFormData({
            employee_id: review.employee_id,
            review_period: review.review_period,
            status: review.status
        });
    } catch (err) {
        setError('Failed to fetch review data');
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
    setLoading(true);
    setError('');

    try {
        if (isEditMode) {
            await reviewService.updateReview(id, formData);
        } else {
            await reviewService.createReview(formData);
        }

        navigate('/admin/reviews');
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to save review');
    } finally {
        setLoading(false);
    }
};

return (
    <div className="form-container">
        <h1>{isEditMode ? 'Edit Performance Review' : 'Create Performance Review'}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
                <label htmlFor="employee_id">Employee *</label>
                <select
                    id="employee_id"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select an employee</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.first_name} {employee.last_name} ({employee.email})
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="review_period">Review Period *</label>
                <input
                    type="text"
                    id="review_period"
                    name="review_period"
                    value={formData.review_period}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Q1 2024, Annual 2024, Jan-Mar 2024"
                />
                <small className="form-help">Specify the time period for this review</small>
            </div>

            <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>
                <small className="form-help">
                    Draft: Review is being prepared | Active: Reviewers can submit feedback | Completed: Review is finalized
                </small>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={() => navigate('/admin/reviews')}
                    className="btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (isEditMode ? 'Update Review' : 'Create Review')}
                </button>
            </div>
        </form>
    </div>
);
};

export default ReviewForm;