const pool = require('../config/db');

exports.mpesaCallback = async (req, res) => {
    console.log("Received M-Pesa Callback:", JSON.stringify(req.body, null, 2));

    try {
        const { Body } = req.body;
        const { stkCallback } = Body;
        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

        // ResultCode 0 means success
        const status = ResultCode === 0 ? 'completed' : 'failed';

        // Find transaction by CheckoutRequestID
        const transactionResult = await pool.query(
            'SELECT * FROM transactions WHERE checkout_request_id = $1',
            [CheckoutRequestID]
        );

        if (transactionResult.rows.length === 0) {
            console.error("Transaction not found for CheckoutRequestID:", CheckoutRequestID);
            return res.json({ ResultCode: 0, ResultDesc: 'Accepted' }); // Still return success to Safaricom
        }

        const transaction = transactionResult.rows[0];

        // Update Transaction Status
        await pool.query(
            'UPDATE transactions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [status, transaction.id]
        );

        if (status === 'completed') {
            // Extract Amount from CallbackMetadata
            let amountPaid = transaction.amount; // Default to initiated amount
            if (CallbackMetadata && CallbackMetadata.Item) {
                const amountItem = CallbackMetadata.Item.find(item => item.Name === 'Amount');
                if (amountItem) amountPaid = amountItem.Value;
            }

            // Credit User Wallet
            await pool.query(
                'UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2',
                [amountPaid, transaction.user_id]
            );

            console.log(`Credited ${amountPaid} to user ${transaction.user_id}`);
        }

        // Send response to Safaricom
        res.json({ ResultCode: 0, ResultDesc: 'Accepted' });

    } catch (error) {
        console.error("Callback Error", error);
        res.status(500).json({ ResultCode: 1, ResultDesc: 'Internal Error' });
    }
};
