import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDb();

// Middleware — parse JSON request bodies
app.use(express.json());

// Mount all routes under /api
app.use('/api', routes);

// Health check
app.get('/', (_req, res) => {
    res.json({ message: 'Patient Feedback System API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
