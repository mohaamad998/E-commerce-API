const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'please provide rating'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'please provide title'],
      maxLength: 100,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, 'please provide comment'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.model('Review').aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        numberOfRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
    // [ { _id: null, numberOfRatings: 1, averageRating: 3.5 } ]
  ]);

  await this.model('Product').findByIdAndUpdate(productId, {
    averageRating: result[0]?.averageRating || 0,
    numberOfRatings: result[0]?.numberOfRatings || 0,
  });
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
