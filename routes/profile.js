// import getDatabaseConnection from '../db.js';
import {pool } from '../db.js';
import authMiddleware from '../middleware/auth.js';

export const getProfile = [authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const conn = await pool.getConnection();
    console.log("req.user:", req.user);
    console.log("userID:", req.user?.id);

    try {
        console.log('UESRID', userId);

        const [userResult] = await conn.query(
            `SELECT first_name, username, email FROM user WHERE userID = ?`,
            [userId]
        );
        console.log("conn:", typeof conn.query);
        console.log(' I AM RESULT:', userResult)
        if (userResult.length === 0 || !userResult) {
            return res.status(404).json({ error: 'Profile not found.' });
        }
        res.json(userResult);

    } catch (error) {
        console.error('Error when fetching your profile:', error);
        res.status(500).json({ error: 'Error when fetching your profile:' });
    } finally {
        conn.release();
    }
}];



