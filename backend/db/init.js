const bcrypt = require('bcryptjs');

async function initializeDatabase(pool) {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(1) NOT NULL CHECK (role IN ('a', 'u')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createCompaniesTableQuery = `
        CREATE TABLE IF NOT EXISTS companies (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            shareholderscount INTEGER NOT NULL,
            totalcapitalsinvested NUMERIC(15, 2) NOT NULL,
            entered_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // Added after companies exists to avoid circular FK dependency
    const addCreatingCompanyIdQuery = `
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS creating_company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL DEFAULT NULL;
    `;

    // Patch entered_by onto existing companies tables that predate this column
    const addEnteredByQuery = `
        ALTER TABLE companies
        ADD COLUMN IF NOT EXISTS entered_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
    `;

    const creatShareHoldersTableQuery = `
        CREATE TABLE IF NOT EXISTS shareholders (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            nationality VARCHAR(255) NOT NULL,
            company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
   

    
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const adminPassHash = await bcrypt.hash(adminPass, 10);
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const insertAdminUserQuery = `
        INSERT INTO users (username, password, role)
        VALUES ($1, $2, 'a')
        ON CONFLICT (username) DO NOTHING;
    `;

    
    try {
        await pool.query(createUsersTableQuery);
        await pool.query(createCompaniesTableQuery);
        await pool.query(addEnteredByQuery);
        await pool.query(addCreatingCompanyIdQuery);
        await pool.query(creatShareHoldersTableQuery);
        await pool.query(insertAdminUserQuery, [adminUsername, adminPassHash]);

        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing the database:', err);
        throw err;
    }
}

module.exports = initializeDatabase;