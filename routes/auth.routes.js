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
 * /api/v1/auth/login:
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
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: SecurePassword123
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

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     description: Crée un nouveau compte utilisateur (chauffeur ou client)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - password
 *               - role
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Dupont
 *               prenom:
 *                 type: string
 *                 example: Jean
 *               email:
 *                 type: string
 *                 example: jean.dupont@example.com
 *               telephone:
 *                 type: string
 *                 example: "0612345678"
 *               password:
 *                 type: string
 *                 example: SecurePassword123
 *               role:
 *                 type: string
 *                 enum: [chauffeur, client]
 *                 example: chauffeur
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nom:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Données invalides ou incomplètes
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', authController.register);

module.exports = router;
