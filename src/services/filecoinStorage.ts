import lighthouse from '@lighthouse-web3/sdk';
import { config } from 'dotenv';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

config();

export class FilecoinStorageService {
    private lighthouseApiKey: string;

    constructor() {
        this.lighthouseApiKey = process.env.LIGHTHOUSE_API_KEY || '';
        if (!this.lighthouseApiKey) {
            throw new Error('LIGHTHOUSE_API_KEY is not set in environment variables');
        }
    }

    // Store data using Lighthouse (recommended for small files)
    async storeWithLighthouse(data: Buffer): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            // Create a temporary file
            const tempFilePath = join('/tmp', `${uuidv4()}.tmp`);
            writeFileSync(tempFilePath, data);

            // Upload to Lighthouse
            const response = await lighthouse.upload(tempFilePath, this.lighthouseApiKey);

            // Clean up temporary file
            unlinkSync(tempFilePath);

            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // Get deal status
    async getDealStatus(cid: string): Promise<{ success: boolean; status?: any; error?: string }> {
        try {
            const status = await lighthouse.dealStatus(cid);
            return {
                success: true,
                status: status
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
}

export default new FilecoinStorageService(); 
module.exports = new FilecoinStorageService(); 