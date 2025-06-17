import { Router, RequestHandler } from 'express';
import { register, verifyEmail, login, getProfile } from './user.controller';
import { authLimiter } from '../../middleware/rateLimit.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// Auth routes (no authentication required)
router.post('/register', register as RequestHandler);
router.post('/verify-email', verifyEmail as RequestHandler);
router.post('/login', login as RequestHandler);

// Protected routes (authentication required)
router.get('/profile', authenticate as RequestHandler, getProfile as RequestHandler);

export default router;
