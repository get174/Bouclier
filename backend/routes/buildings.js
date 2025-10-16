const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const buildings = require('../api/buildings');
const { authenticateToken } = require('../middleware/auth');

// Import Block model
const Block = require('../models/Block');

// Create a new building
router.post('/', authenticateToken, async (req, res) => {
  const { responsibleName, contactNumber, responsibleFunction, buildingName, commune } = req.body;

  // Vérifie que tous les champs sont présents et non vides
  if (!responsibleName || !contactNumber || !responsibleFunction || !buildingName || !commune) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  try {
    const nouveau = new buildings(req.body);
    await nouveau.save();
    res.status(201).json({ message: 'Enregistré avec succès' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all buildings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const allBuildings = await buildings.find({});
    res.status(200).json(allBuildings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Get building by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const building = await buildings.findById(id);

    if (!building) {
      return res.status(404).json({
        success: false,
        error: 'Bâtiment non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      building: {
        id: building._id,
        name: building.buildingName,
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération du bâtiment:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du bâtiment'
    });
  }
});

// Get blocks by building ID
router.get('/:buildingId/blocks', authenticateToken, async (req, res) => {
  try {
    const { buildingId } = req.params;
    
    // Validate buildingId
    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
      return res.status(400).json({ error: 'ID de bâtiment invalide' });
    }

    // Check if building exists
    const building = await buildings.findById(buildingId);
    if (!building) {
      return res.status(404).json({ error: 'Bâtiment non trouvé' });
    }

    // Fetch all blocks for this building
    const blocks = await Block.find({ buildingId: buildingId })
      .select('_id blockName buildingId description')
      .sort({ blockName: 1 });

    res.status(200).json(blocks);
  } catch (err) {
    console.error('Erreur lors de la récupération des blocs:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des blocs' });
  }
});

module.exports = router;