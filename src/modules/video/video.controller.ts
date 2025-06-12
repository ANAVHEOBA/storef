import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { VideoStatus, IVideo, Video } from './video.model';
import { 
    createVideo, 
    getVideoById, 
    updateVideoStatus, 
    updateVideo, 
    deleteVideo,
    getUserVideos as getUserVideosFromDB,
    updateVideoMetadata as updateVideoMetadataInDB,
    incrementViewCount
} from './video.crud';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { uploadFileToSynapse } from '../../services/synapse.service';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Cache for transcoded files with TTL
const transcodingCache = new Map<string, { path: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour in milliseconds
const SUPPORTED_RESOLUTIONS = ['1920x1080', '1280x720', '854x480'];

// Cleanup cache periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of transcodingCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            // Delete the file and remove from cache
            fs.promises.unlink(value.path)
                .catch(err => console.error(`Failed to delete cached file ${value.path}:`, err));
            transcodingCache.delete(key);
        }
    }
}, CACHE_TTL);

// Process video upload
export const processVideo = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const file = req.file;
        const { title, description, tags, visibility } = req.body;

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

        // Create initial video record with metadata
        const video = await createVideo({
            userId,
            originalName: file.originalname,
            title: title || 'Untitled Video',
            description: description || '',
            tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
            visibility: visibility || 'private',
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

// Get specific video quality
export const getVideoQuality = async (req: AuthRequest, res: Response) => {
    try {
        const { videoId } = req.params;
        const { quality } = req.query;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        if (!quality || !SUPPORTED_RESOLUTIONS.includes(quality as string)) {
            return res.status(400).json({
                success: false,
                error: `Invalid quality. Supported resolutions: ${SUPPORTED_RESOLUTIONS.join(', ')}`
            });
        }

        const video = await getVideoById(videoId);
        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        if (video.userId !== userId) {
            return res.status(403).json({ success: false, error: 'Not authorized to access this video' });
        }

        // Check cache first
        const cacheKey = `${videoId}-${quality}`;
        const cached = transcodingCache.get(cacheKey);
        if (cached && fs.existsSync(cached.path)) {
            return res.sendFile(cached.path);
        }

        // If not in cache, transcode on-the-fly
        const outputDir = 'uploads';
        const outputFilename = `${videoId}_${quality}_${Date.now()}.mp4`;
        const outputPath = path.join(outputDir, outputFilename);

        await new Promise<void>((resolve, reject) => {
            ffmpeg(video.files.original.cdnUrl)
                .videoCodec('libx264')
                .size(quality as string)
                .on('error', (err) => reject(new Error(`Transcoding failed: ${err.message}`)))
                .on('end', () => {
                    // Add to cache
                    transcodingCache.set(cacheKey, {
                        path: outputPath,
                        timestamp: Date.now()
                    });
                    resolve();
                })
                .save(outputPath);
        });

        res.sendFile(outputPath);

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
    const videoPath = file.path;
    
    try {
        // 1. Probe and perform initial DB update with metadata
        const metadata: ffmpeg.FfprobeData = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
        const { duration, size } = metadata.format;
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        const originalResolution = videoStream ? `${videoStream.width}x${videoStream.height}` : 'unknown';
        
        const videoToUpdate = await getVideoById(videoId);
        if (!videoToUpdate) {
            throw new Error('Video not found after probing.');
        }

        videoToUpdate.metadata = { duration: duration || 0, size: size || 0, resolutions: [originalResolution] };
        videoToUpdate.files.original = { path: videoPath };
        await videoToUpdate.save();

        // 2. Upload original file to Synapse/FileCDN
        console.log('Uploading original file to Synapse/FileCDN...');
        const { cdnUrl, commp } = await uploadFileToSynapse(videoPath);
        videoToUpdate.files.original = { path: videoPath, cdnUrl, commp };
        await videoToUpdate.save();
        console.log('Original file uploaded successfully to FileCDN');

        // 3. Generate thumbnail only
        const thumbFilename = `${path.basename(videoPath, path.extname(videoPath))}_thumb.jpg`;
        const thumbPath = path.join(path.dirname(videoPath), thumbFilename);
        await new Promise<void>((resolve, reject) => {
            ffmpeg(videoPath)
                .screenshots({
                    timestamps: ['50%'],
                    filename: thumbFilename,
                    folder: path.dirname(videoPath),
                    size: '640x360'
                })
                .on('end', () => resolve())
                .on('error', (err) => reject(new Error(`Thumbnail generation failed: ${err.message}`)));
        });

        // 4. Save thumbnail path
        const video = await getVideoById(videoId);
        if (!video) throw new Error('Video not found after processing.');
        video.files.thumbnail = { path: thumbPath };
        
        // 5. Final update
        video.status = VideoStatus.COMPLETED;
        video.metadata.resolutions = SUPPORTED_RESOLUTIONS;
        await video.save();
        console.log('Video processing completed. Original file on FileCDN.');

        // 6. Cleanup original file since it's on FileCDN
        fs.promises.unlink(videoPath)
            .then(() => console.log('Original file cleaned up from uploads folder'))
            .catch(err => console.error(`Warning: Failed to delete original file ${videoPath}`, err));

    } catch (error: any) {
        console.error('Video processing failed:', error.message);
        await updateVideoStatus(videoId, VideoStatus.FAILED);
    }
}

// Get user's videos
export const getUserVideos = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const videos = await getUserVideosFromDB(userId);
        res.json({
            success: true,
            videos
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update video metadata
export const updateVideoMetadata = async (req: AuthRequest, res: Response) => {
    try {
        const { videoId } = req.params;
        const userId = req.user?.id;
        const { title, description, tags, visibility } = req.body;

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

        if (video.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this video'
            });
        }

        const updatedVideo = await updateVideoMetadataInDB(videoId, {
            title,
            description,
            tags,
            visibility
        });

        res.json({
            success: true,
            video: updatedVideo
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get video for viewing (public endpoint)
export const getVideo = async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;
        
        const video = await getVideoById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        // If video is private, check authorization
        if (video.visibility === 'private') {
            const userId = (req as AuthRequest).user?.id;
            if (!userId || video.userId !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'This video is private'
                });
            }
        }

        // Increment view count
        await incrementViewCount(videoId);

        // Prepare video data for frontend
        const videoData = {
            id: video._id,
            title: video.title,
            description: video.description,
            creator: video.userId,
            views: video.viewCount,
            duration: video.metadata.duration,
            createdAt: video.createdAt,
            tags: video.tags,
            sources: {
                original: video.files.original.cdnUrl,
                thumbnail: video.files.thumbnail.path,
                // Available qualities for adaptive streaming
                qualities: SUPPORTED_RESOLUTIONS.map(resolution => ({
                    resolution,
                    url: `/api/videos/${videoId}/quality?quality=${resolution}`
                }))
            }
        };

        res.json({
            success: true,
            video: videoData
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get public videos for gallery
export const getPublicVideos = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        // Find all public videos, sorted by newest first
        const videos = await Video.find({ visibility: 'public' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select({
                title: 1,
                description: 1,
                userId: 1,
                viewCount: 1,
                'metadata.duration': 1,
                'files.thumbnail.path': 1,
                'files.original.cdnUrl': 1,
                createdAt: 1
            });

        // Get total count for pagination
        const total = await Video.countDocuments({ visibility: 'public' });

        // Format videos for gallery display
        const galleryVideos = videos.map((video: IVideo) => ({
            id: video._id,
            title: video.title,
            creator: video.userId,
            views: video.viewCount,
            duration: video.metadata.duration,
            thumbnail: video.files.thumbnail.path,
            cdnUrl: video.files.original.cdnUrl,
            createdAt: video.createdAt
        }));

        res.json({
            success: true,
            videos: galleryVideos,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                hasMore: skip + videos.length < total
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};



