// import getDatabaseConnection from '../db.js';
import {pool } from '../db.js';
import authMiddleware from '../middleware/auth.js';

export const getProfile = [authMiddleware, async (req, res) => {
    const userId = req.user.userID;
    const conn = await pool.getConnection();

    try {
        const [userResult] = await conn.query(
            `SELECT u.first_name, u.username, u.email
             FROM user u
             WHERE u.userID = ?`,
            [userId]
        );
        if (userResult?.length === 0) {
            return res.status(404).json({ error: 'Profile not found.' });
        }
        res.json(userResult[0]);

    } catch (error) {
        console.error('Error when fetching your profile:', error);
        res.status(500).json({ error: 'Error when fetching your profile:' });
    } finally {
        conn.release();
    }
}];



