import lighthouse from '@lighthouse-web3/sdk';
import { config } from 'dotenv';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

config();

// Define response types
interface LighthouseUploadResponse {
    data: {
        Name: string;
        Hash: string;
        Size: string;
    };
}

interface LighthouseDealResponse {
    data: {
        dealId: string;
        status: string;
        cid: string;
    };
}

interface FilecoinResponse {
    success: boolean;
    data?: {
        dealId: string;
        cid: string;
        status: string;
    };
    error?: string;
}

export class FilecoinStorageService {
    private lighthouseApiKey: string;
    private readonly MAX_RETRIES = 3;
    private readonly RETRY_DELAY = 1000; // 1 second
    private readonly network: string;

    constructor() {
        this.lighthouseApiKey = process.env.LIGHTHOUSE_API_KEY || '';
        this.network = process.env.FILECOIN_NETWORK || 'calibration';
        
        if (!this.lighthouseApiKey) {
            throw new Error('LIGHTHOUSE_API_KEY is not set in environment variables');
        }
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Store data using Lighthouse with retry mechanism
    async storeWithLighthouse(data: Buffer): Promise<FilecoinResponse> {
        let lastError: Error | null = null;
        
        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                // Create a temporary file
                const tempFilePath = join('/tmp', `${uuidv4()}.tmp`);
                writeFileSync(tempFilePath, data);

                // Upload to Lighthouse
                const response = await lighthouse.upload(tempFilePath, this.lighthouseApiKey);
                const uploadResponse = response as unknown as LighthouseUploadResponse;

                // Clean up temporary file
                unlinkSync(tempFilePath);

                // Verify the response
                if (!uploadResponse?.data?.Hash) {
                    throw new Error('Invalid response from Lighthouse');
                }

                // Get deal status
                const dealStatus = await this.getDealStatus(uploadResponse.data.Hash);

                return {
                    success: true,
                    data: {
                        dealId: uploadResponse.data.Hash,
                        cid: uploadResponse.data.Hash,
                        status: dealStatus.data?.status || 'pending'
                    }
                };
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');
                console.warn(`Filecoin upload attempt ${attempt} failed:`, lastError.message);
                
                if (attempt < this.MAX_RETRIES) {
                    await this.delay(this.RETRY_DELAY * attempt);
                }
            }
        }

        return {
            success: false,
            error: lastError?.message || 'All upload attempts failed'
        };
    }

    // Get deal status
    async getDealStatus(dealId: string): Promise<FilecoinResponse> {
        try {
            const response = await lighthouse.dealStatus(dealId);
            const dealResponse = response as unknown as LighthouseDealResponse;

            return {
                success: true,
                data: {
                    dealId,
                    status: dealResponse.data.status,
                    cid: dealResponse.data.cid
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get deal status'
            };
        }
    }

    // Get storage cost estimate
    async getStorageCost(size: number): Promise<{ success: boolean; cost?: number; error?: string }> {
        try {
            const cost = await lighthouse.getPrice(size, this.network);
            return {
                success: true,
                cost: Number(cost) // Convert bigint to number
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get storage cost'
            };
        }
    }
}

export const filecoinStorage = new FilecoinStorageService(); 