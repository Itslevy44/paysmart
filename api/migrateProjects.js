const { Pool } = require('pg');
require('dotenv').config({ path: './src/config/.env' }); // Adjust path if needed, or just .env if in root

// Fallback to loading from api/.env if not found above? 
// Actually, run from api/ folder, so .env is in current dir?
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    // Fallback for local dev if DATABASE_URL is not set (though user says they use Neon now)
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const migrateProjects = async () => {
    const client = await pool.connect();
    try {
        console.log("Starting Projects Migration...");
        await client.query('BEGIN');

        // 1. Create Projects Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Created projects table.");

        // 2. Add project_id to api_keys if not exists
        // We check if column exists first to avoid errors on re-run
        const checkApiKeys = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='api_keys' AND column_name='project_id';
        `);

        if (checkApiKeys.rows.length === 0) {
            await client.query(`
                ALTER TABLE api_keys 
                ADD COLUMN project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE;
            `);
            console.log("Added project_id to api_keys.");
        }

        // 3. Add project_id to transactions if not exists
        const checkTransactions = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='transactions' AND column_name='project_id';
        `);

        if (checkTransactions.rows.length === 0) {
            await client.query(`
                ALTER TABLE transactions 
                ADD COLUMN project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL;
            `);
            console.log("Added project_id to transactions.");
        }

        // 4. Data Migration: Create "Default Project" for existing users
        // Get all users who don't have a project yet
        const users = await client.query('SELECT id, name FROM users');

        for (const user of users.rows) {
            // Check if user already has a default project
            const existingProject = await client.query('SELECT id FROM projects WHERE user_id = $1', [user.id]);

            let projectId;

            if (existingProject.rows.length === 0) {
                // Create Default Project
                const newProject = await client.query(
                    'INSERT INTO projects (user_id, name, description) VALUES ($1, $2, $3) RETURNING id',
                    [user.id, 'Default Project', 'Your primary project created during migration']
                );
                projectId = newProject.rows[0].id;
                console.log(`Created Default Project for user ${user.id}`);
            } else {
                projectId = existingProject.rows[0].id;
            }

            // 5. Link existing API Keys to this project
            await client.query(
                'UPDATE api_keys SET project_id = $1 WHERE user_id = $2 AND project_id IS NULL',
                [projectId, user.id]
            );

            // 6. Link existing Transactions to this project
            await client.query(
                'UPDATE transactions SET project_id = $1 WHERE user_id = $2 AND project_id IS NULL',
                [projectId, user.id]
            );
        }
        console.log("Data migration (backfilling) complete.");

        await client.query('COMMIT');
        console.log("Projects Migration Finished Successfully.");

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Migration Failed:", err);
    } finally {
        client.release();
        // Don't close pool immediately if used by app, but here it's a script
        setTimeout(() => process.exit(0), 1000);
    }
};

migrateProjects();
