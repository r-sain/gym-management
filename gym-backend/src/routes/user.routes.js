const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Get App Statistics
router.get('/stats', userController.getStats);

// Create user
router.post('/', userController.createUser);

// Get expiring users
router.get('/expiring', userController.getExpiringUsers);

// Get birthday users
router.get('/birthdays', userController.getBirthdayUsers);

// Get payment history
router.get('/:id/payment-history', userController.getPaymentHistory);

// Get all users or search users
router.get('/', userController.getUsers);

// Renew user plan
router.put('/:id/renew', userController.renewUser);

// Update user details
router.put('/:id', userController.updateUser);

// Update user photo
router.patch('/:id/photo', userController.updatePhoto);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
