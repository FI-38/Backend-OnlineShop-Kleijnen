import { pool, getDatabaseConnection } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    if (!username ||!password ) {
      return res.status(400).json({ error: 'Username and password required.' });
    }
    
    const conn = await pool.getConnection();
      
    try {
        const rows = await conn.query('SELECT * FROM user WHERE username = ?', [username]);

        if (rows.length === 0 ||rows == undefined) {
            return res.status(400).json({ error: 'No user found.' });
        }

        const user = await rows[0];
        console.log('USER', user)

        if (!user) return res.status(400).json({ error: `No user found with username '${username}'` });
   

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
     } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
     } finally {
        conn.release();
     }
    
}; 