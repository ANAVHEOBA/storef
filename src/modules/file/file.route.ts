import { Router, RequestHandler } from 'express';
import { initiateUpload, uploadChunk } from './file.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate as RequestHandler);

// File routes
router.post('/upload', initiateUpload as RequestHandler);
router.post('/chunk/:id', uploadChunk as RequestHandler);

export default router;
