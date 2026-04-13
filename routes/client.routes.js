const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/client.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

/**
 * @swagger
 * /api/v1/clients:
 *   get:
 *     summary: Récupérer tous les clients
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau client
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object

 *             properties:
 *                            email:
 *                              type: string
 *                              example: "example value"
 *                            nom:
 *                              type: string
 *                              example: "example value"
 *                            password:
 *                              type: string
 *                              example: "example value"
 *                            role:
 *                              type: string
 *                              example: "example value"
 *                            telephone:
 *                              type: string
 *                              example: "example value"
 *             required:
 *               - email
 *               - nom
 *               - password
 *     responses:
 *       201:
 *         description: Client créé
 */
router.get('/', authMiddleware, logger, ClientController.getAll);
router.post('/', authMiddleware, logger, ClientController.create);

/**
 * @swagger
 * /api/v1/clients/{id}:
 *   get:
 *     summary: Récupérer un client par ID
 *     tags:
 *       - Clients
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
 *         description: Client trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un client
 *     tags:
 *       - Clients
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
 *                            email:
 *                              type: string
 *                              example: "example value"
 *                            nom:
 *                              type: string
 *                              example: "example value"
 *                            password:
 *                              type: string
 *                              example: "example value"
 *                            role:
 *                              type: string
 *                              example: "example value"
 *                            telephone:
 *                              type: string
 *                              example: "example value"
 *             required:
 *               - email
 *               - nom
 *               - password
 *     responses:
 *       200:
 *         description: Client modifié
 *   delete:
 *     summary: Supprimer un client
 *     tags:
 *       - Clients
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
 *         description: Client supprimé
 */
router.get('/:id', authMiddleware, logger, ClientController.getById);
router.put('/:id', authMiddleware, logger, ClientController.update);
router.delete('/:id', authMiddleware, logger, ClientController.delete);

module.exports = router;
