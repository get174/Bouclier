const express = require('express');
const router = express.Router();
const Block = require('../models/Block');
const { authenticateToken } = require('../middleware/auth');

// Get specific block by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const block = await Block.findById(id)
      .populate('buildingId', 'name');

    if (!block) {
      return res.status(404).json({
        success: false,
        error: 'Bloc non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      block: {
        id: block._id,
        name: block.blockName,
        buildingId: block.buildingId._id,
        buildingName: block.buildingId.name,
        description: block.description
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération du bloc:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du bloc'
    });
  }
});

module.exports = router;
