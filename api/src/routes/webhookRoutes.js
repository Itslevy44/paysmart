const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const auth = require('../middleware/auth');

router.get('/', auth, webhookController.getWebhooks);
router.post('/', auth, webhookController.createWebhook);
router.delete('/:id', auth, webhookController.deleteWebhook);

module.exports = router;
