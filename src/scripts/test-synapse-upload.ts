import { Synapse, RPC_URLS, TOKENS, CONTRACT_ADDRESSES } from '@filoz/synapse-sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';

dotenv.config();

// Configuration
const config = {
    privateKey: process.env.ETH_PRIVATE_KEY,
    rpcURL: RPC_URLS.calibration.websocket,
    withCDN: true
};

// Test file path
const TEST_FILE_PATH = path.join(process.cwd(), '8432041-uhd_2160_4096_25fps.mp4');

// Provider configuration
const PROVIDER_ADDRESS = '0xe9bc394383B67aBcEbe86FD9843F53d8B4a2E981';

interface Provider {
    owner: string;
    pdpUrl: string;
}

interface ProofSetInfo {
    proofSetId: number;
    isExisting: boolean;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function testUpload() {
    try {
        console.log('Starting upload test...');

        // Initialize Synapse
        const synapse = await Synapse.create({
            privateKey: config.privateKey,
            rpcURL: config.rpcURL,
            withCDN: config.withCDN
        });

        console.log('Synapse initialized');

        // Check and deposit funds if needed
        const balance = await synapse.payments.balance(TOKENS.USDFC);
        console.log('Current USDFC balance:', ethers.formatUnits(balance, 18));

        if (balance < ethers.parseUnits('1', 18)) {
            console.log('Depositing funds...');
            const depositAmount = ethers.parseUnits('10', 18); // 10 USDFC
            const depositTx = await synapse.payments.deposit(depositAmount, TOKENS.USDFC);
            console.log('Deposit transaction:', depositTx.hash);
            await depositTx.wait();
            console.log('Deposit confirmed');
        }

        // Approve Pandora service
        const pandoraAddress = CONTRACT_ADDRESSES.PANDORA_SERVICE[synapse.getNetwork()];
        console.log(`Approving Pandora service at ${pandoraAddress}...`);
        const approveTx = await synapse.payments.approveService(
            pandoraAddress,
            ethers.parseUnits('100', 18), // 100 USDFC per epoch rate allowance
            ethers.parseUnits('10000', 18) // 10000 USDFC lockup allowance
        );
        console.log('Service approval transaction:', approveTx.hash);
        await approveTx.wait();
        console.log('Service approval confirmed.');

        console.log('Waiting for 30 seconds for network to sync...');
        await delay(30000);
        console.log('Continuing...');


        // Verify approval
        const newApproval = await synapse.payments.serviceApproval(pandoraAddress, TOKENS.USDFC);
        console.log('New approval status:', newApproval);

        // Read file
        const fileData = fs.readFileSync(TEST_FILE_PATH);
        console.log(`File read: ${TEST_FILE_PATH}`);
        console.log(`File size: ${fileData.length} bytes`);

        // Create storage and upload
        console.log('Creating storage and uploading file...');
        const storage = await synapse.createStorage({
            providerAddress: PROVIDER_ADDRESS,
            withCDN: true,
            callbacks: {
                onProviderSelected: (provider: Provider) => {
                    console.log(`Selected provider: ${provider.owner}`);
                },
                onProofSetResolved: (info: ProofSetInfo) => {
                    console.log(`Using proof set: ${info.proofSetId}`);
                }
            }
        });

        const { commp } = await storage.upload(fileData);
        console.log('Upload successful!');
        console.log('Piece CID (commp):', commp);

        // Construct CDN URL
        const cdnUrl = `https://${process.env.ETH_ADDRESS}.calibration.filcdn.io/${commp}`;
        console.log('CDN URL:', cdnUrl);

        // Try downloading to verify
        console.log('Verifying download...');
        const downloadedFile = await storage.download(commp);
        console.log('Download verification successful!');

        return {
            success: true,
            commp,
            cdnUrl,
            fileSize: fileData.length
        };

    } catch (error: unknown) {
        console.error('Error during upload test:', error);
        if (error instanceof Error && error.cause) {
            console.error('Caused by:', error.cause);
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

// Run the test
testUpload()
    .then(result => {
        console.log('\nTest Results:', result);
        process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
    }); 