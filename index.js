import express from 'express';
import cors from 'cors';
import authMiddleware from './middleware/auth.js';

import loginRoute from './routes/login.js';
import registerRoute from './routes/register.js';
import { getProfile } from './routes/profile.js';
import uploadRoute from './routes/upload.js'; // ✅ ES module import
import { getAllProducts, updateProduct, deleteProduct } from "./routes/products.js";


BigInt.prototype.toJSON = function() { return this.toString() };

export const app = express();

app.use(express.json());
app.use(cors({ 
    origin: process.env.HOST?.split(",") || '', 
    credentials: true
}));

// serve uploaded images
app.use('/api/uploads', express.static('uploads'));

// check if working
app.get('/', (req, res) => res.status(200).json({ "hi": "i am working" }));
app.get('/api', (req, res) => res.status(200).json({ blabla: 'ok' }));

// LOGIN & REGISTER
app.post('/api/login', loginRoute);
app.post('/api/register', registerRoute);

// UPLOAD IMG + product fields
app.use('/api/upload', uploadRoute);  // ✅ fixed for ES modules

// PRODUCTS
app.get('/api/products', getAllProducts);
app.put('/api/products/:id', updateProduct);
app.delete('/api/products/:id', deleteProduct);


// PROFILE
app.get('/api/profile', authMiddleware, getProfile);

// catch-all error middleware
app.use((err, req, res, next) => {
    console.log(`An error occured: ${err}`);
    console.error({
        message: err.message,
        stack: err.stack,
        status: err.status || 500
    });
    res.status(err.status || 500).json({
        error: err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});
