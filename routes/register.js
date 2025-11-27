import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

export default async (req, res) => {
    console.log(req.body);
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
        return res.status(400).json({
            error: 'All fields are required.'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            error: 'Password should be at least 8 characters.'
        });
    }

    var passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/ ;

    if (!passwordRegex.test(password) ) {
        return res.status(400).json({ error: 'Password too weak.' });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email address.'
        });
    }

    let conn;
    try {
        conn = await pool.getConnection();

        const doesUserExist = await conn.query(
            'SELECT userID FROM user WHERE username = ? OR email = ?',
            [username, email]
        );

        if (doesUserExist.length > 0) { // IF doesUserExist = true and holds values...
            return res.status(409).json({
                error: 'Username or email already in use.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // hash PW

        const result = await conn.query(
            'INSERT INTO user ( first_name, username, email, password_hash) VALUES (?, ?, ?, ?)',
            [name, username, email, hashedPassword]
        );
        const newUserId = result.insertId; // mariaDB builtin, 

        res.status(201).json({
            message: "You're now registered! Please login here.",
            userID: newUserId,
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Something went wrong. Please try again later.'
        });
    } finally {
        if (conn) conn.release();
    }
};