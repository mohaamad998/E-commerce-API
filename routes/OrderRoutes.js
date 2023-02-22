const express = require('express');
const {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrder,
  getCurrentUserOrders,
} = require('../controller/orderController');
const {
  userAuth,
  authorizePermission,
} = require('../middleware/authentication');
const router = express.Router();

// routes
router
  .route('/')
  .get(userAuth, authorizePermission('admin', 'user'), getAllOrders)
  .post(userAuth, createOrder);

router.route('/showAllMyOrders').get(userAuth, getCurrentUserOrders);

router.route('/:id').get(userAuth, getSingleOrder).patch(userAuth, updateOrder);

module.exports = router;
