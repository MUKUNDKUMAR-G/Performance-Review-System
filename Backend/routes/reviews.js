const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { reviewValidation, reviewUpdateValidation } = require('../utils/validators');

router.use(auth);
router.use(roleCheck('admin'));

router.get('/stats', reviewController.getReviewStats);

router.get('/', reviewController.getAllReviews);


router.get('/:id', reviewController.getReviewById);

router.post('/', reviewValidation, reviewController.createReview);

router.put('/:id', reviewUpdateValidation, reviewController.updateReview);

router.delete('/:id', reviewController.deleteReview);

module.exports = router;