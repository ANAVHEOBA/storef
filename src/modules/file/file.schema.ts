import mongoose from 'mongoose';
import { IFile, FileStatus, ChunkStatus } from './file.model';

const fileSchema = new mongoose.Schema<IFile>({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: Object.values(FileStatus),
        default: FileStatus.PENDING
    },
    chunks: {
        total: {
            type: Number,
            required: true
        },
        uploaded: {
            type: Number,
            default: 0
        },
        status: [{
            type: String,
            enum: Object.values(ChunkStatus),
            default: ChunkStatus.PENDING
        }],
        errors: [{
            type: String
        }],
        ipfsCids: [{
            type: String
        }],
        filecoinDealIds: [{
            type: String
        }]
    },
    uploadProgress: {
        type: Number,
        default: 0
    },
    ipfsCid: {
        type: String
    },
    filecoinDealId: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes
fileSchema.index({ owner: 1, status: 1 });
fileSchema.index({ ipfsCid: 1 });
fileSchema.index({ filecoinDealId: 1 });

export const File = mongoose.model<IFile>('File', fileSchema);
