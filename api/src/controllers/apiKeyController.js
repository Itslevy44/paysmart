const pool = require('../config/db');
const crypto = require('crypto');

const generateKey = (type, env) => {
    const prefix = type === 'public' ? 'pk' : 'sk';
    const random = crypto.randomBytes(16).toString('hex');
    return `${prefix}_${env}_${random}`;
};

exports.getApiKeys = async (req, res) => {
    const userId = req.user.id;
    try {
        const keys = await pool.query(
            'SELECT * FROM api_keys WHERE user_id = $1 AND is_active = true',
            [userId]
        );

        // If no keys exist, generate them for sandbox
        if (keys.rows.length === 0) {
            const pk = generateKey('public', 'sandbox');
            const sk = generateKey('secret', 'sandbox');

            await pool.query(
                'INSERT INTO api_keys (user_id, key_type, environment, key_value) VALUES ($1, $2, $3, $4), ($1, $5, $3, $6)',
                [userId, 'public', 'sandbox', pk, 'secret', sk]
            );

            const newKeys = await pool.query(
                'SELECT * FROM api_keys WHERE user_id = $1 AND is_active = true',
                [userId]
            );
            return res.json(newKeys.rows);
        }

        res.json(keys.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.regenerateKey = async (req, res) => {
    const userId = req.user.id;
    const { type, environment } = req.body; // type: 'public' or 'secret', environment: 'sandbox' or 'live'

    try {
        // Deactivate old key
        await pool.query(
            'UPDATE api_keys SET is_active = false WHERE user_id = $1 AND key_type = $2 AND environment = $3',
            [userId, type, environment]
        );

        // Generate new key
        const newKeyValue = generateKey(type, environment);
        const newKey = await pool.query(
            'INSERT INTO api_keys (user_id, key_type, environment, key_value) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, type, environment, newKeyValue]
        );

        res.json(newKey.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
