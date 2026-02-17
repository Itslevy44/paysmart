const express = require('express');
const router = express.Router();
const sandboxController = require('../controllers/sandboxController');
const auth = require('../middleware/auth');

router.post('/simulate', auth, (req, res, next) => {
    if (process.env.DARAJA_ENV === 'production') {
        return res.status(403).json({ message: 'Sandbox Simulator is disabled in Production environment.' });
    }
    next();
}, sandboxController.simulate);

module.exports = router;
