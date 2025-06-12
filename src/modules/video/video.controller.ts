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
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

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
    const videoPath = file.path;
    
    try {
        // 1. Probe video for metadata
        const metadata: ffmpeg.FfprobeData = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        const { duration, size } = metadata.format;
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        const originalResolution = videoStream ? `${videoStream.width}x${videoStream.height}` : 'unknown';
        
        // First-pass update: Save initial metadata so the user gets immediate feedback
        await updateVideo(videoId, {
            metadata: {
                duration: duration || 0,
                size: size || 0,
                resolutions: [originalResolution]
            },
            files: {
                original: videoPath,
                thumbnail: '',
                processed: [],
            }
        });
        
        // 2. Transcode to different resolutions and generate thumbnail
        const targetResolutions = ['1920x1080', '1280x720'];
        const processedFiles: { resolution: string; path: string }[] = [];
        const outputDir = path.dirname(videoPath);

        const transcodingPromises = targetResolutions.map(res => {
            return new Promise<void>((resolve, reject) => {
                const [width, height] = res.split('x').map(Number);
                const outputFilename = `${path.basename(videoPath, path.extname(videoPath))}_${height}p.mp4`;
                const outputPath = path.join(outputDir, outputFilename);

                ffmpeg(videoPath)
                    .videoCodec('libx264')
                    .size(res)
                    .on('error', (err) => {
                        console.error(`Error transcoding to ${res}:`, err.message);
                        reject(new Error(`Transcoding to ${res} failed`));
                    })
                    .on('end', () => {
                        console.log(`Finished transcoding to ${res}`);
                        processedFiles.push({ resolution: res, path: outputPath });
                        resolve();
                    })
                    .save(outputPath);
            });
        });

        const thumbnailPromise = new Promise<string>((resolve, reject) => {
            const thumbnailFilename = `${path.basename(videoPath, path.extname(videoPath))}_thumb.jpg`;
            const thumbnailPath = path.join(outputDir, thumbnailFilename);

            ffmpeg(videoPath)
                .screenshots({
                    timestamps: ['50%'],
                    filename: thumbnailFilename,
                    folder: outputDir,
                    size: '640x360'
                })
                .on('end', () => {
                    console.log('Thumbnail generated');
                    resolve(thumbnailPath);
                })
                .on('error', (err) => {
                    console.error('Error generating thumbnail:', err.message);
                    reject(new Error('Thumbnail generation failed'));
                });
        });
        
        const [, thumbnailPath] = await Promise.all([
            Promise.all(transcodingPromises),
            thumbnailPromise
        ]);

        // Final update: Set status to COMPLETED and add processed files
        const video = await getVideoById(videoId);
        if (video) {
            video.status = VideoStatus.COMPLETED;
            video.files.processed = processedFiles;
            video.files.thumbnail = thumbnailPath;
            video.metadata.resolutions = [originalResolution, ...processedFiles.map(f => f.resolution)];
            await video.save();
        }

        console.log('Video processing completed and database updated.');

    } catch (error: any) {
        console.error('Video processing failed:', error.message);
        await updateVideoStatus(videoId, VideoStatus.FAILED);
    }
}
