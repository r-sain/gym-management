const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Non-parameterized specific routes (must come first, before /:id routes)
router.get('/stats', userController.getStats);
router.get('/export/excel', userController.exportUsersAsExcel);
router.get('/expiring', userController.getExpiringUsers);
router.get('/birthdays', userController.getBirthdayUsers);

// Create user
router.post('/', userController.createUser);

// Get all users or search users (general GET without :id)
router.get('/', userController.getUsers);

// Parameterized routes (must come after non-parameterized routes)
router.get('/:id/payment-history', userController.getPaymentHistory);
router.put('/:id/renew', userController.renewUser);
router.put('/:id', userController.updateUser);
router.patch('/:id/photo', userController.updatePhoto);
router.delete('/:id', userController.deleteUser);

module.exports = router;
