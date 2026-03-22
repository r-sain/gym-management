const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Get App Statistics
router.get('/stats', userController.getStats);

// Create user
router.post('/', userController.createUser);

// Get expiring users
router.get('/expiring', userController.getExpiringUsers);

// Get all users or search users
router.get('/', userController.getUsers);

// Renew user plan
router.put('/:id/renew', userController.renewUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
