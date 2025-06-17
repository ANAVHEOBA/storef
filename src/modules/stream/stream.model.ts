import { Document } from 'mongoose';

export enum StreamStatus {
    LIVE = 'live',
    FINISHED = 'finished',
    FAILED = 'failed'
}

export interface IStreamChunk {
    cdnUrl: string;
    duration: number;
    sequence: number;
}

export interface IStream extends Document {
    userId: string;
    status: StreamStatus;
    chunks: IStreamChunk[];
    finalManifestUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

