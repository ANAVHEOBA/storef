import { Router, RequestHandler } from 'express';
import { register, verifyEmail, login } from './user.controller';
import { authLimiter } from '../../middleware/rateLimit.middleware';

const router = Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// Auth routes
router.post('/register', register as RequestHandler);
router.post('/verify-email', verifyEmail as RequestHandler);
router.post('/login', login as RequestHandler);

export default router;
