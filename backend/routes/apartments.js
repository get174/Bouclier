const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment');
const { authenticateToken } = require('../middleware/auth');

// Get apartments by block ID
router.get('/blocks/:blockId/apartments', authenticateToken, async (req, res) => {
  try {
    const { blockId } = req.params;
    
    const apartments = await Apartment.find({ blockId: blockId })
      .populate('blockId', 'blockName')
      .sort({ apartmentNumber: 1 });
    
    res.status(200).json(apartments);
  } catch (err) {
    console.error('Erreur lors de la récupération des appartements:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des appartements' });
  }
});

// Get specific apartment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await Apartment.findById(id)
      .populate('blockId');

    if (!apartment) {
      return res.status(404).json({
        success: false,
        error: 'Appartement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      apartment: {
        id: apartment._id,
        name: apartment.apartmentNumber,
        number: apartment.apartmentNumber,
        blockId: apartment.blockId._id,
        blockName: apartment.blockId.blockName,
        floor: apartment.floor,
        description: apartment.description
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'appartement:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'appartement'
    });
  }
});

module.exports = router;
