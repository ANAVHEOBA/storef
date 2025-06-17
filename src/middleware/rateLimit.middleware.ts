import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased from 100 to 500 requests
    message: {
        success: false,
        error: 'Too many requests, please try again later'
    }
});

export const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Increased from 100 to 200 requests
    message: {
        success: false,
        error: 'Too many requests, please try again later'
    }
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Changed from 1 hour to 15 minutes
    max: 50, // Increased from 5 to 50 requests
    message: {
        success: false,
        error: 'Too many login attempts, please try again later'
    }
});
