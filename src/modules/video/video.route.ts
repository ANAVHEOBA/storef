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

// --- PUBLIC ROUTES ---
// Specific public routes should come first.
router.get(
    '/gallery',
    getPublicVideos as RequestHandler
);

// --- PROTECTED ROUTES ---
// All routes below require authentication. We apply it individually
// to control the route order.

// Get user's own videos (specific route)
router.get(
    '/my-videos',
    authenticate as RequestHandler,
    getUserVideos as RequestHandler
);

// Process a new video
router.post(
    '/process',
    authenticate as RequestHandler,
    upload.single('file'),
    processVideo as RequestHandler
);

// Get status for a video
router.get(
    '/status/:videoId',
    authenticate as RequestHandler,
    getStatus as RequestHandler
);

// Get metadata for a video
router.get(
    '/metadata/:videoId',
    authenticate as RequestHandler,
    getMetadata as RequestHandler
);

// Update video metadata
router.patch(
    '/:videoId/metadata',
    authenticate as RequestHandler,
    updateVideoMetadata as RequestHandler
);

// Get specific video quality
router.get(
    '/:videoId/quality',
    authenticate as RequestHandler,
    getVideoQuality as RequestHandler
);

// Delete a video
router.delete(
    '/:videoId',
    authenticate as RequestHandler,
    deleteVideoHandler as RequestHandler
);


// --- PUBLIC PARAMETERIZED ROUTE (MUST BE LAST) ---
// This route for getting a single video is public, but has internal
// checks for private videos. It must be last to avoid catching
// more specific routes like /my-videos.
router.get(
    '/:videoId',
    validateRequest as RequestHandler,
    getVideo as RequestHandler
);


export default router;