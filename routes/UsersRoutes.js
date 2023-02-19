const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUserPassword,
  updateUser,
  showCurrentUser,
} = require('../controller/UsersContoller');

const {
  userAuth,
  authorizePermission,
} = require('../middleware/authentication');

router
  .route('/')
  .get(userAuth, authorizePermission('user', 'admin'), getAllUsers);

router.route('/showMe').get(userAuth, showCurrentUser);

router.route('/updateUser').patch(userAuth, updateUser);

router.route('/updateUserPassword').patch(userAuth, updateUserPassword);

router.route('/:id').get(userAuth, getSingleUser);

module.exports = router;
