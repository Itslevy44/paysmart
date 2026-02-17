const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
// Protected routes
const auth = require('../middleware/auth');
router.get('/profile', auth, authController.getProfile);
router.put('/settings', auth, authController.updateSettings);

module.exports = router;
