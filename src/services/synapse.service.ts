import { Synapse, RPC_URLS, TOKENS, CONTRACT_ADDRESSES } from '@filoz/synapse-sdk';
import { config } from '../config';
import fs from 'fs';
import { ethers } from 'ethers';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * A one-time check to ensure the Pandora service is approved.
 * This should be called once when the application starts.
 */
export async function ensureSynapseServiceApproval() {
    console.log('Checking Synapse service approval...');
    if (!config.ethPrivateKey) {
        throw new Error('ETH_PRIVATE_KEY is not configured for Synapse service approval.');
    }

    // Create a temporary instance just for the approval check
    const synapse = await Synapse.create({
        privateKey: config.ethPrivateKey,
        rpcURL: RPC_URLS.calibration.websocket,
    });

    const pandoraAddress = CONTRACT_ADDRESSES.PANDORA_SERVICE[synapse.getNetwork()];
    const approval = await synapse.payments.serviceApproval(pandoraAddress, TOKENS.USDFC);

    if (approval.rateAllowance < ethers.parseUnits('1', 18)) {
        console.log(`Approving Pandora service at ${pandoraAddress}...`);
        const approveTx = await synapse.payments.approveService(
            pandoraAddress,
            ethers.parseUnits('100', 18),
            ethers.parseUnits('10000', 18)
        );
        console.log('Service approval transaction:', approveTx.hash);
        await approveTx.wait();
        console.log('Service approval confirmed. Waiting 30s for network sync...');
        await delay(30000);
        console.log('Network synced. Service is ready.');
    } else {
        console.log('Synapse service already approved.');
    }
}

/**
 * Uploads a single file to Synapse by creating a fresh instance each time.
 */
export async function uploadFileToSynapse(filePath: string): Promise<{ commp: string; cdnUrl: string }> {
    if (!config.ethPrivateKey || !config.ethAddress) {
        throw new Error('Ethereum credentials are not configured for Synapse upload.');
    }

    try {
        console.log(`Creating fresh Synapse instance for: ${filePath}`);
        // Create a new, clean instance for every upload to avoid state conflicts
        const synapse = await Synapse.create({
            privateKey: config.ethPrivateKey,
            rpcURL: RPC_URLS.calibration.websocket,
            withCDN: true
        });

        const fileData = fs.readFileSync(filePath);
        const storage = await synapse.createStorage({ withCDN: true });
        const { commp } = await storage.upload(fileData);
        
        const cdnUrl = `https://${config.ethAddress}.calibration.filcdn.io/${commp}`;
        console.log(`Upload successful for ${filePath}. CDN URL: ${cdnUrl}`);
        
        return { commp, cdnUrl };

    } catch (error: unknown) {
        console.error(`Error uploading ${filePath} to Synapse:`, error);
        throw new Error(`Failed to upload ${filePath}.`);
    }
} 