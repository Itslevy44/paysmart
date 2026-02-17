const pool = require('./src/config/db');

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(255),
      phone_number VARCHAR(20),
      account_type VARCHAR(50) DEFAULT 'individual', -- 'individual' or 'business'
      is_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'KES',
      type VARCHAR(50) NOT NULL, -- 'paybill', 'till', 'stk_push', 'withdrawal'
      status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
      reference VARCHAR(100),
      phone_number VARCHAR(20),
      metadata JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      key_type VARCHAR(20) NOT NULL, -- 'public' or 'secret'
      environment VARCHAR(20) NOT NULL, -- 'sandbox' or 'live'
      key_value VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS webhooks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      url VARCHAR(255) NOT NULL,
      events VARCHAR[] NOT NULL, -- Array of event types
      environment VARCHAR(20) NOT NULL, -- 'sandbox' or 'live'
      secret VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    console.log('Tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables', err);
    process.exit(1);
  }
};

createTables();
