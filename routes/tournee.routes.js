const express = require('express');
const router = express.Router();
const TourneeController = require('../controllers/tournee.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * @swagger
 * /api/v1/tournees:
 *   get:
 *     summary: Récupérer tous les tournees
 *     tags:
 *       - Tournees
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tournees
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau tournee
 *     tags:
 *       - Tournees
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object

 *             properties:
 *                            date:
 *                              type: string
 *                              example: "2024-01-16"
 *                            chauffeur_id:
 *                              type: integer
 *                              example: 1
 *             required:
 *               - date
 *               - chauffeur_id
 *     responses:
 *       201:
 *         description: Tournee créé
 */
router.get('/', authMiddleware, roleMiddleware('chauffeur', 'admin'), logger, TourneeController.getAll);
router.post('/', authMiddleware, logger, TourneeController.create);

/**
 * @swagger
 * /api/v1/tournees/{id}:
 *   get:
 *     summary: Récupérer un tournee par ID
 *     tags:
 *       - Tournees
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
 *         description: Tournee trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un tournee
 *     tags:
 *       - Tournees
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
 *                            date:
 *                              type: string
 *                              example: "2024-01-16"
 *                            chauffeur_id:
 *                              type: integer
 *                              example: 1
 *             required:
 *               - date
 *               - chauffeur_id
 *     responses:
 *       200:
 *         description: Tournee modifié
 *   delete:
 *     summary: Supprimer un tournee
 *     tags:
 *       - Tournees
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
 *         description: Tournee supprimé
 */
router.get('/:id', authMiddleware, roleMiddleware('chauffeur', 'admin'), logger, TourneeController.getById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), logger, TourneeController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), logger, TourneeController.delete);

router.get('/:id/livraisons', authMiddleware, roleMiddleware('chauffeur', 'admin'), logger, TourneeController.getLivraisons);

/**
 * @swagger
 * /api/v1/tournees/{id}/livraisons:
 *   get:
 *     summary: Récupérer les livraisons d'une tournée
 *     tags:
 *       - Tournees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tournée
 *     responses:
 *       200:
 *         description: Liste des livraisons de la tournée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */

module.exports = router;
