const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    tax: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'failed', 'delivered', 'canceled', 'paid'],
      default: 'pending',
    },
    orderItems: [],
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    clientSecret: { type: String, required: true },
    paymentIntentId: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
