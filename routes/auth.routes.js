const rateLimit = require('express-rate-limit');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Limite : 5 tentatives par 15 min par IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives de connexion, réessayez dans 15 minutes'
});

router.post('/login', loginLimiter, authController.login);

module.exports = router;
