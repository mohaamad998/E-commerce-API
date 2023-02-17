const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const User = require('../models/UserModel');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');

  if (!user) throw new NotFoundError(`no user found with id  : ${id}`);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async () => {};

const updateUser = async () => {};

const updateUserPassword = async () => {};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
