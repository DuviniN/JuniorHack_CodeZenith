import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import advisorRoutes from './routes/advisorRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173','https://nutritionadvisor.netlify.app'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', message: 'NutriLanka API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/advisors', advisorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, req, res, _next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`NutriLanka API ready on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

