const express = require('express');
const router = express.Router();
const AdresseController = require('../controllers/adresse.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

/**
 * @swagger
 * /api/v1/adresses:
 *   get:
 *     summary: Récupérer tous les adresses
 *     tags:
 *       - Adresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des adresses
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau adresse
 *     tags:
 *       - Adresses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object

 *             properties:
 *                            code_postal:
 *                              type: string
 *                              example: "example value"
 *                            pays:
 *                              type: string
 *                              example: "example value"
 *                            rue:
 *                              type: string
 *                              example: "example value"
 *                            ville:
 *                              type: string
 *                              example: "example value"
 *             required:
 *               - code_postal
 *               - pays
 *               - rue
 *               - ville
 *     responses:
 *       201:
 *         description: Adresse créé
 */
router.get('/', authMiddleware, logger, AdresseController.getAll);
router.post('/', authMiddleware, logger, AdresseController.create);

/**
 * @swagger
 * /api/v1/adresses/{id}:
 *   get:
 *     summary: Récupérer un adresse par ID
 *     tags:
 *       - Adresses
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
 *         description: Adresse trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un adresse
 *     tags:
 *       - Adresses
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
 *                            code_postal:
 *                              type: string
 *                              example: "example value"
 *                            pays:
 *                              type: string
 *                              example: "example value"
 *                            rue:
 *                              type: string
 *                              example: "example value"
 *                            ville:
 *                              type: string
 *                              example: "example value"
 *             required:
 *               - code_postal
 *               - pays
 *               - rue
 *               - ville
 *     responses:
 *       200:
 *         description: Adresse modifié
 *   delete:
 *     summary: Supprimer un adresse
 *     tags:
 *       - Adresses
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
 *         description: Adresse supprimé
 */
router.get('/:id', authMiddleware, logger, AdresseController.getById);
router.put('/:id', authMiddleware, logger, AdresseController.update);
router.delete('/:id', authMiddleware, logger, AdresseController.delete);

module.exports = router;
