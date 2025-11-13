import getDatabaseConnection from '../db.js';
//import pool from '../db.js';
import authMiddleware from '../middleware/auth.js';

export const getProfile = [authMiddleware, async (req, res) => {
    const userId = req.user.id;

     //const conn = await pool.getConnection();
   const conn = getDatabaseConnection();

    try {
        const [userResult] = await conn.query(
            `SELECT p.firstname, p.surname, p.bio
             FROM user u
             LEFT JOIN user_profile p ON u.id = p.user_id
             WHERE u.id = ?`,
            [userId]
        );
        if (userResult.length === 0) {
            return res.status(404).json({ error: 'Profil nicht gefunden' });
        }

        res.json(userResult);

    } catch (error) {
        console.error('Fehler beim Abrufen des Profils:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen des Profils' });
    } finally {
        conn.release();
    }
}];

export const updateProfile = [authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { firstname, surname, bio } = req.body;

    const conn = await pool.getConnection();

    try {
        await conn.query(
         `INSERT INTO user_profile (user_id, firstname, surname, bio)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           firstname = VALUES(firstname),
           surname = VALUES(surname),
           bio = VALUES(bio)`,
            [userId, firstname, surname, bio]
        );
        res.json({ message: 'Profil erfolgreich aktualisiert' });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Profils:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Profils' });
    } finally {
        conn.release();
    }
}];



