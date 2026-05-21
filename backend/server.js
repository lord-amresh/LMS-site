import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import { connect } from 'mongoose';
import { connectDB } from './config/db.js';
import courseRouter from './routes/courseRouter.js';
import bookingRouter from './routes/bookingRouter.js';

const app = express();
const port = 4000;

app.set('trust proxy', 1);
// MIDDLEWARES - FIXED CORS TO ALLOW CLERK TOKENS
app.use(cors({
    origin: ['https://course.amresh.com.np', "https://courseadmin.amresh.com.np"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'] // <-- THIS IS THE MAGIC FIX
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(clerkMiddleware());

app.use('/uploads', express.static('uploads'));

//  DB
connectDB();

// ROUTES
app.use('/api/course', courseRouter);
app.use('/api/booking', bookingRouter);

// APP PORT AND LISTEN
app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});