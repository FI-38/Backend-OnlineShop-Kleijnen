import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
//import pool from './db.js';
import cors from 'cors';
import authMiddleware from './middleware/auth.js';
import getDatabaseConnection from './db.js';

import loginRoute from './routes/login.js';
import registerRoute from './routes/register.js';
import { getProfile, updateProfile } from './routes/profile.js';

// Prototype overrides
BigInt.prototype.toJSON = function() { return this.toString() }

export const app = express();

app.use(express.json()); // configure json in req.body

app.get('/', (req, res) => {
    res.status(200).json({ "hello": "world" });
})

app.get('/api', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/api/users', async (req, res) => {
    const conn = await getDatabaseConnection();
 
    const users = await conn.query('SELECT * FROM user');
    res.status(200).json({users});
});


app.use(cors({ // CORS konfigurieren
    origin: process.env.HOST.split(",") || '', // React-URL
    // origin: '*', // Everything-URL
    credentials: true         // Erlaubt das Senden von Cookies, falls benötigt
}));


app.post('/api/login', loginRoute);
app.post('/api/register', registerRoute);
app.get('/api/profile', authMiddleware, getProfile);
app.put('/api/profile', authMiddleware, updateProfile);


// Server starten
// app.listen(process.env.PORT, () => {
//     console.log(`Server läuft auf http://server:${process.env.PORT}`);
// });


// Middleware for catching all errors
app.use((err, req, res, next) => {
    console.log(`An error occured: ${err}`);
    console.error('Error information:', {
        message: err.message,
        stack: err.stack,
        status: err.status || 500
    });
 
    res.status(err.status || 500).json({
        error: err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});