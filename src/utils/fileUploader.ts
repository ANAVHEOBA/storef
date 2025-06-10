import axios from 'axios';
import crypto from 'crypto';

export class FileUploader {
    private readonly chunkSize: number;
    private readonly baseUrl: string;
    private readonly token: string;

    constructor(baseUrl: string, token: string, chunkSize: number = 1024 * 1024) {
        this.baseUrl = baseUrl;
        this.token = token;
        this.chunkSize = chunkSize;
    }

    async uploadFile(file: File | Blob, onProgress?: (progress: number) => void): Promise<string> {
        try {
            // Step 1: Initiate upload
            const initResponse = await this.initiateUpload(file);
            const { fileId, chunks, chunkSize } = initResponse;

            // Step 2: Upload chunks
            const totalChunks = chunks;
            let uploadedChunks = 0;

            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, file.size);
                const chunk = file.slice(start, end);

                // Calculate chunk hash
                const hash = await this.calculateHash(chunk);

                // Upload chunk with retry logic
                await this.uploadChunkWithRetry(fileId, i, chunk, hash);

                uploadedChunks++;
                if (onProgress) {
                    onProgress((uploadedChunks / totalChunks) * 100);
                }
            }

            return fileId;
        } catch (error) {
            throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async initiateUpload(file: File | Blob): Promise<{ fileId: string; chunks: number; chunkSize: number }> {
        const response = await axios.post(
            `${this.baseUrl}/api/files/upload`,
            {
                name: file instanceof File ? file.name : 'uploaded-file',
                size: file.size,
                type: file instanceof File ? file.type : 'application/octet-stream'
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to initiate upload');
        }

        return {
            fileId: response.data.fileId,
            chunks: response.data.chunks,
            chunkSize: response.data.chunkSize
        };
    }

    private async uploadChunkWithRetry(fileId: string, chunkIndex: number, chunk: Blob, hash: string, maxRetries: number = 3): Promise<void> {
        let lastError: Error | null = null;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await this.uploadChunk(fileId, chunkIndex, chunk, hash);
                return;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                console.warn(`Attempt ${attempt} failed for chunk ${chunkIndex}: ${lastError.message}`);
                
                if (attempt < maxRetries) {
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }

        throw new Error(`Failed to upload chunk ${chunkIndex} after ${maxRetries} attempts: ${lastError?.message}`);
    }

    private async uploadChunk(fileId: string, chunkIndex: number, chunk: Blob, hash: string): Promise<void> {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('hash', hash);

        const response = await axios.post(
            `${this.baseUrl}/api/files/chunk/${fileId}`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to upload chunk');
        }
    }

    private async calculateHash(chunk: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const buffer = reader.result as ArrayBuffer;
                const hash = crypto.createHash('sha256').update(Buffer.from(buffer)).digest('hex');
                resolve(hash);
            };
            reader.onerror = () => reject(new Error('Failed to read chunk'));
            reader.readAsArrayBuffer(chunk);
        });
    }
} 