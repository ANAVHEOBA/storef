import { Router, RequestHandler } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { uploadSchema, videoIdSchema, updateMetadataSchema } from './video.schema';
import { 
    processVideo, 
    getStatus, 
    getMetadata,
    getVideoQuality,
    updateVideoMetadata,
    getUserVideos,
    getVideo,
    getPublicVideos,
    deleteVideoHandler 
} from './video.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Public routes (no authentication required)
router.get(
    '/gallery',
    validateRequest as RequestHandler,
    getPublicVideos as RequestHandler
);

router.get(
    '/:videoId',
    validateRequest as RequestHandler,
    getVideo as RequestHandler
);

// All other routes require authentication
router.use(authenticate as RequestHandler);

// Video processing routes
router.post(
    '/process',
    upload.single('file'),
    validateRequest as RequestHandler,
    processVideo as RequestHandler
);

// Get user's videos
router.get(
    '/my-videos',
    validateRequest as RequestHandler,
    getUserVideos as RequestHandler
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

// Update video metadata
router.patch(
    '/:videoId/metadata',
    validateRequest as RequestHandler,
    updateVideoMetadata as RequestHandler
);

// Get specific video quality
router.get(
    '/:videoId/quality',
    validateRequest as RequestHandler,
    getVideoQuality as RequestHandler
);

router.delete(
    '/:videoId',
    validateRequest as RequestHandler,
    deleteVideoHandler as RequestHandler
);

export default router;