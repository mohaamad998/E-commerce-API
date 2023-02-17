const User = require('../models/UserModel');
const { BadRequestError, NotFoundError } = require('../errors');
const { createJWT, attatchCookiesToRes } = require('../utils');
const { date } = require('joi');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailIsAlreadyExist = await User.findOne({ email });
  if (emailIsAlreadyExist) throw new BadRequestError('email is already exist');

  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? 'admin' : 'user';

  const user = await User.create({ email, password, name, role });

  const userToken = { name: user.name, id: user._id, role: user.role };
  attatchCookiesToRes({ res, user: userToken });

  res.status(201).json({ user: userToken });
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || password)
    throw new BadRequestError('please provide email and password');

  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError('email is not exist');

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) throw new NotFoundError('password is not valid');

  const userToken = { name: user.name, id: user._id, role: user.role };
  attatchCookiesToRes({ user: userToken, res });

  res.status(StatusCodes.OK).json({ user: userToken });
};

// logout
const logout = async (req, res) => {
  res.cookie('toekn', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 3 * 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'logout ' });
};

module.exports = { register, login, logout };
