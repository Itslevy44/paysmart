const pool = require('../config/db');
const axios = require('axios');
const crypto = require('crypto');

// Helper to send webhook
const sendWebhook = async (userId, eventType, payload) => {
    try {
        const webhooks = await pool.query(
            'SELECT * FROM webhooks WHERE user_id = $1 AND environment = $2 AND is_active = true',
            [userId, 'sandbox'] // Only simulate for sandbox
        );

        for (const webhook of webhooks.rows) {
            if (webhook.events.includes('*') || webhook.events.includes(eventType)) {
                const signature = crypto
                    .createHmac('sha256', webhook.secret)
                    .update(JSON.stringify(payload))
                    .digest('hex');

                try {
                    await axios.post(webhook.url, payload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-PaySmart-Signature': `sha256=${signature}`,
                            'X-PaySmart-Event': eventType
                        }
                    });
                    console.log(`Webhook sent to ${webhook.url} for event ${eventType}`);
                } catch (err) {
                    console.error(`Failed to send webhook to ${webhook.url}: ${err.message}`);
                    // In a real app, we would log this failure to the DB for retries
                }
            }
        }
    } catch (err) {
        console.error('Error fetching webhooks:', err);
    }
};

exports.simulate = async (req, res) => {
    const userId = req.user.id;
    const { type, amount, phone_number } = req.body;

    // 1. Create a mock transaction
    try {
        // Random outcome based on type if not specified? 
        // For simplicity, let's assume successful STK Push simulation unless specified otherwise
        let status = 'completed';
        let eventType = 'payment.success';

        if (type === 'timeout') {
            status = 'failed';
            eventType = 'payment.expired';
        } else if (type === 'failed') {
            status = 'failed';
            eventType = 'payment.failed';
        }

        const reference = `SIM_${Date.now()}`;

        const newTransaction = await pool.query(
            'INSERT INTO transactions (user_id, amount, type, phone_number, reference, status, currency) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [userId, amount || 100, 'stk_push', phone_number || '254700000000', reference, status, 'KES']
        );

        const payload = {
            id: newTransaction.rows[0].id,
            amount: newTransaction.rows[0].amount,
            currency: newTransaction.rows[0].currency,
            reference: newTransaction.rows[0].reference,
            status: newTransaction.rows[0].status,
            phone_number: newTransaction.rows[0].phone_number,
            timestamp: new Date().toISOString()
        };

        // 2. Trigger Webhooks (async)
        // We don't await this to respond fast to the UI, or maybe we do for the simulation to show "Webhook Sent"
        await sendWebhook(userId, eventType, payload);

        res.json({
            message: `Simulation ${type} triggered successfully`,
            transaction: newTransaction.rows[0],
            webhook_sent: true
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
