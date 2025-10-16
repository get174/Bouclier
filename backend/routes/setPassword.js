const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adapte si ton modèle a un autre nom
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email et mot de passe requis' });

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports= router; 