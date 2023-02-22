const { BadRequestError, NotFoundError } = require('../errors');
const Order = require('../models/OrderModel');
const { StatusCodes } = require('http-status-codes');
const Cart = require('../models/Cart');
const { checkPermisions } = require('../utils/checkPermisions');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'random secret';
  return { client_secret, amount };
};

// *
const createOrder = async (req, res) => {
  const { tax, shippingFee } = req.body;

  // check the if user has already pending order
  const isUserHasOrder = await Order.findOne({
    user: req.user.id,
    status: 'pending',
  });
  console.log(isUserHasOrder);
  if (isUserHasOrder)
    throw new BadRequestError('user has already pending order');

  if (!tax || !shippingFee)
    throw new BadRequestError('please provide tax and shipping fee');

  // user cart
  const cart = await Cart.findOne({ user: req.user.id });
  const { cartItems } = cart;

  if (cartItems.length < 1) {
    throw new BadRequestError('cart is empty');
  }

  const subtotal = cartItems.reduce(
    (acc, curr) => acc + curr.price * curr.amount,
    0
  );
  const total = subtotal + tax + shippingFee;

  // client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });

  // order
  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    user: req.user.id,
    clientSecret: paymentIntent.client_secret,
    orderItems: cartItems,
  });

  res.status(StatusCodes.OK).json({ order, clientSecret: order.clientSecret });
};

// *
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders });
  // const orders = await Order.deleteMany({});
};

//
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) throw new NotFoundError(`order with ${orderId} is not exist`);
  checkPermisions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};

//
const getCurrentUserOrders = async (req, res) => {
  const { id: userId } = req.user;
  const order = await Order.find({ user: userId });
  if (!order) throw new NotFoundError(`this is no order for user : ${userId}`);

  res.status(StatusCodes.OK).json({ order });
};

//
const updateOrder = async (req, res) => {
  const {
    body: { paymentIntentId },
    params: { id: orderId },
  } = req;

  if (!paymentIntentId) throw new BadRequestError('please provide paymentId');

  const order = await Order.findById(orderId);
  if (!order)
    throw new NotFoundError(`there is no order was found with id :${orderId}`);
  checkPermisions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
