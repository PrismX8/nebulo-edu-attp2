const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  deliveryData: {
    type: mongoose.Schema.Types.Mixed
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.order || mongoose.model('order', OrderSchema);