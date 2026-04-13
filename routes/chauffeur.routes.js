const express = require('express');
const router = express.Router();
const ChauffeurController = require('../controllers/chauffeur.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

/**
 * @swagger
 * /api/v1/chauffeurs:
 *   get:
 *     summary: Récupérer tous les chauffeurs
 *     tags:
 *       - Chauffeurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des chauffeurs
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau chauffeur
 *     tags:
 *       - Chauffeurs
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
 *                            prenom:
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
 *               - prenom
 *     responses:
 *       201:
 *         description: Chauffeur créé
 */
router.get('/', authMiddleware, logger, ChauffeurController.getAll);
router.post('/', authMiddleware, logger, ChauffeurController.create);

/**
 * @swagger
 * /api/v1/chauffeurs/{id}:
 *   get:
 *     summary: Récupérer un chauffeur par ID
 *     tags:
 *       - Chauffeurs
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
 *         description: Chauffeur trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un chauffeur
 *     tags:
 *       - Chauffeurs
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
 *                            prenom:
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
 *               - prenom
 *     responses:
 *       200:
 *         description: Chauffeur modifié
 *   delete:
 *     summary: Supprimer un chauffeur
 *     tags:
 *       - Chauffeurs
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
 *         description: Chauffeur supprimé
 */
router.get('/:id', authMiddleware, logger, ChauffeurController.getById);
router.put('/:id', authMiddleware, logger, ChauffeurController.update);
router.delete('/:id', authMiddleware, logger, ChauffeurController.delete);

router.get('/:id/tournees', authMiddleware, logger, ChauffeurController.getTournees);

module.exports = router;
