import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
    // JWT Configuration
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

    // Server Configuration
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // MongoDB Configuration
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/storef',

    // Ethereum Configuration
    ethPrivateKey: process.env.ETH_PRIVATE_KEY,
    ethAddress: process.env.ETH_ADDRESS,

    // File Upload Configuration
    maxFileSize: 1024 * 1024 * 1024, // 1GB
    chunkSize: 1024 * 1024 * 10, // 10MB
    maxChunkSize: 1024 * 1024 * 50, // 50MB

    // Email Configuration
    emailService: process.env.EMAIL_SERVICE || 'gmail',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    emailFrom: process.env.EMAIL_FROM,

    // IPFS Configuration
    ipfsApiKey: process.env.IPFS_API_KEY,
    ipfsApiSecret: process.env.IPFS_API_SECRET,
    ipfsGateway: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
    ipfsStorageLimit: 1024 * 1024 * 1024 * 5, // 5GB

    // Pinata Configuration
    pinataApiKey: process.env.PINATA_API_KEY || '',
    pinataSecretKey: process.env.PINATA_SECRET_KEY || '',
    pinataJWT: process.env.PINATA_JWT || '',
}; 
 