import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { apiLimiter } from './middleware/rateLimit.middleware';
import userRoutes from './modules/user/user.route';
import fileRoutes from './modules/file/file.route';
import videoRoutes from './modules/video/video.route';
import streamRoutes from './modules/stream/stream.route'

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:", "*"],
            mediaSrc: ["'self'", "data:", "blob:", "*"]
        }
    }
}));

app.use(cors({
    origin: ['http://localhost:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads', {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Apply rate limiting to all routes
app.use(apiLimiter);

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/streams', streamRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

export default app;

