const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Retourne la liste de tous les utilisateurs
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   created_at:
 *                     type: string
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     description: Ajoute un nouvel utilisateur à la base de données
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Charlie
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       401:
 *         description: Non authentifié
 */
router.get('/', authMiddleware, logger, userController.getAllUsers);
router.post('/', authMiddleware, logger, userController.createUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non authentifié
 *   put:
 *     summary: Modifier un utilisateur
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur modifié
 *       404:
 *         description: Utilisateur non trouvé
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', authMiddleware, logger, userController.getUserById);
router.put('/:id', authMiddleware, logger, userController.updateUser);
router.delete('/:id', authMiddleware, logger, userController.deleteUser);

module.exports = router;
