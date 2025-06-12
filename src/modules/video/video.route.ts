import { Router, RequestHandler } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { uploadSchema, videoIdSchema } from './video.schema';
import { 
    processVideo, 
    getStatus, 
    getMetadata, 
    deleteVideoHandler 
} from './video.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// All routes require authentication
router.use(authenticate as RequestHandler);

// Video processing routes
router.post(
    '/process',
    upload.single('file'),
    validateRequest as RequestHandler,
    processVideo as RequestHandler
);

router.get(
    '/status/:videoId',
    validateRequest as RequestHandler,
    getStatus as RequestHandler
);

router.get(
    '/metadata/:videoId',
    validateRequest as RequestHandler,
    getMetadata as RequestHandler
);

router.delete(
    '/:videoId',
    validateRequest as RequestHandler,
    deleteVideoHandler as RequestHandler
);

export default router;