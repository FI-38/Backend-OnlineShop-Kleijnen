import pool from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import getDatabaseConnection from '../db.js';

export default async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    const conn = getDatabaseConnection();

    console.log(conn);
    let user;
    try {
        [user] = await conn.query(
            'SELECT * FROM user WHERE username = ?', [username]);
    } catch (error) {
        console.log(error);
    } finally {
      // conn.release();
    }
    if (!user) return res.status(400).json(
        { error: `No user found with username ${username}` });

    const passwordMatch = await bcrypt.compare(password, user.password_hash); // test
    if (!passwordMatch) {
        return res.status(400).json({ error: 'Password incorrect.' });
    }
    const token = jwt.sign(
        { id: user.userID, username: user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.status(200).json({ token, userId: user.id });
};