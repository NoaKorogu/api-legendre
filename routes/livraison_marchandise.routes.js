const express = require('express');
const router = express.Router();
const Livraison_marchandiseController = require('../controllers/livraison_marchandise.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

/**
 * @swagger
 * /api/v1/livraison_marchandises:
 *   get:
 *     summary: Récupérer tous les livraison_marchandises
 *     tags:
 *       - Livraison_marchandises
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des livraison_marchandises
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau livraison_marchandise
 *     tags:
 *       - Livraison_marchandises
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object

 *             properties:
 *                            quantite:
 *                              type: integer
 *                              example: 1
 *                            livraison_id:
 *                              type: integer
 *                              example: 1
 *                            marchandise_id:
 *                              type: integer
 *                              example: 1
 *             required:
 *               - quantite
 *               - livraison_id
 *               - marchandise_id
 *     responses:
 *       201:
 *         description: Livraison_marchandise créé
 */
router.get('/', authMiddleware, logger, Livraison_marchandiseController.getAll);
router.post('/', authMiddleware, logger, Livraison_marchandiseController.create);

/**
 * @swagger
 * /api/v1/livraison_marchandises/{id}:
 *   get:
 *     summary: Récupérer un livraison_marchandise par ID
 *     tags:
 *       - Livraison_marchandises
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
 *         description: Livraison_marchandise trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un livraison_marchandise
 *     tags:
 *       - Livraison_marchandises
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
 *                            quantite:
 *                              type: integer
 *                              example: 1
 *                            livraison_id:
 *                              type: integer
 *                              example: 1
 *                            marchandise_id:
 *                              type: integer
 *                              example: 1
 *             required:
 *               - quantite
 *               - livraison_id
 *               - marchandise_id
 *     responses:
 *       200:
 *         description: Livraison_marchandise modifié
 *   delete:
 *     summary: Supprimer un livraison_marchandise
 *     tags:
 *       - Livraison_marchandises
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
 *         description: Livraison_marchandise supprimé
 */
router.get('/:id', authMiddleware, logger, Livraison_marchandiseController.getById);
router.put('/:id', authMiddleware, logger, Livraison_marchandiseController.update);
router.delete('/:id', authMiddleware, logger, Livraison_marchandiseController.delete);

module.exports = router;
