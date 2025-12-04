const { validationResult } = require('express-validator');
const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.getAll();
        
        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.getById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Get review by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.createReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { employee_id, review_period, status } = req.body;

        const db = require('../config/database');
        const [employees] = await db.query(
            'SELECT id FROM users WHERE id = ? AND role = ?',
            [employee_id, 'employee']
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const reviewData = {
            employee_id,
            review_period,
            status: status || 'draft',
            created_by: req.user.id
        };

        const reviewId = await Review.create(reviewData);
        const newReview = await Review.getById(reviewId);

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: newReview
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const reviewId = req.params.id;
        const { employee_id, review_period, status } = req.body;

        const existingReview = await Review.getById(reviewId);
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        if (employee_id) {
            const db = require('../config/database');
            const [employees] = await db.query(
                'SELECT id FROM users WHERE id = ? AND role = ?',
                [employee_id, 'employee']
            );

            if (employees.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }
        }

        const updateData = {};
        if (employee_id !== undefined) updateData.employee_id = employee_id;
        if (review_period !== undefined) updateData.review_period = review_period;
        if (status !== undefined) updateData.status = status;

        await Review.update(reviewId, updateData);
        const updatedReview = await Review.getById(reviewId);

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        // Check if review exists
        const existingReview = await Review.getById(reviewId);
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await Review.delete(reviewId);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getReviewStats = async (req, res) => {
    try {
        const stats = await Review.getStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get review stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};