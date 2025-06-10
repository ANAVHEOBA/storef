import pinataSDK from '@pinata/sdk';
import { config } from '../config';
import { Readable } from 'stream';

class IPFSService {
    private pinata: any;
    private storageLimit: number;

    constructor() {
        this.pinata = new pinataSDK(
            config.pinataApiKey,
            config.pinataSecretKey
        );
        this.storageLimit = config.ipfsStorageLimit;
    }

    async uploadChunk(chunk: Buffer, fileName: string): Promise<string> {
        try {
            // Convert buffer to readable stream
            const stream = Readable.from(chunk);

            // Upload to IPFS via Pinata
            const result = await this.pinata.pinFileToIPFS(stream, {
                pinataMetadata: {
                    name: fileName
                }
            });

            return result.IpfsHash; // This is the CID
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw new Error('Failed to upload chunk to IPFS');
        }
    }

    async getStorageUsage(): Promise<number> {
        try {
            const data = await this.pinata.pinList();
            return data.count;
        } catch (error) {
            console.error('Error getting storage usage:', error);
            throw new Error('Failed to get storage usage');
        }
    }

    async checkStorageLimit(): Promise<boolean> {
        const usage = await this.getStorageUsage();
        return usage < this.storageLimit;
    }

    async getFile(cid: string): Promise<Buffer> {
        try {
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
            return Buffer.from(await response.arrayBuffer());
        } catch (error) {
            console.error('Error retrieving file from IPFS:', error);
            throw new Error('Failed to retrieve file from IPFS');
        }
    }

    async pinFile(cid: string): Promise<void> {
        try {
            await this.pinata.pinByHash(cid);
        } catch (error) {
            console.error('Error pinning file:', error);
            throw new Error('Failed to pin file');
        }
    }

    async unpinFile(cid: string): Promise<void> {
        try {
            await this.pinata.unpin(cid);
        } catch (error) {
            console.error('Error unpinning file:', error);
            throw new Error('Failed to unpin file');
        }
    }
}

export const ipfsService = new IPFSService(); 