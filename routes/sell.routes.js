const express = require('express');
const router = express.Router();
const SellController = require('../controllers/sell.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

/**
 * @swagger
 * /api/v1/sells:
 *   get:
 *     summary: Récupérer tous les sells
 *     tags:
 *       - Sells
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des sells
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau sell
 *     tags:
 *       - Sells
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object

 *             properties:
 *                            quantity:
 *                              type: integer
 *                              example: 1
 *                            product_id:
 *                              type: integer
 *                              example: 1
 *             required:
 *               - quantity
 *               - product_id
 *     responses:
 *       201:
 *         description: Sell créé
 */
router.get('/', authMiddleware, logger, SellController.getAll);
router.post('/', authMiddleware, logger, SellController.create);

/**
 * @swagger
 * /api/v1/sells/{id}:
 *   get:
 *     summary: Récupérer un sell par ID
 *     tags:
 *       - Sells
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
 *         description: Sell trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un sell
 *     tags:
 *       - Sells
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
 *                            quantity:
 *                              type: integer
 *                              example: 1
 *                            product_id:
 *                              type: integer
 *                              example: 1
 *             required:
 *               - quantity
 *               - product_id
 *     responses:
 *       200:
 *         description: Sell modifié
 *   delete:
 *     summary: Supprimer un sell
 *     tags:
 *       - Sells
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
 *         description: Sell supprimé
 */
router.get('/:id', authMiddleware, logger, SellController.getById);
router.put('/:id', authMiddleware, logger, SellController.update);
router.delete('/:id', authMiddleware, logger, SellController.delete);

module.exports = router;
