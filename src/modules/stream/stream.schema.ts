import mongoose, { Schema } from 'mongoose';
import { IStream, StreamStatus } from './stream.model';

const StreamChunkSchema = new Schema({
    cdnUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    sequence: { type: Number, required: true }
}, { _id: false });

const StreamSchema = new Schema<IStream>({
    userId: { 
        type: String, 
        required: true,
        ref: 'User' 
    },
    status: { 
        type: String, 
        enum: Object.values(StreamStatus), 
        default: StreamStatus.LIVE 
    },
    chunks: [StreamChunkSchema],
    finalManifestUrl: { type: String },
}, { timestamps: true });

export const Stream = mongoose.model<IStream>('Stream', StreamSchema);

