const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'please provide name '],
      maxLength: [100, 'name can not be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'please provide price '],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'please provide description '],
      maxLength: [1000, 'description can not be more than 1000 characters'],
    },
    image: {
      type: String,
      trim: true,
      default: '/uploads/example.jpej',
    },
    category: {
      type: String,

      required: [true, 'please provide category '],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{value} is not supported',
      },
      required: [true, 'please provide company'],
    },
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    avarageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

productSchema.pre('remove', async function () {
  await this.model('Review').deleteMany({ product: this._id });
});
module.exports = mongoose.model('Product', productSchema);
