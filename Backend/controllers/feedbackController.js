const { validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const Assignment = require('../models/Assignment');

exports.getMyAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.getByReviewer(req.user.id);

        const assignmentsWithFeedback = await Promise.all(
            assignments.map(async (assignment) => {
                const feedback = await Feedback.getByAssignment(assignment.id);
                return {
                    ...assignment,
                    has_feedback: !!feedback,
                    feedback_id: feedback?.id || null
                };
            })
        );

        res.json({
            success: true,
            count: assignmentsWithFeedback.length,
            data: assignmentsWithFeedback
        });
    } catch (error) {
        console.error('Get my assignments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getAssignmentDetails = async (req, res) => {
    try {
        const assignmentId = req.params.assignmentId;
        const assignment = await Assignment.getById(assignmentId);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        if (assignment.reviewer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this assignment'
            });
        }

        const feedback = await Feedback.getByAssignment(assignmentId);

        res.json({
            success: true,
            data: {
                assignment,
                feedback: feedback || null
            }
        });
    } catch (error) {
        console.error('Get assignment details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.submitFeedback = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { assignment_id, answers } = req.body;

        const assignment = await Assignment.getById(assignment_id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        if (assignment.reviewer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to submit feedback for this assignment'
            });
        }

        const db = require('../config/database');
        const [reviews] = await db.query(
            'SELECT status FROM performance_reviews WHERE id = ?',
            [assignment.review_id]
        );

        if (reviews.length === 0 || reviews[0].status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This review is not active. Feedback can only be submitted for active reviews.'
            });
        }

        const existingFeedback = await Feedback.getByAssignment(assignment_id);

        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                message: 'Feedback has already been submitted for this assignment'
            });
        }

        const feedbackId = await Feedback.create(assignment_id, answers);

        await Assignment.updateStatus(assignment_id, 'submitted');

        const newFeedback = await Feedback.getById(feedbackId);

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: newFeedback
        });
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getReviewFeedback = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const feedback = await Feedback.getByReview(reviewId);

        const feedbackWithParsedAnswers = feedback.map(f => ({
            ...f,
            answers: JSON.parse(f.answers)
        }));

        res.json({
            success: true,
            count: feedbackWithParsedAnswers.length,
            data: feedbackWithParsedAnswers
        });
    } catch (error) {
        console.error('Get review feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updateFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const { answers } = req.body;

        const feedback = await Feedback.getById(feedbackId);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        if (feedback.reviewer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this feedback'
            });
        }

        await Feedback.update(feedbackId, answers);

        const updatedFeedback = await Feedback.getById(feedbackId);

        res.json({
            success: true,
            message: 'Feedback updated successfully',
            data: updatedFeedback
        });
    } catch (error) {
        console.error('Update feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;

        const feedback = await Feedback.getById(feedbackId);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        await Feedback.delete(feedbackId);

        const db = require('../config/database');
        await db.query(
            'UPDATE review_assignments SET status = ? WHERE id = ?',
            ['pending', feedback.assignment_id]
        );

        res.json({
            success: true,
            message: 'Feedback deleted successfully'
        });
    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};