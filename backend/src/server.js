import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { runSeed } from './services/seedService.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      const allowedClient = process.env.CLIENT_URL;
      if (
        !allowedClient ||
        allowedClient === '*' ||
        origin === allowedClient ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CrewUp API',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    await runSeed({ force: false });
    app.listen(PORT, () => {
      console.log(`[CrewUp Server] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[CrewUp Server] Startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
