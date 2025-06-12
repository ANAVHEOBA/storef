import { Synapse, RPC_URLS, TOKENS } from '@filoz/synapse-sdk';
import { config } from '../config';
import fs from 'fs';
import { ethers } from 'ethers';

let synapseInstance: Synapse | null = null;

async function getSynapseInstance() {
    if (synapseInstance) {
        return synapseInstance;
    }

    if (!config.ethPrivateKey) {
        throw new Error('ETH_PRIVATE_KEY is not configured in the environment variables.');
    }

    const synapse = await Synapse.create({
        privateKey: config.ethPrivateKey,
        rpcURL: RPC_URLS.calibration.websocket, // Or make this configurable
        withCDN: true
    });
    
    // Check and deposit funds if needed (simplified for service)
    const balance = await synapse.payments.balance(TOKENS.USDFC);
    if (balance < ethers.parseUnits('1', 18)) {
        console.warn('Synapse wallet balance is low. Please top up.');
        // In a real app, you might have automated deposits or alerts
    }

    synapseInstance = synapse;
    return synapseInstance;
}

export async function uploadFileToSynapse(filePath: string): Promise<{ commp: string; cdnUrl: string }> {
    try {
        console.log(`Starting Synapse upload for: ${filePath}`);
        const synapse = await getSynapseInstance();

        // Read file from the provided path
        const fileData = fs.readFileSync(filePath);
        console.log(`File read: ${filePath} (${fileData.length} bytes)`);

        // Create storage and upload
        console.log('Creating storage and uploading to Synapse...');
        const storage = await synapse.createStorage({
            withCDN: true,
        });

        const { commp } = await storage.upload(fileData);
        console.log('Synapse upload successful!');
        console.log('Piece CID (commp):', commp);
        
        const cdnUrl = `https://${config.ethAddress}.calibration.filcdn.io/${commp}`;
        console.log('CDN URL:', cdnUrl);

        return { commp, cdnUrl };

    } catch (error: unknown) {
        console.error(`Error uploading ${filePath} to Synapse:`, error);
        if (error instanceof Error && error.cause) {
            console.error('Caused by:', error.cause);
        }
        throw new Error(`Failed to upload file to Synapse. Reason: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
} 