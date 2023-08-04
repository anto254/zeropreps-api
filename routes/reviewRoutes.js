const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController')

router
    .post('/', reviewController.createReview)
    .get('/', reviewController.getAllReviews)
    .delete('/:reviewId', reviewController.deleteReview)
    .get('/one/:reviewId', reviewController.getReviewById)
    .patch('/:reviewId', reviewController.editReview)

module.exports = router