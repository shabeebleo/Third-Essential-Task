import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());


// User routes
app.use('/users', userRoutes);

// Admin routes
app.use('/admins', adminRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  