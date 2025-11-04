import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { initializeFirebase } from './config/firebase';

// Import routes
import campaignRoutes from './routes/campaign.routes';
import contentRoutes from './routes/content.routes';
import seoRoutes from './routes/seo.routes';
import influencerRoutes from './routes/influencer.routes';
import userRoutes from './routes/user.routes';
import analyticsRoutes from './routes/analytics.routes';
import aiRoutes from './routes/ai.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

app.use(`${API_PREFIX}/campaigns`, campaignRoutes);
app.use(`${API_PREFIX}/content`, contentRoutes);
app.use(`${API_PREFIX}/seo`, seoRoutes);
app.use(`${API_PREFIX}/influencers`, influencerRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Initialize services and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected');

    // Initialize Firebase
    initializeFirebase();
    console.log('✅ Firebase initialized');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 GrowPilot API running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base: http://localhost:${PORT}${API_PREFIX}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
