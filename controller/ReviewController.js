const Review = require('../models/ReviewModel');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');

const { checkPermisions } = require('../utils');
const {
  NotFoundError,
  UnAuthorizedError,
  BadRequestError,
} = require('../errors');

//
const createReview = async (req, res) => {
  const {
    body: { product: productId },
    user: { id: userID },
  } = req;
  req.body.user = userID;

  if (!productId) throw new BadRequestError('please provide product id');

  const isValidProduct = await Product.findById(productId);
  if (!isValidProduct)
    throw new NotFoundError(`prodcut with id ${productId} is not exist`);

  const isAlreadySubmitted = await Review.findOne({
    product: productId,
    user: userID,
  });
  console.log(isAlreadySubmitted);
  if (isAlreadySubmitted)
    throw new BadRequestError('alreday submitted review for this product');

  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

//
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: 'user',
      select: 'name',
    })
    .populate({ path: 'product', select: 'name company' });
  res.status(StatusCodes.OK).json(reviews);
};

//
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review)
    throw new NotFoundError(`no review with id : ${reviewId} was found`);
  res.status(StatusCodes.OK).json({ review });
};

//
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { title, comment, rating } = req.body;

  const review = await Review.findById(reviewId);
  if (!review)
    throw new NotFoundError(`no review with id : ${reviewId} was found`);

  checkPermisions(req.user, review.user);

  review.title = title;
  review.rating = rating;
  review.comment = comment;

  await review.save();

  review.title = review.title = res.status(StatusCodes.OK).json({ review });
};

//
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review)
    throw new NotFoundError(`no review with id : ${reviewId} was found`);

  checkPermisions(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).json({ msg: 'deleted' });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
