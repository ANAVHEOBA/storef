import { Response, Request } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { createStream, getStreamById, addChunkToStream, finalizeStream } from './stream.crud';
import { uploadFileToSynapse } from '../../services/synapse.service';
import { createVideo as createVideoInDB } from '../video/video.crud';
import { VideoStatus } from '../video/video.model';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * @description Starts a new live stream session.
 */
export const startStream = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const stream = await createStream(userId);

        res.status(201).json({
            success: true,
            message: 'Stream session started successfully.',
            streamId: stream._id
        });

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @description Uploads a video chunk for a live stream.
 */
export const uploadChunk = async (req: AuthRequest, res: Response) => {
    // Define path at the top to ensure it's available in the catch block
    const chunkPath = req.file?.path;

    try {
        const { streamId } = req.params;
        const { sequence } = req.body; // Sequence number of the chunk

        if (!chunkPath) {
            return res.status(400).json({ success: false, error: 'No chunk file uploaded.' });
        }
        if (sequence === undefined) {
            // If we fail here, we still need to clean up the file that multer created
            fs.promises.unlink(chunkPath).catch(err => console.error(`Failed to delete chunk: ${chunkPath}`, err));
            return res.status(400).json({ success: false, error: 'Chunk sequence number is required.' });
        }

        const stream = await getStreamById(streamId);
        if (!stream || stream.status !== 'live') {
            fs.promises.unlink(chunkPath).catch(err => console.error(`Failed to delete chunk: ${chunkPath}`, err));
            return res.status(404).json({ success: false, error: 'Active stream not found.' });
        }

        // 1. Upload chunk to Filecoin/FileCDN
        const { cdnUrl } = await uploadFileToSynapse(chunkPath);

        // 2. Get chunk duration using ffmpeg
        const duration: number = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(chunkPath, (err, metadata) => {
                if (err) return reject(new Error('Failed to probe chunk duration.'));
                resolve(metadata.format.duration || 0);
            });
        });

        // 3. Add chunk details to the stream document
        await addChunkToStream(streamId, {
            cdnUrl,
            duration,
            sequence: parseInt(sequence, 10),
        });

        // 4. Clean up the uploaded chunk file from the server
        fs.promises.unlink(chunkPath).catch(err => console.error(`Failed to delete chunk: ${chunkPath}`, err));

        res.status(200).json({
            success: true,
            message: `Chunk ${sequence} uploaded successfully.`
        });

    } catch (error: any) {
        // If an error occurred and a file was uploaded, clean it up
        if (chunkPath) {
            fs.promises.unlink(chunkPath).catch(err => console.error(`Failed to delete chunk on error: ${chunkPath}`, err));
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @description Generates and returns the HLS manifest for a live stream.
 */
export const getLiveManifest = async (req: Request, res: Response) => {
    try {
        const { streamId } = req.params;
        const stream = await getStreamById(streamId);

        if (!stream) {
            return res.status(404).send('Manifest not found.');
        }

        // Sort chunks by sequence number to ensure correct order
        const sortedChunks = stream.chunks.sort((a, b) => a.sequence - b.sequence);

        // Find the maximum duration of any chunk for the #EXT-X-TARGETDURATION tag
        const maxDuration = Math.ceil(Math.max(...sortedChunks.map(c => c.duration), 2));

        // Start creating the manifest string
        let manifest = '#EXTM3U\n';
        manifest += '#EXT-X-VERSION:3\n';
        manifest += `#EXT-X-TARGETDURATION:${maxDuration}\n`;
        // Use a high sequence number to indicate it's a live, ongoing stream
        manifest += `#EXT-X-MEDIA-SEQUENCE:${stream.chunks.length > 0 ? sortedChunks[0].sequence : 0}\n`;

        sortedChunks.forEach(chunk => {
            manifest += `#EXTINF:${chunk.duration.toFixed(4)},\n`;
            manifest += `${chunk.cdnUrl}\n`;
        });

        // If the stream is finished, add the endlist tag
        if (stream.status === 'finished') {
            manifest += '#EXT-X-ENDLIST\n';
        }

        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.status(200).send(manifest);

    } catch (error: any) {
        res.status(500).send('Error generating manifest.');
    }
};

/**
 * @description Stops a live stream and converts it to a VOD asset.
 */
export const stopStream = async (req: AuthRequest, res: Response) => {
    const { streamId } = req.params;
    try {
        const stream = await getStreamById(streamId);
        const userId = req.user?.id;

        if (!stream || stream.userId !== userId) {
            return res.status(404).json({ success: false, error: 'Stream not found or not owned by user.' });
        }
        if (stream.status === 'finished') {
            return res.status(400).json({ success: false, error: 'Stream has already been finalized.' });
        }

        // 1. Generate the final VOD manifest content
        const sortedChunks = stream.chunks.sort((a, b) => a.sequence - b.sequence);
        const maxDuration = Math.ceil(Math.max(...sortedChunks.map(c => c.duration), 2));
        let manifestContent = '#EXTM3U\n';
        manifestContent += '#EXT-X-VERSION:3\n';
        manifestContent += `#EXT-X-TARGETDURATION:${maxDuration}\n`;
        manifestContent += '#EXT-X-PLAYLIST-TYPE:VOD\n';

        sortedChunks.forEach(chunk => {
            manifestContent += `#EXTINF:${chunk.duration.toFixed(4)},\n`;
            manifestContent += `${chunk.cdnUrl}\n`;
        });
        manifestContent += '#EXT-X-ENDLIST\n';

        // 2. Save manifest to a temporary file
        const manifestFileName = `${streamId}_final.m3u8`;
        const manifestPath = path.join(os.tmpdir(), manifestFileName);
        await fs.promises.writeFile(manifestPath, manifestContent);

        // 3. Upload final manifest to Filecoin
        const { cdnUrl: finalManifestUrl } = await uploadFileToSynapse(manifestPath);

        // 4. Create a corresponding video record in the database
        const totalDuration = sortedChunks.reduce((acc, chunk) => acc + chunk.duration, 0);
        const video = await createVideoInDB({
            userId: stream.userId,
            title: `Live Stream from ${stream.createdAt.toLocaleDateString()}`,
            description: `Recording of live stream started at ${stream.createdAt.toISOString()}`,
            originalName: `${streamId}.m3u8`,
            status: VideoStatus.COMPLETED,
            files: {
                original: {
                    path: finalManifestUrl, // The manifest URL is the path for HLS
                    cdnUrl: finalManifestUrl
                },
                thumbnail: { path: '', cdnUrl: '' },
                processed: [],
            },
            metadata: {
                duration: totalDuration,
                size: 0, // Size is not easily calculable for a stream
                resolutions: ['HLS'], // Use 'HLS' to identify it as a stream
            }
        });

        // 5. Finalize the stream session
        await finalizeStream(streamId, finalManifestUrl);
        
        // 6. Clean up the temporary manifest file
        await fs.promises.unlink(manifestPath);

        res.status(200).json({
            success: true,
            message: 'Stream finalized successfully. VOD created.',
            videoId: video._id,
            videoUrl: finalManifestUrl
        });

    } catch (error: any) {
        await finalizeStream(streamId, 'failed'); // Mark as failed
        res.status(500).json({ success: false, error: error.message });
    }
};
