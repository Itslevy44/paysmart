const pool = require('../config/db');

const daraja = require('../services/daraja');

exports.createTransaction = async (req, res) => {
    const { amount, type, phone_number, reference } = req.body;
    const userId = req.user.id; // User ID from JWT middleware or API Key

    // Default status
    let status = 'pending';

    // If external dev, validation
    if (req.user.isExternalDev) {
        // Enforce validations for public API
        if (!amount || !phone_number) {
            return res.status(400).json({ message: 'Amount and phone_number are required' });
        }
        // Force type to mpesa for public API v1 for now
        // or allow them to specify. Let's start with mpesa default if not provided
        if (!type) req.body.type = 'mpesa';
    }

    // Determine Project ID (if external dev)
    const projectId = req.user.isExternalDev ? req.project.id : null;

    try {
        const newTransaction = await pool.query(
            'INSERT INTO transactions (user_id, amount, type, phone_number, reference, status, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [userId, amount, req.body.type || type, phone_number, reference, status, projectId]
        );

        // Trigger M-Pesa STK Push if type is mpesa
        if (req.body.type === 'mpesa' || type === 'mpesa') {
            try {
                // Check Environment (Sandbox vs Live)
                // If req.user.environment is 'sandbox', we should use Sandbox credentials.
                // If 'live', use Live credentials.
                // Since we are an Aggregator, we might have ONE set of PaySmart credentials (Live) 
                // and we simulate Sandbox for them? 
                // OR we have PaySmart Sandbox Credentials and PaySmart Live Credentials.

                // For this implementation, let's assume `daraja.initiateSTKPush` handles the environment 
                // based on *System Configuration*. 
                // But wait, if the Developer verifies in Sandbox, they want to test.
                // If they are Live, they want real money.

                // Let's assume for now `daraja.js` uses process.env.
                // If the SYSTEM is in Sandbox mode, all requests are Sandbox.
                // If the SYSTEM is in Live mode, all requests are Live.

                // Ideally, we should switch based on `req.user.environment`.
                // But `daraja.js` reads from `.env`. 
                // Let's keep it simple: The SYSTEM state determines the mode for now.

                const darajaResponse = await daraja.initiateSTKPush(phone_number, amount, reference);

                // Update transaction with CheckoutRequestID and MerchantRequestID
                if (darajaResponse.CheckoutRequestID) {
                    await pool.query(
                        'UPDATE transactions SET checkout_request_id = $1, merchant_request_id = $2 WHERE id = $3',
                        [darajaResponse.CheckoutRequestID, darajaResponse.MerchantRequestID, newTransaction.rows[0].id]
                    );
                }

            } catch (darajaError) {
                console.error("Failed to initiate STK Push", darajaError.message);
                // We don't fail the request, we just return the pending transaction.
                // In a real app, we might update status to 'failed_initiation'
            }
        }

        // Return the *updated* transaction? Or just the initial one?
        // Let's return the initial one, user will get updates via webhook/callback.
        res.status(201).json(newTransaction.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTransactions = async (req, res) => {
    const userId = req.user.id;
    try {
        const transactions = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(transactions.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTransactionById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const transaction = await pool.query(
            'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (transaction.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
