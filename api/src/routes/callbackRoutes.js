const express = require('express');
const router = express.Router();
const callbackController = require('../controllers/callbackController');

// Public route, no auth middleware because Safaricom calls this
router.post('/mpesa', callbackController.mpesaCallback);

module.exports = router;
