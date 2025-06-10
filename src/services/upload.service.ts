import { ChunkStatus } from '../modules/file/file.model';
import { File } from '../modules/file/file.schema';
import { updateChunkStatus, validateChunk } from '../modules/file/file.crud';
import filecoinStorage from './filecoinStorage';
import { ipfsService } from './ipfs.service';

interface UploadResponse {
    success: boolean;
    message?: string;
    error?: string;
    cid?: string;
}

class UploadService {
    private filecoinStorage = filecoinStorage;

    async handleChunkUpload(fileId: string, chunkIndex: number, chunk: Buffer, hash: string): Promise<UploadResponse> {
        try {
            // Validate chunk
            const isValid = await validateChunk(chunk, hash);
            if (!isValid) {
                return {
                    success: false,
                    error: 'Chunk validation failed'
                };
            }

            // Update chunk status to UPLOADING
            await updateChunkStatus(fileId, chunkIndex, ChunkStatus.UPLOADING);

            // First, upload to IPFS
            const cid = await ipfsService.uploadChunk(chunk, `chunk_${chunkIndex}`);
            
            // Pin the file in IPFS
            await ipfsService.pinFile(cid);

            // Update chunk status to UPLOADED with CID
            await updateChunkStatus(fileId, chunkIndex, ChunkStatus.UPLOADED, '', cid);

            // Store chunk in Filecoin (optional, can be done later)
            const storageResult = await this.filecoinStorage.storeWithLighthouse(chunk);
            if (!storageResult.success) {
                console.warn(`Filecoin storage failed for chunk ${chunkIndex}, but IPFS upload successful`);
            }

            return {
                success: true,
                message: 'Chunk uploaded and stored successfully',
                cid: cid
            };
        } catch (error) {
            await updateChunkStatus(fileId, chunkIndex, ChunkStatus.FAILED, error instanceof Error ? error.message : 'Unknown error');
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
}

export default new UploadService();






