require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db/connect');
const initializeDatabase = require('./db/init');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const { createCompany, createShareholder, createShareholdersBulk, setUserCreatingCompany, clearUserCreatingCompany } = require('./db/utils');
const { userMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);

// POST /company — authenticated; creates company and marks user as currently entering it
app.post('/company', userMiddleware, async (req, res) => {
    const { name, shareHoldersCount, totalCapitalsInvested } = req.body;
    if (!name || !shareHoldersCount || !totalCapitalsInvested) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newCompany = await createCompany(name, shareHoldersCount, totalCapitalsInvested, req.user.userId, pool);
        await setUserCreatingCompany(req.user.userId, newCompany.id, pool);
        res.status(201).json({ message: 'Company created successfully', company: newCompany });
    } catch (err) {
        console.error('Error creating company:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST /shareholder — single
app.post('/shareholder', async (req, res) => {
    const { firstName, lastName, nationality, companyId } = req.body;
    if (!firstName || !lastName || !nationality || !companyId) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newShareholder = await createShareholder(firstName, lastName, nationality, companyId, pool);
        res.status(201).json({ message: 'Shareholder created successfully', shareholder: newShareholder });
    } catch (err) {
        console.error('Error creating shareholder:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST /shareholders — bulk: { shareholders: [{firstName, lastName, nationality}], companyId }
app.post('/shareholders', userMiddleware, async (req, res) => {
    const { shareholders, companyId } = req.body;
    if (!Array.isArray(shareholders) || shareholders.length === 0 || !companyId) {
        return res.status(400).json({ message: 'shareholders array and companyId are required' });
    }
    try {
        const inserted = await createShareholdersBulk(shareholders, companyId, pool);
        await clearUserCreatingCompany(req.user.userId, pool);
        res.status(201).json({ message: 'Shareholders created successfully', shareholders: inserted });
    } catch (err) {
        console.error('Error creating shareholders:', err);
        res.status(500).json({ message: err.message });
    }
});

async function start() {
    try {
        await initializeDatabase(pool);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

start();



