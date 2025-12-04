const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { feedbackValidation } = require('../utils/validators');

router.use(auth);

router.get('/my-assignments', roleCheck('employee'), feedbackController.getMyAssignments);

router.get('/assignment/:assignmentId', roleCheck('employee'), feedbackController.getAssignmentDetails);

router.post('/', roleCheck('employee'), feedbackValidation, feedbackController.submitFeedback);

router.put('/:id', roleCheck('employee'), feedbackController.updateFeedback);

router.get('/review/:reviewId', roleCheck('admin'), feedbackController.getReviewFeedback);

router.delete('/:id', roleCheck('admin'), feedbackController.deleteFeedback);

module.exports = router;