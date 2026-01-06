const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

router.get('/', authMiddleware, logger,userController.getAllUsers);
router.get('/:id',authMiddleware, logger,userController.getUserById);
router.post('/', authMiddleware, logger,userController.createUser);
router.put('/:id', authMiddleware, logger,userController.updateUser);
router.delete('/:id', authMiddleware, logger,userController.deleteUser);

module.exports = router;
