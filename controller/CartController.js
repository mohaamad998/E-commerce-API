const { BadRequestError, NotFoundError } = require('../errors');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { StatusCodes } = require('http-status-codes');

//
const addItemToCart = async (req, res) => {
  const { product: productId, amount } = req.body;

  // check product is exist at db
  const product = await Product.findById(productId);
  if (!product)
    throw new NotFoundError(`no item found with this id ${productId}`);

  const { name, image, price, _id } = product;
  const singleItemCart = { name, image, price, amount, product: _id };

  // get user cart , and check if the item is in the cart or not
  const cart = await Cart.findOne({ user: req.user.id });

  const itemIndex = cart.cartItems.findIndex((item) => {
    return item.product.toString() === singleItemCart.product.toString();
  });

  console.log(itemIndex, singleItemCart.product.toString());

  const item = cart.cartItems[itemIndex];

  if (item) {
    console.log('yes');
    cart.cartItems[itemIndex] = { ...singleItemCart };
  } else {
    cart.cartItems.push(singleItemCart);
  }

  await cart.save();

  res.status(StatusCodes.OK).json({ cart, singleItemCart });
};
//

const removeAllCartItems = async (req, res) => {
  const { id: cartId } = req.params;
  const cart = await Cart.findById(cartId);
  if (!cart) throw new NotFoundError(`no cart was found with ${cartId}`);

  // check permission

  cart.cartItems = [];
  await cart.save();
};

//
const getAllCarts = async (req, res) => {
  const carts = await Cart.find({});
  res.status(StatusCodes.OK).json({ carts });
};

//
const getUserCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'user',
    select: 'name',
  });
  res.status(StatusCodes.OK).json({ cart });
};

module.exports = {
  addItemToCart,
  getAllCarts,
  removeAllCartItems,
  getUserCart,
};
//
