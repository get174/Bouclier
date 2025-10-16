const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');
const mongoose = require('mongoose');

// @route   POST api/payments
// @desc    Create a new payment record
// @access  Private (syndic, admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!['syndic', 'admin'].includes(user.role)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { residentId, amount, description, dueDate } = req.body;

    const resident = await User.findById(residentId);
    if (!resident) {
        return res.status(404).json({ msg: 'Resident not found' });
    }

    const newPayment = new Payment({
      resident: residentId,
      building: resident.building,
      amount,
      description,
      dueDate
    });

    const payment = await newPayment.save();
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payments
// @desc    Get all payments for the logged-in resident
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ resident: req.user.id }).sort({ dueDate: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payments/building
// @desc    Get all payments for the user's building
// @access  Private (syndic, admin)
router.get('/building', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!['syndic', 'admin'].includes(user.role)) {
        return res.status(403).json({ msg: 'Access denied' });
      }
  
      const payments = await Payment.find({ building: user.building })
        .populate('resident', ['name', 'email'])
        .sort({ dueDate: -1 });
        
      res.json(payments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route   PUT api/payments/:id
// @desc    Update a payment status
// @access  Private (syndic, admin)
router.put('/:id', authenticateToken, async (req, res) => {
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid Payment ID' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!['syndic', 'admin'].includes(user.role)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    let payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment record not found' });
    }

    const updateData = { status };
    if (status === 'Payé') {
        updateData.paidAt = Date.now();
    }

    payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
