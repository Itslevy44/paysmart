const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const auth = require('../middleware/auth');

router.get('/', auth, apiKeyController.getApiKeys);
router.post('/regenerate', auth, apiKeyController.regenerateKey);

module.exports = router;
