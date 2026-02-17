const pool = require('../config/db');

module.exports = async (req, res, next) => {
    // Get the API Key from the headers
    const apiKey = req.header('x-api-key');

    // Check if no API Key provided
    if (!apiKey) {
        return res.status(401).json({ message: 'No API, authorization denied' });
    }

    try {
        // Verify token
        const result = await pool.query(
            'SELECT user_id, environment FROM api_keys WHERE key_value = $1 AND is_active = true',
            [apiKey]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid API Key' });
        }

        const { user_id, environment } = result.rows[0];

        // Attach user info to request object
        req.user = {
            id: user_id,
            environment: environment,
            isExternalDev: true // Flag to identify external API usage
        };

        next();
    } catch (err) {
        console.error("API Key Auth Error", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
