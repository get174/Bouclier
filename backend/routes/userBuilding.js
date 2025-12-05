const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Middleware to validate user exists
const validateUserExists = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    req.userData = user;
    next();
  } catch (error) {
    console.error('Error validating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user profile - NEW ENDPOINT
router.get('/profile', authenticateToken, validateUserExists, async (req, res) => {
  try {
    const user = req.userData;

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        buildingId: user.buildingId,
        blockId: user.blockId,
        appartementId: user.appartementId,
        isTemporary: user.isTemporary
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user building information - MAIN ENDPOINT FOR LOGIN REDIRECTION
router.get('/userBuilding', authenticateToken, validateUserExists, async (req, res) => {
  try {
    const user = req.userData;

    console.log('=== DEBUG USER BUILDING INFO ===');
    console.log('User ID:', user._id);
    console.log('User email:', user.email);
    console.log('Building ID:', user.buildingId);
    console.log('Block ID:', user.blockId);
    console.log('Appartement ID:', user.appartementId);
    console.log('Is Temporary:', user.isTemporary);
    console.log('Role:', user.role);
    console.log('==============================');

    res.json({
      success: true,
      buildingId: user.buildingId,
      blockId: user.blockId,
      appartementId: user.appartementId,
      isTemporary: user.isTemporary,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    console.error('Error fetching user building info:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user's building ID - Enhanced with better error handling
router.get('/building', authenticateToken, validateUserExists, async (req, res) => {
  try {
    const user = req.userData;

    // Check if user has building assigned
    if (!user.buildingId) {
      return res.status(200).json({
        success: true,
        buildingId: null,
        hasBuilding: false,
        message: 'No building assigned to user',
        error: 'NO_BUILDING_ASSIGNED'
      });
    }

    res.json({
      success: true,
      buildingId: user.buildingId,
      hasBuilding: true,
      message: 'Building found'
    });
  } catch (error) {
    console.error('Error fetching building ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Check if user has building assigned
router.get('/has-building', authenticateToken, validateUserExists, async (req, res) => {
  try {
    const user = req.userData;

    res.json({
      success: true,
      hasBuilding: !!user.buildingId,
      buildingId: user.buildingId || null,
      userId: user._id
    });
  } catch (error) {
    console.error('Error checking building status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Request building assignment
router.post('/request-building', authenticateToken, validateUserExists, async (req, res) => {
  try {
    const { buildingId } = req.body;
    const userId = req.user.userId;

    if (!buildingId) {
      return res.status(400).json({
        success: false,
        message: 'Building ID is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { buildingId, isTemporary: false },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Building assigned successfully',
      user: {
        id: user._id,
        email: user.email,
        buildingId: user.buildingId
      }
    });
  } catch (error) {
    console.error('Error assigning building:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update user's building ID
router.put('/update-building', authenticateToken, validateUserExists, async (req, res) => {
  try {
    const { buildingId } = req.body;
    const userId = req.user.userId;

    if (!buildingId) {
      return res.status(400).json({
        success: false,
        message: 'Building ID is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { buildingId, isTemporary: false },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Building ID updated successfully',
      user: {
        id: user._id,
        email: user.email,
        buildingId: user.buildingId
      }
    });
  } catch (error) {
    console.error('Error updating building ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update user's block ID
router.put('/update-block', authenticateToken, validateUserExists, async (req, res) => {
  try {
    const { blockId } = req.body;

    // Validate blockId
    if (!blockId) {
      return res.status(400).json({
        success: false,
        message: 'Block ID is required'
      });
    }

    // Import Block model
    const Block = require('../models/Block');

    // Check if block exists
    const block = await Block.findById(blockId);
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Block not found',
        error: 'BLOCK_NOT_FOUND'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { blockId },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Block ID updated successfully',
      user: {
        id: user._id,
        email: user.email,
        buildingId: user.buildingId,
        blockId: user.blockId
      }
    });
  } catch (error) {
    console.error('Error updating block ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update user's apartment ID
router.put('/select-apartment', authenticateToken, validateUserExists, async (req, res) => {
  try {
    const { apartmentId } = req.body;

    // Validate apartmentId
    if (!apartmentId) {
      return res.status(400).json({
        success: false,
        message: 'Apartment ID is required'
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(apartmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid apartment ID format'
      });
    }

    // Import Apartment model
    const Apartment = require('../models/Apartment');

    // Check if apartment exists
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: 'Apartment not found',
        error: 'APARTMENT_NOT_FOUND'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        appartementId: apartmentId,
        isTemporary: false
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Apartment selected successfully',
      user: {
        id: user._id,
        email: user.email,
        buildingId: user.buildingId,
        blockId: user.blockId,
        appartementId: user.appartementId,
        isTemporary: user.isTemporary
      }
    });
  } catch (error) {
    console.error('Error selecting apartment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
