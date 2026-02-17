const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Dashboard Routes (JWT Protected)
router.post('/', auth, transactionController.createTransaction);
router.get('/', auth, transactionController.getTransactions);
router.get('/:id', auth, transactionController.getTransactionById);

// Public API Routes (API Key Protected)
router.post('/v1/transactions', apiKeyAuth, transactionController.createTransaction);

module.exports = router;
