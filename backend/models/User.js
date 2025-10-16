const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // car au début pas obligatoire (pour OTP)
  },
  otp: {
    type: String,
    required: false,
  },
  otpExpiry: {
    type: Date,
    required: false,
  },
  buildingId: {
    type:String,
    required:false,
  },
  blockId: {
    type : String,
    requird :false,
  },
  appartementId: {
    type : String,
    required : false,
  },

  isTemporary: { type: Boolean, default: true }, // ajoute d’autres champs si nécessaire (ex: password, name, etc)
  fullName: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['resident', 'security'],
  },
  status: {
    type: String,
    default: 'temporary', // Can be 'temporary', 'active', 'inactive'
  },
  
    // tu peux ajouter d’autres champs plus tard (nom, role, etc.)
});


module.exports = mongoose.model('User', userSchema);
