import express  from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectDB from './config/mongodb.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/userRoutes.js';
dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT ||4000;
app.use(express.json());
app.use(cors({
    credentials: true,
}));
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('API IS WORKING!');
});
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);    
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

