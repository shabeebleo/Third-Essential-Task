import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import cors from 'cors';



const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust as needed
  allowedHeaders: ['Content-Type', 'Authorization'], // Include the necessary headers
}));

// User routes
app.use('/users', userRoutes);

// Admin routes
app.use('/admins', adminRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  