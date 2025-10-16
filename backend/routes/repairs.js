const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Repair = require('../models/Repair');
const User = require('../models/User');
const mongoose = require('mongoose');

// @route   POST api/repairs
// @desc    Create a new repair request
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  const { description, category, photos } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.building || !user.apartment) {
      return res.status(400).json({ msg: 'User building or apartment not set' });
    }

    const newRepair = new Repair({
      resident: req.user.id,
      building: user.building,
      apartment: user.apartment,
      description,
      category,
      photos
    });

    const repair = await newRepair.save();
    res.json(repair);
  } catch (err) {
    console.error(err.message);
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
  
      const repairs = await Repair.find({ building: user.building })
        .populate('resident', ['name', 'email'])
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
