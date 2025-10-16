const mongoose = require('mongoose');

const buildingsSchema = new mongoose.Schema({
  responsibleName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  responsibleFunction: { type: String, required: true },
  buildingName: { type: String, required: true },
  commune: { type: String, required: true },
});

module.exports = mongoose.model('buildings', buildingsSchema);
