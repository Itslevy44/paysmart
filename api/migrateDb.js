const pool = require('./src/config/db');

const migrate = async () => {
    try {
        console.log('Running migration...');
        // Add wallet_balance column if not exists
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(15, 2) DEFAULT 0.00;');
        console.log('Added wallet_balance column.');

        // Add settlement_number column if not exists
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS settlement_number VARCHAR(20);');
        console.log('Added settlement_number column.');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
