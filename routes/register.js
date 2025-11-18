import bcrypt from 'bcryptjs';
import {pool } from '../db.js';

export default async (req, res) => {
    console.log(req.body);
    const { username, name, email, password } = req.body;

    // Validierung der Eingaben
    if (!username || !name || !email || !password) {
        return res.status(400).json({
            error: 'Alle Felder sind erforderlich'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            error: 'Passwort muss mindestens 8 Zeichen lang sein'
        });
    }

    // E-Mail-Format validieren (optional aber empfohlen)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Ungültige E-Mail-Adresse'
        });
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Prüfen ob Benutzer bereits existiert
        const existing = await conn.query(
            'SELECT id FROM user WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                error: 'Benutzername oder E-Mail bereits vergeben'
            });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 12);

        // Benutzer in Datenbank speichern
        const result = await conn.query(
            'INSERT INTO user (username, name, email, password_hash) VALUES (?, ?, ?, ?)',
            [username, name, email, hashedPassword]
        );

        res.status(201).json({
            message: 'Registrierung erfolgreich! Bitte einloggen.',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registrierungsfehler:', error);
        res.status(500).json({
            error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
        });
    } finally {
        if (conn) conn.release();
    }
};