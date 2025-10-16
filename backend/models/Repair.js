const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Plomberie', 'Électricité', 'Climatisation', 'Serrurerie', 'Autre']
  },
  status: {
    type: String,
    default: 'En attente',
    enum: ['En attente', 'En cours', 'Terminé', 'Annulé']
  },
  photos: [{
    type: String 
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

repairSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Repair = mongoose.model('Repair', repairSchema);

module.exports = Repair;
