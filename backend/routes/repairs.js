const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const Repair = require('../models/Repair');
const User = require('../models/User');
const mongoose = require('mongoose');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @route   POST api/repairs
// @desc    Create a new repair request
// @access  Private
router.post('/', authenticateToken, upload.any(), async (req, res) => {
  const { description, category } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.buildingId || !user.appartementId) {
      return res.status(400).json({ msg: 'User building or apartment not set' });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(user.buildingId) || !mongoose.Types.ObjectId.isValid(user.appartementId)) {
      return res.status(400).json({ msg: 'Invalid building or apartment ID' });
    }

    // Map frontend categories to backend
    const categoryMapping = {
      'plomberie': 'Plomberie',
      'electricite': 'Électricité',
      'ascenseur': 'Ascenseur',
      'autre': 'Autre'
    };

    const mappedCategory = categoryMapping[category] || 'Autre';

    // Handle uploaded photos
    const photos = req.files ? req.files.map(file => `uploads/${file.filename}`) : [];

    console.log('Creating repair for user:', req.user.id);
    console.log('User buildingId:', user.buildingId, 'appartementId:', user.appartementId);

    const newRepair = new Repair({
      resident: req.user.id,
      building: new mongoose.Types.ObjectId(user.buildingId),
      apartment: new mongoose.Types.ObjectId(user.appartementId),
      description,
      category: mappedCategory,
      photos
    });

    console.log('New repair object:', newRepair);

    const repair = await newRepair.save();
    res.json(repair);
  } catch (err) {
    console.error('Error creating repair:', err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/repairs
// @desc    Get all repair requests for a resident
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const repairs = await Repair.find({ resident: req.user.id }).sort({ createdAt: -1 });
    res.json(repairs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/repairs/building
// @desc    Get all repair requests for the user's building (for staff/admin)
// @access  Private
router.get('/building', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!['syndic', 'securite', 'admin'].includes(user.role)) {
        return res.status(403).json({ msg: 'Access denied' });
      }
  
      const repairs = await Repair.find({ building: new mongoose.Types.ObjectId(user.buildingId) })
        .populate('resident', ['fullName', 'email'])
        .populate('apartment', ['name'])
        .sort({ createdAt: -1 });
        
      res.json(repairs);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route   PUT api/repairs/:id
// @desc    Update a repair request status
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid Repair ID' });
  }

  try {
    let repair = await Repair.findById(req.params.id);
    if (!repair) {
      return res.status(404).json({ msg: 'Repair request not found' });
    }

    const user = await User.findById(req.user.id);

    // Allow resident to cancel, or staff to update status
    if (repair.resident.toString() !== req.user.id && !['syndic', 'securite', 'admin'].includes(user.role)) {
        return res.status(401).json({ msg: 'User not authorized' });
    }

    if (repair.resident.toString() === req.user.id && status !== 'Annulé') {
        return res.status(401).json({ msg: 'Residents can only cancel requests' });
    }

    repair = await Repair.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    res.json(repair);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
