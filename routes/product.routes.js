const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Récupérer tous les products
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des products
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prix
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Laptop
 *               prix:
 *                 type: number
 *                 example: 999.99
 *               description:
 *                 type: string
 *                 example: High-end gaming laptop
 *     responses:
 *       201:
 *         description: Product créé
 */
router.get('/', authMiddleware, logger, ProductController.getAll);
router.post('/', authMiddleware, logger, ProductController.create);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Récupérer un product par ID
 *     tags:
 *       - Products
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
 *         description: Product trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un product
 *     tags:
 *       - Products
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
 *               nom:
 *                 type: string
 *                 example: Laptop
 *               prix:
 *                 type: number
 *                 example: 999.99
 *               description:
 *                 type: string
 *                 example: High-end gaming laptop
 *     responses:
 *       200:
 *         description: Product modifié
 *   delete:
 *     summary: Supprimer un product
 *     tags:
 *       - Products
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
 *         description: Product supprimé
 */
router.get('/:id', authMiddleware, logger, ProductController.getById);
router.put('/:id', authMiddleware, logger, ProductController.update);
router.delete('/:id', authMiddleware, logger, ProductController.delete);

module.exports = router;
