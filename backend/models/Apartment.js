const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  apartmentNumber: { type: String, required: true },
  blockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Block', required: true },
  floor: { type: Number },
  description: { type: String }
});

module.exports = mongoose.model('Apartment', apartmentSchema, 'Apartments');
