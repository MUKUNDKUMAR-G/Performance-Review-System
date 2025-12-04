const { body } = require('express-validator');

const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters'),
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters')
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const userUpdateValidation = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('first_name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters'),
    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters'),
    body('role')
        .optional()
        .isIn(['admin', 'employee'])
        .withMessage('Role must be either admin or employee')
];

const reviewValidation = [
    body('employee_id')
        .notEmpty()
        .withMessage('Employee ID is required')
        .isInt()
        .withMessage('Employee ID must be a number'),
    body('review_period')
        .notEmpty()
        .withMessage('Review period is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Review period must be at least 3 characters'),
    body('status')
        .optional()
        .isIn(['draft', 'active', 'completed'])
        .withMessage('Status must be draft, active, or completed')
];

const reviewUpdateValidation = [
    body('employee_id')
        .optional()
        .isInt()
        .withMessage('Employee ID must be a number'),
    body('review_period')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Review period must be at least 3 characters'),
    body('status')
        .optional()
        .isIn(['draft', 'active', 'completed'])
        .withMessage('Status must be draft, active, or completed')
];

const assignmentValidation = [
    body('review_id')
        .notEmpty()
        .withMessage('Review ID is required')
        .isInt()
        .withMessage('Review ID must be a number'),
    body('reviewer_id')
        .notEmpty()
        .withMessage('Reviewer ID is required')
        .isInt()
        .withMessage('Reviewer ID must be a number')
];

const feedbackValidation = [
    body('assignment_id')
        .notEmpty()
        .withMessage('Assignment ID is required')
        .isInt()
        .withMessage('Assignment ID must be a number'),
    body('answers')
        .notEmpty()
        .withMessage('Feedback answers are required')
        .isObject()
        .withMessage('Answers must be an object'),
    body('answers.strengths')
        .notEmpty()
        .withMessage('Strengths field is required')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Strengths must be at least 10 characters'),
    body('answers.areas_for_improvement')
        .notEmpty()
        .withMessage('Areas for improvement field is required')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Areas for improvement must be at least 10 characters'),
    body('answers.overall_rating')
        .notEmpty()
        .withMessage('Overall rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5')
];

module.exports = {
    registerValidation,
    loginValidation,
    userUpdateValidation,
    reviewValidation,
    reviewUpdateValidation,
    assignmentValidation,
    feedbackValidation
};