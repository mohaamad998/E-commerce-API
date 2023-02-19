const express = require('express');
const router = express.Router();

const {
  getAllProduct,
  createProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,

  uploadImage,
  getSingleProductReviews,
} = require('../controller/ProductController');

const {
  authorizePermission,
  userAuth,
} = require('../middleware/authentication');

// routes

router
  .route('/')
  .get(getAllProduct)
  .post([userAuth, authorizePermission('admin')], createProduct);

router
  .route('/uploadImage')
  .post([userAuth, authorizePermission('admin')], uploadImage);

router.route('/:id/reviews').get(getSingleProductReviews);

router
  .route('/:id')
  .get(getSingleProduct)
  .delete([userAuth, authorizePermission('admin')], deleteProduct)
  .patch([userAuth, authorizePermission('admin')], updateProduct);

module.exports = router;
