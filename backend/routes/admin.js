const express = require('express');
const { retrieveCompanies, retrieveShareholdersByCompany } = require('../db/utils');
const { authorizationMiddleware } = require('../middleware/auth');
const pool = require('../db/connect');

const router = express.Router();

router.get('/company', authorizationMiddleware, async (req, res) => {
    try {
        const companies = await retrieveCompanies(pool);
        res.json({ companies });
    } catch (err) {
        console.error('Error retrieving companies:', err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/shareholder/:companyId', authorizationMiddleware, async (req, res) => {
    try {
        const shareholders = await retrieveShareholdersByCompany(req.params.companyId, pool);
        res.json({ shareholders });
    } catch (err) {
        console.error('Error retrieving shareholders:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
