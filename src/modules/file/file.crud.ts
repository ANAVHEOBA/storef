import { File } from './file.schema';
import { IFile, FileStatus, ChunkStatus } from './file.model';
import crypto from 'crypto';

export const createFile = async (fileData: Partial<IFile>) => {
    // Ensure chunks object is properly initialized
    if (fileData.chunks) {
        const totalChunks = fileData.chunks.total;
        fileData.chunks = {
            total: totalChunks,
            uploaded: 0,
            status: Array(totalChunks).fill(ChunkStatus.PENDING),
            errors: Array(totalChunks).fill(''),
            cids: Array(totalChunks).fill('')
        };
    }
    
    const file = new File(fileData);
    return await file.save();
};

export const findFileById = async (id: string) => {
    return await File.findById(id);
};

export const findFilesByOwner = async (ownerId: string) => {
    return await File.find({ owner: ownerId });
};

export const updateFileStatus = async (id: string, status: FileStatus) => {
    return await File.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
};

export const updateChunkStatus = async (
    fileId: string,
    chunkIndex: number,
    status: ChunkStatus,
    error?: string,
    cid?: string
) => {
    const file = await File.findById(fileId);
    if (!file) return null;

    // Initialize arrays if they don't exist
    if (!file.chunks.status) {
        file.chunks.status = Array(file.chunks.total).fill(ChunkStatus.PENDING);
    }
    if (!file.chunks.errors) {
        file.chunks.errors = Array(file.chunks.total).fill('');
    }
    if (!file.chunks.cids) {
        file.chunks.cids = Array(file.chunks.total).fill('');
    }

    // Ensure arrays are long enough
    while (file.chunks.status.length <= chunkIndex) {
        file.chunks.status.push(ChunkStatus.PENDING);
    }
    while (file.chunks.errors.length <= chunkIndex) {
        file.chunks.errors.push('');
    }
    while (file.chunks.cids.length <= chunkIndex) {
        file.chunks.cids.push('');
    }

    // Update chunk status
    file.chunks.status[chunkIndex] = status;
    if (error) {
        file.chunks.errors[chunkIndex] = error;
    }
    if (cid) {
        file.chunks.cids[chunkIndex] = cid;
    }

    // Update uploaded count if chunk is uploaded
    if (status === ChunkStatus.UPLOADED) {
        file.chunks.uploaded += 1;
    }

    // Calculate upload progress
    file.uploadProgress = (file.chunks.uploaded / file.chunks.total) * 100;

    // Update file status if all chunks are uploaded
    if (file.chunks.uploaded === file.chunks.total) {
        file.status = FileStatus.UPLOADED;
    }

    return await file.save();
};

export const validateChunk = (chunkData: Buffer, expectedHash: string): boolean => {
    const hash = crypto.createHash('sha256').update(chunkData).digest('hex');
    return hash === expectedHash;
};

export const getChunkStatus = async (fileId: string, chunkIndex: number) => {
    const file = await File.findById(fileId);
    if (!file) return null;

    return {
        status: file.chunks.status[chunkIndex],
        error: file.chunks.errors[chunkIndex],
        cid: file.chunks.cids[chunkIndex]
    };
};

export const updateUploadedChunks = async (id: string, uploadedChunks: number) => {
    return await File.findByIdAndUpdate(
        id,
        { uploadedChunks },
        { new: true }
    );
};
