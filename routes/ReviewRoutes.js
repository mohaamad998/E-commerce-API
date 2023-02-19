const express = require('express');
const {
  getAllReviews,
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controller/ReviewController');
const { userAuth } = require('../middleware/authentication');
const router = express.Router();

// routes
router.route('/').get(getAllReviews).post(userAuth, createReview);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(userAuth, updateReview)
  .delete(userAuth, deleteReview);

module.exports = router;
