const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  blockName: { type: String, required: true },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'buildings', required: true },
  description: { type: String }
});

module.exports = mongoose.model('Block', blockSchema);
