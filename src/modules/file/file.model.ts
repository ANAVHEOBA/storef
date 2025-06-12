export enum FileStatus {
    PENDING = 'PENDING',
    UPLOADING = 'UPLOADING',
    UPLOADED = 'UPLOADED',
    STORING = 'STORING',
    STORED = 'STORED',
    FAILED = 'FAILED'
}

export enum ChunkStatus {
    PENDING = 'PENDING',
    UPLOADING = 'UPLOADING',
    UPLOADED = 'UPLOADED',
    FAILED = 'FAILED'
}

export interface IChunk {
    index: number;
    hash: string;
    status: ChunkStatus;
    error?: string;
    ipfsCid?: string;
    filecoinDealId?: string;
}

export interface IFile {
    _id?: string;
    name: string;
    size: number;
    type: string;
    owner: string;
    status: FileStatus;
    chunks: {
        total: number;
        uploaded: number;
        status: ChunkStatus[];
        errors: string[];
        ipfsCids: string[];
        filecoinDealIds: string[];
    };
    uploadProgress: number;
    ipfsCid?: string;
    filecoinDealId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFileUploadResponse {
    success: boolean;
    message: string;
    fileId: string;
    uploadUrl: string;
    chunks: number;
    chunkSize: number;
}

export interface IChunkUploadResponse {
    success: boolean;
    message: string;
    progress: number;
    uploadedChunks: number;
    totalChunks: number;
    ipfsCid?: string;
    filecoinDealId?: string;
} 