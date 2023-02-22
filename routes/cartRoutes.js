const express = require('express');
const {
  addItemToCart,
  getAllCarts,
  removeAllCartItems,
  getUserCart,
} = require('../controller/CartController');
const { userAuth } = require('../middleware/authentication');
const router = express.Router();

// routes
router.route('/').post(userAuth, addItemToCart);
router.route('/').get(getAllCarts);
router.route('/removeAllCartItems/:id').delete(removeAllCartItems);
router.route('/getUserCart').get(userAuth, getUserCart);

module.exports = router;
