const express = require('express');
const router = express.Router();
const MarchandiseController = require('../controllers/marchandise.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

/**
 * @swagger
 * /api/v1/marchandises:
 *   get:
 *     summary: Récupérer tous les marchandises
 *     tags:
 *       - Marchandises
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des marchandises
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau marchandise
 *     tags:
 *       - Marchandises
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object

 *             properties:
 *                            nom:
 *                              type: string
 *                              example: "example value"
 *                            poids:
 *                              type: number
 *                              example: 99.99
 *                            volume:
 *                              type: number
 *                              example: 99.99
 *             required:
 *               - nom
 *               - poids
 *               - volume
 *     responses:
 *       201:
 *         description: Marchandise créé
 */
router.get('/', authMiddleware, logger, MarchandiseController.getAll);
router.post('/', authMiddleware, logger, MarchandiseController.create);

/**
 * @swagger
 * /api/v1/marchandises/{id}:
 *   get:
 *     summary: Récupérer un marchandise par ID
 *     tags:
 *       - Marchandises
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
 *         description: Marchandise trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un marchandise
 *     tags:
 *       - Marchandises
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
 *                            nom:
 *                              type: string
 *                              example: "example value"
 *                            poids:
 *                              type: number
 *                              example: 99.99
 *                            volume:
 *                              type: number
 *                              example: 99.99
 *             required:
 *               - nom
 *               - poids
 *               - volume
 *     responses:
 *       200:
 *         description: Marchandise modifié
 *   delete:
 *     summary: Supprimer un marchandise
 *     tags:
 *       - Marchandises
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
 *         description: Marchandise supprimé
 */
router.get('/:id', authMiddleware, logger, MarchandiseController.getById);
router.put('/:id', authMiddleware, logger, MarchandiseController.update);
router.delete('/:id', authMiddleware, logger, MarchandiseController.delete);

module.exports = router;
