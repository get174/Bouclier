const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Obtenez toutes les notifications pour un utilisateur
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Trier par date de création dans l'ordre descendant (le plus récent premier)
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    console.log('Notifications from DB:', notifications);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtenez des notifications non lues
router.get('/unread-count/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Notification.countDocuments({ user: userId, read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
