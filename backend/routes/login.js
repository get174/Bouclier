const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret-change-this';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-this';

// Temps d'expiration des jetons
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    //Calculer les temps d'expiration en secondes
    const accessTokenExpirySeconds = 15 * 60; // 15 minutes in seconds
    const refreshTokenExpirySeconds = 7 * 24 * 60 * 60; // 7 days in seconds

    // Générer un jeton d'accès (de courte durée)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Générer un jeton de rafraîchissement (à longue durée)
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email, type: 'refresh' },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpirySeconds, // Ajouter ce champ
      status: user.status,
      isTemporary: user.isTemporary,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
