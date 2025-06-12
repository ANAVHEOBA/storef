import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { VideoStatus, IVideo } from './video.model';
import { 
    createVideo, 
    getVideoById, 
    updateVideoStatus, 
    updateVideo, 
    deleteVideo 
} from './video.crud';

// Process video upload
export const processVideo = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const file = req.file;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Create initial video record
        const video = await createVideo({
            userId,
            originalName: file.originalname,
            status: VideoStatus.PROCESSING
        });

        // Start async processing
        if (video && video._id) {
            processVideoAsync(video._id.toString(), file);
        }

        res.status(202).json({
            success: true,
            videoId: video._id,
            message: 'Video processing started'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get video processing status
export const getStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { videoId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const video = await getVideoById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        // Check if user owns the video
        if (video.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this video'
            });
        }

        res.json({
            success: true,
            status: video.status,
            metadata: video.metadata
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get video metadata
export const getMetadata = async (req: AuthRequest, res: Response) => {
    try {
        const { videoId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const video = await getVideoById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        // Check if user owns the video
        if (video.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this video'
            });
        }

        res.json({
            success: true,
            metadata: video.metadata,
            files: video.files
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete video
export const deleteVideoHandler = async (req: AuthRequest, res: Response) => {
    try {
        const { videoId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const video = await getVideoById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        // Check if user owns the video
        if (video.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this video'
            });
        }

        await deleteVideo(videoId);

        res.json({
            success: true,
            message: 'Video deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Helper function for async video processing
async function processVideoAsync(videoId: string, file: Express.Multer.File) {
    try {
        // TODO: Implement video processing logic
        // 1. Generate thumbnail
        // 2. Create different resolutions
        // 3. Update video record with processed files
        // 4. Update status to COMPLETED

        // For now, just update status
        await updateVideoStatus(videoId, VideoStatus.COMPLETED);
    } catch (error) {
        console.error('Video processing failed:', error);
        await updateVideoStatus(videoId, VideoStatus.FAILED);
    }
}
