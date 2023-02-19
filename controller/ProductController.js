const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const path = require('path');

const Product = require('../models/Product');
const Review = require('../models/ReviewModel');
//
const createProduct = async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

//
const getAllProduct = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
};

//
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId).populate('reviews');

  if (!product)
    throw new NotFoundError(`product with id : ${productId} is not found`);

  res.status(StatusCodes.OK).json({ product });
};

//
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product)
    throw new NotFoundError(`product with id : ${productId} is not found`);

  res.status(StatusCodes.OK).json({ product });
};

//
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);

  if (!product)
    throw new NotFoundError(`product with id : ${productId} is not found`);

  await product.remove();

  res.status(StatusCodes.OK).json({ msg: 'deleted' });
};

//
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews });
};

//
const uploadImage = async (req, res) => {
  if (!req.files) throw new BadRequestError('no files was uploaded');
  const productImage = req.files.image;
  console.log(productImage);

  if (!productImage.mimetype.startsWith('image'))
    throw new BadRequestError('no image was uploaded ');

  const max = 1024 * 1024;
  if (productImage.size > max)
    throw new BadRequestError('image must be less than 1m');

  const imagePath = path.join(
    __dirname,
    `../public/uploads/${productImage.name}`
  );

  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};
// mimetype: image/jpeg
//  size

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  uploadImage,
  deleteProduct,
  getSingleProductReviews,
};
