import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Not authorised' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log("[hacker voice] you're in.")
        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;