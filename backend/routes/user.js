const router = require('express').Router();
const pool = require('../db/connect');
const { getUserById, clearUserCreatingCompany } = require('../db/utils');
const { userMiddleware } = require('../middleware/auth');

// GET /user/draft — returns the company the user is currently building, if any
router.get('/draft', userMiddleware, async (req, res) => {
    try {
        const user = await getUserById(req.user.userId, pool);
        if (!user.creating_company_id) {
            return res.json({ draft: null });
        }
        const companyRes = await pool.query(
            'SELECT * FROM companies WHERE id = $1',
            [user.creating_company_id]
        );
        res.json({ draft: companyRes.rows[0] || null });
    } catch (err) {
        console.error('Error fetching draft:', err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE /user/draft — clear the in-progress company (called after step 2 complete)
router.delete('/draft', userMiddleware, async (req, res) => {
    try {
        await clearUserCreatingCompany(req.user.userId, pool);
        res.json({ message: 'Draft cleared' });
    } catch (err) {
        console.error('Error clearing draft:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
