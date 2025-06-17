import { Router, RequestHandler } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { startStream, uploadChunk, getLiveManifest, stopStream } from './stream.controller';
import multer from 'multer';

const router = Router();
// Store chunks in a separate directory to keep them organized
const upload = multer({ dest: 'uploads/chunks/' });

// Route to get the live stream manifest (no auth needed for player access)
router.get(
    '/:streamId/live.m3u8',
    getLiveManifest as RequestHandler
);

// All stream routes below require authentication
router.use(authenticate as RequestHandler);

// Route to start a new live stream
router.post(
    '/start',
    startStream as RequestHandler
);

// Route to upload a video chunk for a specific stream
router.post(
    '/:streamId/upload',
    upload.single('video_chunk'),
    uploadChunk as RequestHandler
);

// Route to stop a live stream and finalize it
router.post(
    '/:streamId/stop',
    stopStream as RequestHandler
);

// We will add more routes here for stopping the stream.

export default router;