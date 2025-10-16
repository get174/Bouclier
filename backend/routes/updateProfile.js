
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  const { fullName, role } = req.body;
  const userId = req.user.userId;

  if (!fullName || !role) {
    return res.status(400).json({ message: 'Le nom complet et le rôle sont requis.' });
  }

  if (!['resident', 'security'].includes(role)) {
    return res.status(400).json({ message: 'Rôle non valide spécifié.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Update user fields
    user.fullName = fullName;
    user.role = role;
    user.status = 'active'; // Update status from 'temporary'

    await user.save();

    res.status(200).json({ message: 'Profil mis à jour avec succès.' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
});

module.exports = router;
