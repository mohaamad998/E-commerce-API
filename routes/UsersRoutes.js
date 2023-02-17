const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUserPassword,
  updateUser,
  showCurrentUser,
} = require('../controller/UsersContoller');

const { userAuth } = require('../middleware/authentication');

router.route('/').get(userAuth, getAllUsers);
router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').post(updateUser);
router.route('/updateUserPassword').post(updateUserPassword);
router.route('/:id').get(getSingleUser);

module.exports = router;
