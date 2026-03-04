async function resetDatabase(pool) {
    const dropTablesQuery = `DROP TABLE IF EXISTS shareholders, users, companies CASCADE;`;

    try {
        await pool.query(dropTablesQuery);
        console.log('Database reset successfully!');
    } catch (err) {
        console.error('Error resetting the database:', err);
        throw err;
    }
}

module.exports = resetDatabase;