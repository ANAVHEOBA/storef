import { ChunkStatus } from '../modules/file/file.model';
import { File as FileModel } from '../modules/file/file.schema';
import { updateChunkStatus, validateChunk } from '../modules/file/file.crud';
import { filecoinStorage } from './filecoinStorage';
import { ipfsService } from './ipfs.service';
import { config } from '../config';

interface UploadResponse {
    success: boolean;
    message?: string;
    error?: string;
    ipfsCid?: string;
    filecoinDealId?: string;
}

class UploadService {
    private filecoinStorage = filecoinStorage;
    private readonly CHUNK_COUNT = 8;

    async handleChunkUpload(fileId: string, chunkIndex: number, chunk: Buffer, hash: string): Promise<UploadResponse> {
        try {
            // Validate chunk index
            if (chunkIndex < 0 || chunkIndex >= this.CHUNK_COUNT) {
                return {
                    success: false,
                    error: `Invalid chunk index. Must be between 0 and ${this.CHUNK_COUNT - 1}`
                };
            }

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

            // Upload to both IPFS and Filecoin simultaneously
            const [ipfsResult, filecoinResult] = await Promise.all([
                ipfsService.uploadChunk(chunk, `chunk_${chunkIndex}`),
                this.filecoinStorage.storeWithLighthouse(chunk)
            ]);

            // Update chunk status with both results
            await updateChunkStatus(
                fileId,
                chunkIndex,
                ChunkStatus.UPLOADED,
                '',
                ipfsResult,
                filecoinResult.data?.dealId
            );

            return {
                success: true,
                message: 'Chunk uploaded and stored successfully',
                ipfsCid: ipfsResult,
                filecoinDealId: filecoinResult.data?.dealId
            };
        } catch (error) {
            await updateChunkStatus(
                fileId,
                chunkIndex,
                ChunkStatus.FAILED,
                error instanceof Error ? error.message : 'Unknown error'
            );
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
}

export default new UploadService();











