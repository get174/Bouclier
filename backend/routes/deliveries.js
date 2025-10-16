const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const Delivery = require('../models/Delivery');
const mongoose = require('mongoose');

// @route   POST api/deliveries
// @desc    Create a new delivery notification
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  const {
    packageType,
    deliveryPersonName,
    estimatedTime,
    description,
    qrCode,
    buildingId,
    apartmentId,
    photo
  } = req.body;

  const residentId = req.user.id;
  let photoUrl = null;

  // Handle base64 photo upload
  if (photo && photo.startsWith('data:image')) {
    try {
      // Extract base64 data and file extension
      const matches = photo.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
      if (matches) {
        const extension = matches[1];
        const base64Data = matches[2];

        // Generate unique filename
        const filename = 'delivery-' + Date.now() + '.' + extension;
        const filepath = path.join('uploads', filename);

        // Ensure uploads directory exists
        if (!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads', { recursive: true });
        }

        // Write file to disk
        fs.writeFileSync(filepath, base64Data, 'base64');
        photoUrl = `uploads/${filename}`;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la photo:', error);
      return res.status(400).json({ message: 'Erreur lors du traitement de la photo.' });
    }
  }

  if (!packageType || !deliveryPersonName || !estimatedTime || !buildingId || !apartmentId) {
    return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' });
  }

  try {
    const newDelivery = new Delivery({
      packageType,
      deliveryPersonName,
      estimatedTime,
      description,
      qrCode,
      photo: photoUrl,
      residentId,
      buildingId,
      apartmentId,
    });

    await newDelivery.save();
    res.status(201).json(newDelivery);

  } catch (error) {
    console.error("Erreur lors de la création de la livraison:", error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
});

// @route   GET api/deliveries
// @desc    Get all deliveries for the current resident
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const deliveries = await Delivery.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (error) {
    console.error("Erreur lors de la récupération des livraisons:", error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
});

// @route   GET api/deliveries/:id
// @desc    Get a specific delivery by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id || id === 'undefined' || id === 'null' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID de livraison invalide.',
        details: 'L\'ID fourni n\'est pas un identifiant valide.'
      });
    }

    const delivery = await Delivery.findOne({
      _id: id,
      residentId: req.user.id
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Livraison non trouvée ou non autorisée.' });
    }

    res.json(delivery);
  } catch (error) {
    console.error("Erreur lors de la récupération de la livraison:", error);

    // Handle CastError specifically
    if (error.name === 'CastError' && error.path === '_id') {
      return res.status(400).json({
        message: 'ID de livraison invalide.',
        details: 'L\'ID fourni n\'est pas un identifiant MongoDB valide.'
      });
    }

    res.status(500).json({ message: 'Erreur du serveur.' });
  }
});

// @route   PATCH api/deliveries/:id/confirm
// @desc    Confirm a delivery
// @access  Private
router.patch('/:id/confirm', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id || id === 'undefined' || id === 'null' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID de livraison invalide.',
        details: 'L\'ID fourni n\'est pas un identifiant valide.'
      });
    }

    const delivery = await Delivery.findOneAndUpdate(
      { _id: id, residentId: req.user.id },
      { status: 'delivered' },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: 'Livraison non trouvée ou non autorisée.' });
    }

    res.json({ message: 'Livraison confirmée avec succès.', delivery });
  } catch (error) {
    console.error("Erreur lors de la confirmation de la livraison:", error);

    // Handle CastError specifically
    if (error.name === 'CastError' && error.path === '_id') {
      return res.status(400).json({
        message: 'ID de livraison invalide.',
        details: 'L\'ID fourni n\'est pas un identifiant MongoDB valide.'
      });
    }

    res.status(500).json({ message: 'Erreur du serveur.' });
  }
});

// @route   PATCH api/deliveries/:id/refuse
// @desc    Refuse a delivery
// @access  Private
router.patch('/:id/refuse', authenticateToken, async (req, res) => {
  const { reason } = req.body;

  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id || id === 'undefined' || id === 'null' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID de livraison invalide.',
        details: 'L\'ID fourni n\'est pas un identifiant valide.'
      });
    }

    const delivery = await Delivery.findOneAndUpdate(
      { _id: id, residentId: req.user.id },
      { status: 'refused', refusalReason: reason || 'Non spécifié' },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: 'Livraison non trouvée ou non autorisée.' });
    }

    res.json({ message: 'Livraison refusée.', delivery });
  } catch (error) {
    console.error("Erreur lors du refus de la livraison:", error);

    // Handle CastError specifically
    if (error.name === 'CastError' && error.path === '_id') {
      return res.status(400).json({
        message: 'ID de livraison invalide.',
        details: 'L\'ID fourni n\'est pas un identifiant MongoDB valide.'
      });
    }

    res.status(500).json({ message: 'Erreur du serveur.' });
  }
});

module.exports = router;
