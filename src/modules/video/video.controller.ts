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
import fs from 'fs';
import { uploadFileToSynapse } from '../../services/synapse.service';

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

        // 2. Transcode locally and generate thumbnail
        const targetResolutions = ['1920x1080', '1280x720'];
        const processedFiles: { resolution: string; path: string }[] = [];
        const outputDir = path.dirname(videoPath);
        const transcodingPromises = targetResolutions.map(res => {
            return new Promise<void>((resolve, reject) => {
                const outputFilename = `${path.basename(videoPath, path.extname(videoPath))}_${res.split('x')[1]}p.mp4`;
                const outputPath = path.join(outputDir, outputFilename);
                ffmpeg(videoPath).videoCodec('libx264').size(res)
                    .on('error', (err) => reject(new Error(`Transcoding to ${res} failed: ${err.message}`)))
                    .on('end', () => {
                        processedFiles.push({ resolution: res, path: outputPath });
                        resolve();
                    }).save(outputPath);
            });
        });
        const thumbnailPromise = new Promise<string>((resolve, reject) => {
            const thumbFilename = `${path.basename(videoPath, path.extname(videoPath))}_thumb.jpg`;
            const thumbPath = path.join(outputDir, thumbFilename);
            ffmpeg(videoPath).screenshots({ timestamps: ['50%'], filename: thumbFilename, folder: outputDir, size: '640x360' })
                .on('end', () => resolve(thumbPath))
                .on('error', (err) => reject(new Error(`Thumbnail generation failed: ${err.message}`)));
        });

        const [thumbnailPath] = await Promise.all([thumbnailPromise, Promise.all(transcodingPromises)]);
        
        // 3. Upload all generated files to Synapse
        const video = await getVideoById(videoId);
        if (!video) throw new Error('Video not found after processing.');

        const originalUploadResult = await uploadFileToSynapse(videoPath);
        video.files.original = { path: videoPath, ...originalUploadResult };

        const thumbnailUploadResult = await uploadFileToSynapse(thumbnailPath);
        video.files.thumbnail = { path: thumbnailPath, ...thumbnailUploadResult };

        const processedFileUploads = await Promise.all(
            processedFiles.map(async (file) => {
                const { cdnUrl, commp } = await uploadFileToSynapse(file.path);
                return { ...file, cdnUrl, commp };
            })
        );
        video.files.processed = processedFileUploads;
        
        // 4. Final update and cleanup
        video.status = VideoStatus.COMPLETED;
        video.metadata.resolutions = [originalResolution, ...processedFiles.map(f => f.resolution)];
        await video.save();
        console.log('Video processing and Synapse upload completed.');

        // 5. Cleanup local files
        const filesToDelete = [videoPath, thumbnailPath, ...processedFiles.map(f => f.path)];
        for (const filePath of filesToDelete) {
            fs.promises.unlink(filePath).catch(err => console.error(`Failed to delete temp file ${filePath}`, err));
        }

    } catch (error: any) {
        console.error('Video processing failed:', error.message);
        await updateVideoStatus(videoId, VideoStatus.FAILED);
    }
}
