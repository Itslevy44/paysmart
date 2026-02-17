const pool = require('./src/config/db');

const migrate = async () => {
    try {
        console.log('Running transaction table migration...');

        await pool.query('ALTER TABLE transactions ADD COLUMN IF NOT EXISTS checkout_request_id VARCHAR(100);');
        console.log('Added checkout_request_id column.');

        await pool.query('ALTER TABLE transactions ADD COLUMN IF NOT EXISTS merchant_request_id VARCHAR(100);');
        console.log('Added merchant_request_id column.');

        console.log('Transaction Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
