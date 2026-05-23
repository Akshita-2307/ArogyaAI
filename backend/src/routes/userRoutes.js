const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');

const express = require('express');
const router = express.Router();

router.use(protect);

// Self-service endpoints
router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);

router.get('/', restrictTo('admin'), userController.getAllUsers);
router.get('/:id', restrictTo('admin'), userController.getUser);
router.patch('/:id', restrictTo('admin'), userController.updateUser);
router.delete('/:id', restrictTo('admin'), userController.deleteUser);

module.exports = router;
