import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import organisationRoutes from './routes/organisations.js';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organisations', organisationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;