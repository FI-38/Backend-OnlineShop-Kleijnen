import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import { getDatabaseConnection, pool } from './db.js';
import authMiddleware from './middleware/auth.js';

import loginRoute from './routes/login.js';
import registerRoute from './routes/register.js';
import { getProfile } from './routes/profile.js';
 
BigInt.prototype.toJSON = function() { return this.toString() }  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/BigInt_not_serializable

export const app = express();

app.use(express.json()); // built-in middleware in express. Needed to understand json data sent in req.bodies https://www.geeksforgeeks.org/web-tech/express-js-express-json-function/

app.use(cors({ 
    origin: process.env.HOST.split(",") || '', // React-URL
    // origin: '*', // Everything-URL
    credentials: true         // Erlaubt das Senden von Cookies, falls benötigt
}));

// checks if working
app.get('/', (req, res) => {
    res.status(200).json({ "hi": "i am working" });
})
app.get('/api', (req, res) => {
    res.status(200).json({ blabla: 'ok' });
});

// LOGIN & REGISTER
app.post('/api/login', loginRoute);
app.post('/api/register', registerRoute);




// PROFILES (optional)
app.get('/api/profile', authMiddleware, getProfile); 
// app.get('/api/users', async (req, res) => {
//     const conn = await getDatabaseConnection();
//     const users = await conn.query('SELECT * FROM user');
//     res.status(200).json({users});
// });


app.use((err, req, res, next) => { // catch-all-errors middleware
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

