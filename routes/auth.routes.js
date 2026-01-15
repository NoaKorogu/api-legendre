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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     description: Retourne un token JWT pour l'utilisateur
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user
 *               password:
 *                 type: string
 *                 example: user123
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', loginLimiter, authController.login);

module.exports = router;
