import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiLimiter } from './middleware/rateLimit.middleware';
import userRoutes from './modules/user/user.route';
import fileRoutes from './modules/file/file.route';
import videoRoutes from './modules/video/video.route';

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging

// Apply rate limiting to all routes
app.use(apiLimiter);

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/videos', videoRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

export default app;

