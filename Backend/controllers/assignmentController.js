const { validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Review = require('../models/Review');

exports.getReviewAssignments = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.getById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const assignments = await Assignment.getByReview(reviewId);
        const stats = await Assignment.getReviewStats(reviewId);

        res.json({
            success: true,
            count: assignments.length,
            stats: stats,
            data: assignments
        });
    } catch (error) {
        console.error('Get review assignments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.createAssignment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { review_id, reviewer_id } = req.body;

        const review = await Review.getById(review_id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const db = require('../config/database');
        const [reviewers] = await db.query(
            'SELECT id, first_name, last_name FROM users WHERE id = ? AND role = ?',
            [reviewer_id, 'employee']
        );

        if (reviewers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reviewer not found or not an employee'
            });
        }

        if (parseInt(reviewer_id) === parseInt(review.employee_id)) {
            return res.status(400).json({
                success: false,
                message: 'Employee cannot review themselves'
            });
        }

        const exists = await Assignment.exists(review_id, reviewer_id);
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'This reviewer is already assigned to this review'
            });
        }

        const assignmentId = await Assignment.create(review_id, reviewer_id);
        const newAssignment = await Assignment.getById(assignmentId);

        res.status(201).json({
            success: true,
            message: 'Reviewer assigned successfully',
            data: newAssignment
        });
    } catch (error) {
        console.error('Create assignment error:', error);
        if (error.message === 'This reviewer is already assigned to this review') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;

        // Check if assignment exists
        const assignment = await Assignment.getById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        const db = require('../config/database');
        const [feedback] = await db.query(
            'SELECT id FROM feedback WHERE assignment_id = ?',
            [assignmentId]
        );

        if (feedback.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot remove assignment - feedback has already been submitted'
            });
        }

        await Assignment.delete(assignmentId);

        res.json({
            success: true,
            message: 'Assignment removed successfully'
        });
    } catch (error) {
        console.error('Delete assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getMyAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.getByReviewer(req.user.id);

        res.json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    } catch (error) {
        console.error('Get my assignments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};