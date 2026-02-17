const pool = require('../config/db');
const crypto = require('crypto');

const generateKey = (type, env) => {
    const prefix = type === 'public' ? 'pk' : 'sk';
    const random = crypto.randomBytes(16).toString('hex');
    return `${prefix}_${env}_${random}`;
};

exports.getApiKeys = async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.query; // Filter by project

    try {
        let query = 'SELECT * FROM api_keys WHERE user_id = $1 AND is_active = true';
        let params = [userId];

        if (projectId) {
            query += ' AND project_id = $2';
            params.push(projectId);
        }

        const keys = await pool.query(query, params);

        // If no keys exist for this project, should we generate them?
        // Only if projectId is provided explicitly
        if (keys.rows.length === 0 && projectId) {
            const pk = generateKey('public', 'sandbox');
            const sk = generateKey('secret', 'sandbox');

            await pool.query(
                'INSERT INTO api_keys (user_id, key_type, environment, key_value, project_id) VALUES ($1, $2, $3, $4, $5), ($1, $6, $3, $7, $5)',
                [userId, 'public', 'sandbox', pk, projectId, 'secret', sk]
            );

            const newKeys = await pool.query(
                'SELECT * FROM api_keys WHERE user_id = $1 AND project_id = $2 AND is_active = true',
                [userId, projectId]
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
    const { type, environment, projectId } = req.body; // Added projectId

    if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
    }

    try {
        // Deactivate old key
        await pool.query(
            'UPDATE api_keys SET is_active = false WHERE user_id = $1 AND key_type = $2 AND environment = $3 AND project_id = $4',
            [userId, type, environment, projectId]
        );

        // Generate new key
        const newKeyValue = generateKey(type, environment);
        const newKey = await pool.query(
            'INSERT INTO api_keys (user_id, key_type, environment, key_value, project_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, type, environment, newKeyValue, projectId]
        );

        res.json(newKey.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
