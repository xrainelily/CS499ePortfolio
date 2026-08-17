const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const favoritesController = require('../controllers/favorites');

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip);

// Favorites belong to the authenticated user, so every favorites route is protected.
router
  .route('/favorites')
  .get(authenticateJWT, favoritesController.favoritesList);

router
  .route('/favorites/:tripCode')
  .post(authenticateJWT, favoritesController.favoritesAdd)
  .delete(authenticateJWT, favoritesController.favoritesRemove);

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Authorization header required.',
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'A valid Bearer token is required.',
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = verified;
    return next();
  } catch (error) {
    console.error('JWT validation failed:', error.message);
    return res.status(401).json({
      message: 'Invalid or expired authentication token.',
    });
  }
}

module.exports = router;
