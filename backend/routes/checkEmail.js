const express = require('express');
const router = express.Router();
const User = require('../models/User');




router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Utilisateur existe déjà
      return res.json({
        exists: true,
        hasPassword: !!user.password // true si mot de passe défini
      });
} else {
      // Créer un utilisateur temporaire
      const tempUser = new User({
        email: email.toLowerCase(),
        isTemporary: true
      });
      await tempUser.save();

      return res.json({
        exists: false,
        hasPassword: false,
        message: "Nouvel utilisateur temporaire créé"
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false, error: 'Erreur serveur' });
  }
});

module.exports = router;
