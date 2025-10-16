const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  packageType: {
    type: String,
    required: true,
    trim: true,
  },
  deliveryPersonName: {
    type: String,
    required: true,
    trim: true,
  },
  estimatedTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'delivered', 'refused', 'cancelled'],
    default: 'pending',
  },
  description: {
    type: String,
    trim: true,
  },
  qrCode: {
    type: String,
    trim: true,
  },
  photo: {
    type: String, // URL to the uploaded photo
  },
  refusalReason: {
    type: String,
    trim: true,
  },
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buildingId: {
    type: String,
    required: true,
  },
  apartmentId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
