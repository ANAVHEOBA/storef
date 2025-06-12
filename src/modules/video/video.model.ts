import { Document, model, Schema } from 'mongoose';

export enum VideoStatus {
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface IVideo extends Document {
    userId: string;
    originalName: string;
    status: VideoStatus;
    metadata: {
        duration: number;
        size: number;
        resolutions: string[];
    };
    files: {
        original: string;
        thumbnail: string;
        processed: {
            resolution: string;
            path: string;
        }[];
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface VideoInput {
    userId: string;
    originalName: string;
    status: VideoStatus;
    metadata?: {
        duration: number;
        size: number;
        resolutions: string[];
    };
    files?: {
        original: string;
        thumbnail: string;
        processed: {
            resolution: string;
            path: string;
        }[];
    };
}

const videoSchema = new Schema<IVideo>(
    {
        userId: { type: String, required: true },
        originalName: { type: String, required: true },
        status: { 
            type: String, 
            enum: Object.values(VideoStatus),
            default: VideoStatus.PROCESSING 
        },
        metadata: {
            duration: { type: Number, default: 0 },
            size: { type: Number, default: 0 },
            resolutions: [{ type: String }]
        },
        files: {
            original: { type: String },
            thumbnail: { type: String },
            processed: [{
                resolution: { type: String },
                path: { type: String }
            }]
        }
    },
    { timestamps: true }
);

export const Video = model<IVideo>('Video', videoSchema);
