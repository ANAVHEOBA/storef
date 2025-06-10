import { Request, Response } from 'express';
import { createFile, findFileById, updateChunkStatus, validateChunk } from './file.crud';
import { FileStatus, IFileUploadResponse, IChunkUploadResponse, ChunkStatus } from './file.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { RequestHandler } from 'express';
import uploadService from '../../services/upload.service';
import crypto from 'crypto';

// Extend Request type to include user
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const MAX_CHUNK_SIZE = 50 * 1024 * 1024; // 50MB max chunk size

// Configure multer for chunk storage
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: {
        fileSize: MAX_CHUNK_SIZE
    }
});

export const initiateUpload = async (req: AuthRequest, res: Response) => {
    try {
        const { name, size, type } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Validate file size (e.g., max 2GB)
        const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
        if (size > MAX_FILE_SIZE) {
            return res.status(400).json({
                success: false,
                error: 'File size exceeds maximum limit of 2GB'
            });
        }

        // Calculate number of chunks
        const chunks = Math.ceil(size / CHUNK_SIZE);

        // Create file record
        const file = await createFile({
            name,
            size,
            type,
            owner: userId,
            status: FileStatus.PENDING,
            chunks: {
                total: chunks,
                uploaded: 0,
                status: Array(chunks).fill(ChunkStatus.PENDING),
                errors: Array(chunks).fill(''),
                cids: Array(chunks).fill('')  // Initialize CIDs array
            },
            uploadProgress: 0
        });

        const response: IFileUploadResponse = {
            success: true,
            message: 'Upload initiated successfully',
            fileId: file._id.toString(),
            uploadUrl: `/api/files/chunk/${file._id}`,
            chunks,
            chunkSize: CHUNK_SIZE
        };

        res.status(201).json(response);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create a middleware to handle the chunk upload
const uploadChunkMiddleware = upload.single('chunk');

export const uploadChunk = async (req: Request, res: Response): Promise<void> => {
    uploadChunkMiddleware(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({
                    success: false,
                    error: `Chunk size exceeds limit. Maximum chunk size is ${MAX_CHUNK_SIZE / (1024 * 1024)}MB`
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: 'Error uploading file: ' + err.message
                });
            }
            return;
        }

        try {
            const { id } = req.params;
            const { chunkIndex, hash } = req.body;
            const chunk = req.file;

            if (!chunk) {
                res.status(400).json({
                    success: false,
                    error: 'No chunk file provided'
                });
                return;
            }

            if (!chunkIndex || !hash) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required fields: chunkIndex and hash'
                });
                return;
            }

            // Calculate hash of the received chunk
            const receivedHash = crypto.createHash('sha256').update(chunk.buffer).digest('hex');
            
            // Verify hash
            if (receivedHash !== hash) {
                res.status(400).json({
                    success: false,
                    error: 'Chunk hash verification failed'
                });
                return;
            }

            const result = await uploadService.handleChunkUpload(
                id,
                parseInt(chunkIndex),
                chunk.buffer,
                hash
            );

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            // Get updated file status
            const updatedFile = await findFileById(id);
            if (!updatedFile) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get updated file status'
                });
                return;
            }

            const response: IChunkUploadResponse = {
                success: true,
                message: 'Chunk uploaded successfully',
                progress: updatedFile.uploadProgress,
                uploadedChunks: updatedFile.chunks.uploaded,
                totalChunks: updatedFile.chunks.total
            };

            res.json(response);
        } catch (error) {
            console.error('Error uploading chunk:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    });
};
