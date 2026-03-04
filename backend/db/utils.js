const { assert } = require("node:console");

async function createCompany(name, shareHoldersCount, totalCapitalsInvested, userId, pool) {
    const query = `
        INSERT INTO companies (name, shareholderscount, totalcapitalsinvested, entered_by)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [name, shareHoldersCount, totalCapitalsInvested, userId];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error creating company:', err);
        throw err;
    }
}

async function createShareholder(firstName, lastName, nationality, companyId, pool) {
    const query = `
        INSERT INTO shareholders (first_name, last_name, nationality, company_id)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [firstName, lastName, nationality, companyId];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error creating shareholder:', err);
        throw err;
    }
}

async function createShareholdersBulk(shareholders, companyId, pool) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const inserted = [];
        for (const { firstName, lastName, nationality } of shareholders) {
            const res = await client.query(
                `INSERT INTO shareholders (first_name, last_name, nationality, company_id)
                 VALUES ($1, $2, $3, $4) RETURNING *;`,
                [firstName, lastName, nationality, companyId]
            );
            inserted.push(res.rows[0]);
        }
        await client.query('COMMIT');
        return inserted;
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error bulk creating shareholders:', err);
        throw err;
    } finally {
        client.release();
    }
}

async function deleteCompany(companyId, pool) {
    const query = `
        DELETE FROM companies WHERE id = $1;
    `;
    try {
        await pool.query(query, [companyId]);
    } catch (err) {
        console.error('Error deleting company:', err);
        throw err;
    }
}

async function retrieveCompanies(pool) {
    const query = `
        SELECT * FROM companies;
    `;
    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (err) {
        console.error('Error retrieving companies:', err);
        throw err;
    }
}

async function retrieveShareholders(pool) {
    const query = `
        SELECT * FROM shareholders;
    `;
    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (err) {
        console.error('Error retrieving shareholders:', err);
        throw err;
    }
}

async function retrieveShareholdersByCompany(companyId, pool) {
    const query = `
        SELECT * FROM shareholders WHERE company_id = $1;
    `;
    try {
        const res = await pool.query(query, [companyId]);
        return res.rows;
    } catch (err) {
        console.error('Error retrieving shareholders by company:', err);
        throw err;
    }
}

async function getUserByUsername(username, pool) {
    const query = `
        SELECT * FROM users WHERE username = $1;
    `;
    try {
        const res = await pool.query(query, [username]);
        assert(res.rows.length <= 1, 'Multiple users found with the same username');
        return res.rows;
    } catch (err) {
        console.error('Error retrieving user by username:', err);
        throw err;
    }
}

async function getUserById(userId, pool) {
    const query = `
        SELECT * FROM users WHERE id = $1;
    `;
    try {
        const res = await pool.query(query, [userId]);
        assert(res.rows.length <= 1, 'Multiple users found with the same ID');
        return res.rows[0];
    } catch (err) {
        console.error('Error retrieving user by ID:', err);
        throw err;
    }
}



async function createUser(username, password, pool) {
    const query = `
        INSERT INTO users (username, password, role)
        VALUES ($1, $2, 'u') RETURNING *;
    `;
    const values = [username, password];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}


async function setUserCreatingCompany(userId, companyId, pool) {
    const query = `UPDATE users SET creating_company_id = $1 WHERE id = $2;`;
    try {
        await pool.query(query, [companyId, userId]);
    } catch (err) {
        console.error('Error setting creating_company_id:', err);
        throw err;
    }
}

async function clearUserCreatingCompany(userId, pool) {
    const query = `UPDATE users SET creating_company_id = NULL WHERE id = $1;`;
    try {
        await pool.query(query, [userId]);
    } catch (err) {
        console.error('Error clearing creating_company_id:', err);
        throw err;
    }
}

module.exports = {
    createCompany,
    createShareholder,
    createShareholdersBulk,
    deleteCompany,
    retrieveCompanies,
    retrieveShareholders,
    retrieveShareholdersByCompany,
    getUserByUsername,
    createUser,
    getUserById,
    setUserCreatingCompany,
    clearUserCreatingCompany
};