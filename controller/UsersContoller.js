const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const User = require('../models/UserModel');
const { attatchCookiesToRes, checkPermisions } = require('../utils');
const { createTokenUser } = require('../utils/createTokenUser');

//get all users
const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');

  res.status(StatusCodes.OK).json({ users });
};

//get single user
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');

  if (!user) throw new NotFoundError(`no user found with id  : ${id}`);

  console.log(req.user);
  checkPermisions(req.user, id);
  res.status(StatusCodes.OK).json({ user });
};

// show current user
const showCurrentUser = async (req, res) => {
  console.log(req.user);
  res.status(StatusCodes.OK).json({ user: req.user });
};

// update user
const updateUser = async (req, res) => {
  const {
    body: { name, email },
    user: { id },
  } = req;
  if (!name || !email) throw new BadRequestconsole.log(req.user);

  // check for unique email
  // const emailIsAlreadyExist = await User.find({ email });
  // if (emailIsAlreadyExist) throw new BadRequestError('email is already exist');

  const user = await User.findById(id);

  user.name = name;
  user.email = email;

  await user.save();

  const userToken = createTokenUser(user);
  attatchCookiesToRes({ res, user: userToken });

  res.status(StatusCodes.OK).json({ user: userToken });
};

// update user password
const updateUserPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const { id } = req.user;

  if (!newPassword || !oldPassword)
    throw new BadRequestError('please provide the old and new password');

  const user = await User.findById(id);

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) throw new BadRequestError('password is not correct');

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json('updated');
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
