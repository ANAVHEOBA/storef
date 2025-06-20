import { Document, model, Schema } from 'mongoose';

export enum VideoStatus {
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface IVideo extends Document {
    userId: string;
    title: string;
    description: string;
    originalName: string;
    status: VideoStatus;
    visibility: 'public' | 'private';
    tags: string[];
    viewCount: number;
    likesCount: number;
    commentsCount: number;
    metadata: {
        duration: number;
        size: number;
        resolutions: string[];
    };
    files: {
        original: {
            path: string;
            cdnUrl?: string;
            commp?: string;
        };
        thumbnail?: {
            path: string;
            cdnUrl?: string;
            commp?: string;
        };
        processed?: {
            resolution: string;
            path: string;
            cdnUrl?: string;
            commp?: string;
        }[];
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface VideoInput {
    userId: string;
    title?: string;
    description?: string;
    originalName: string;
    status: VideoStatus;
    visibility?: 'public' | 'private';
    tags?: string[];
    metadata?: {
        duration: number;
        size: number;
        resolutions: string[];
    };
    files?: {
        original: {
            path: string;
            cdnUrl?: string;
            commp?: string;
        };
        thumbnail: {
            path: string;
            cdnUrl?: string;
            commp?: string;
        };
        processed: {
            resolution: string;
            path: string;
            cdnUrl?: string;
            commp?: string;
        }[];
    };
}

const fileDetailSchema = {
    path: { type: String },
    cdnUrl: { type: String },
    commp: { type: String },
};

const videoSchema = new Schema<IVideo>(
    {
        userId: { type: String, required: true },
        title: { type: String, default: 'Untitled Video' },
        description: { type: String, default: '' },
        originalName: { type: String, required: true },
        status: { 
            type: String, 
            enum: Object.values(VideoStatus),
            default: VideoStatus.PROCESSING 
        },
        visibility: { 
            type: String, 
            enum: ['public', 'private'],
            default: 'private'
        },
        tags: [{ type: String }],
        viewCount: { type: Number, default: 0 },
        likesCount: { type: Number, default: 0 },
        commentsCount: { type: Number, default: 0 },
        metadata: {
            duration: { type: Number, default: 0 },
            size: { type: Number, default: 0 },
            resolutions: [{ type: String }]
        },
        files: {
            original: fileDetailSchema,
            thumbnail: fileDetailSchema,
            processed: [{
                resolution: { type: String },
                ...fileDetailSchema
            }]
        }
    },
    { timestamps: true }
);

export const Video = model<IVideo>('Video', videoSchema);

export interface IComment extends Document {
    userId: string;
    videoId: string;
    content: string;
    parentCommentId?: string; // For replies
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        userId: { type: String, required: true, ref: 'User' },
        videoId: { type: String, required: true, ref: 'Video' },
        content: { type: String, required: true, trim: true, maxlength: 5000 },
        parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment' }
    },
    { timestamps: true }
);

export const Comment = model<IComment>('Comment', commentSchema);

export interface ILike extends Document {
    userId: string;
    videoId: string;
    createdAt: Date;
}

const likeSchema = new Schema<ILike>(
    {
        userId: { type: String, required: true, ref: 'User' },
        videoId: { type: String, required: true, ref: 'Video' }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

likeSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export const Like = model<ILike>('Like', likeSchema);
