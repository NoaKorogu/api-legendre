const express = require('express');
const router = express.Router();
const LivraisonController = require('../controllers/livraison.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * @swagger
 * /api/v1/livraisons:
 *   get:
 *     summary: Récupérer tous les livraisons
 *     tags:
 *       - Livraisons
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des livraisons
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau livraison
 *     tags:
 *       - Livraisons
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object

 *             properties:
 *                            heure_prevue:
 *                              type: string
 *                              example: "2024-01-16"
 *                            statut:
 *                              type: string
 *                              example: "example value"
 *                            tournee_id:
 *                              type: integer
 *                              example: 1
 *                            client_id:
 *                              type: integer
 *                              example: 1
 *                            adresse_id:
 *                              type: integer
 *                              example: 1
 *             required:
 *               - tournee_id
 *               - client_id
 *               - adresse_id
 *     responses:
 *       201:
 *         description: Livraison créé
 */
router.get('/', authMiddleware, roleMiddleware('chauffeur', 'admin', 'client'), logger, LivraisonController.getAll);
router.post('/', authMiddleware, logger, LivraisonController.create);

/**
 * @swagger
 * /api/v1/livraisons/{id}:
 *   get:
 *     summary: Récupérer un livraison par ID
 *     tags:
 *       - Livraisons
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
 *         description: Livraison trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un livraison
 *     tags:
 *       - Livraisons
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
 *                            heure_prevue:
 *                              type: string
 *                              example: "2024-01-16"
 *                            statut:
 *                              type: string
 *                              example: "example value"
 *                            tournee_id:
 *                              type: integer
 *                              example: 1
 *                            client_id:
 *                              type: integer
 *                              example: 1
 *                            adresse_id:
 *                              type: integer
 *                              example: 1
 *             required:
 *               - tournee_id
 *               - client_id
 *               - adresse_id
 *     responses:
 *       200:
 *         description: Livraison modifié
 *   delete:
 *     summary: Supprimer un livraison
 *     tags:
 *       - Livraisons
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
 *         description: Livraison supprimé
 */
router.get('/:id', authMiddleware, logger, LivraisonController.getById);
router.put('/:id', authMiddleware, logger, LivraisonController.update);
router.delete('/:id', authMiddleware, logger, LivraisonController.delete);

router.patch('/:id/statut', authMiddleware, roleMiddleware('chauffeur', 'admin'), logger, LivraisonController.updateStatut);

module.exports = router;
