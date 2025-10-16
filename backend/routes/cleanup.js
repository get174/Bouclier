const express = require('express');
const router = express.Router();
const Building = require('../api/buildings');
const Block = require('../models/Block');
const Apartment = require('../models/Apartment');
const auth = require('../middleware/auth');

// Delete all data from collections
router.delete('/all', auth, async (req, res) => {
  try {
    const apartmentResult = await Apartment.deleteMany({});
    const blockResult = await Block.deleteMany({});
    const buildingResult = await Building.deleteMany({});
    
    res.json({
      message: 'Successfully deleted all data from collections',
      deleted: {
        apartments: apartmentResult.deletedCount,
        blocks: blockResult.deletedCount,
        buildings: buildingResult.deletedCount
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
