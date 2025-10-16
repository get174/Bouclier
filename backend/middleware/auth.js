const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret-change-this';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-this';

// Middleware to validate access token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ message: 'Token invalide ou expiré' });
    }

    // Ensure the user object has the correct id field
    req.user = {
      id: user.userId || user.id,
      userId: user.userId || user.id,
      email: user.email
    };
    next();
  });
};

// Middleware to validate refresh token
const authenticateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token manquant' });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      console.error('Refresh token verification error:', err);
      return res.status(403).json({ message: 'Refresh token invalide ou expiré' });
    }

    // Ensure the user object has the correct id field
    req.user = {
      id: user.userId || user.id,
      userId: user.userId || user.id,
      email: user.email
    };
    next();
  });
};

// Generate new access token from refresh token
const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token manquant' });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Refresh token invalide' });
    }

    const newAccessToken = jwt.sign(
      { userId: user.userId, email: user.email, type: 'access' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  });
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
  refreshAccessToken
};
