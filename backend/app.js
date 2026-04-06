import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import financeRoutes from './routes/finance.routes.js';
import studyRoutes from './routes/study.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import internalRoutes from './routes/internal.routes.js';
import errorHandler from './middleware/error.js';

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'trimind-api' }, meta: {} });
});

app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/internal', internalRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error_code: 'NOT_FOUND',
    message: 'The requested endpoint does not exist.',
    data: null,
  });
});

app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5000');

app.listen(PORT, async () => {
  console.log(`🚀 TriMind API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);

  await import('./cron/computeScores.js');
  await import('./cron/dailyNudge.js');
  console.log('⏰ Cron jobs initialized');
});

export default app;