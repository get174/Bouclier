const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: false, // Not always required
    trim: true,
  },
  reason: {
    type: String,
    required: false,
    trim: true,
  },
  photoUrl: {
    type: String,
    required: false,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'expired', 'used'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buildingId: {
    type: String,
    required: true,
  },
  // Unique token for each visitor entry
  accessId: {
    type: String,
    default: uuidv4,
    required: false, // Not strictly required for old documents
    unique: true,
  },
  groupId: {
    type: String,
    default: uuidv4,
    required: false, // Not strictly required for old documents
    index: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
