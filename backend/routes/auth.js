const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/connect');
const { createUser, getUserByUsername} = require('../db/utils');
require('dotenv').config();

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username,  password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await createUser(username, passwordHash, pool);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const users = await getUserByUsername(username, pool);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, users[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { userId: users[0].id, role: users[0].role, creatingCompanyId: users[0].creating_company_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;