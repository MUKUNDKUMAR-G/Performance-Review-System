const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { assignmentValidation } = require('../utils/validators');

router.use(auth);

router.get('/my-assignments', roleCheck('employee'), assignmentController.getMyAssignments);

router.use(roleCheck('admin'));

router.get('/review/:reviewId', assignmentController.getReviewAssignments);

router.post('/', assignmentValidation, assignmentController.createAssignment);

router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;