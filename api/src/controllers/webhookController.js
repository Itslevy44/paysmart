const pool = require('../config/db');
const crypto = require('crypto');

exports.getWebhooks = async (req, res) => {
    const userId = req.user.id;
    try {
        const webhooks = await pool.query(
            'SELECT * FROM webhooks WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(webhooks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.createWebhook = async (req, res) => {
    const userId = req.user.id;
    const { url, events, environment } = req.body;

    try {
        const secret = 'whsec_' + crypto.randomBytes(24).toString('hex');
        const newWebhook = await pool.query(
            'INSERT INTO webhooks (user_id, url, events, environment, secret) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, url, events, environment, secret]
        );
        res.json(newWebhook.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteWebhook = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        await pool.query(
            'DELETE FROM webhooks WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        res.json({ message: 'Webhook deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
