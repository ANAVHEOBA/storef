import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
    // JWT Configuration
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

    // Server Configuration
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // MongoDB Configuration
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/storef',

    // File Upload Configuration
    maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
    chunkSize: 1024 * 1024, // 1MB
    maxChunkSize: 50 * 1024 * 1024, // 50MB

    // Email Configuration
    emailService: process.env.EMAIL_SERVICE || 'gmail',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,

    // IPFS/Pinata Configuration
    pinataApiKey: process.env.PINATA_API_KEY || '',
    pinataSecretKey: process.env.PINATA_SECRET_KEY || '',
    ipfsStorageLimit: parseInt(process.env.IPFS_STORAGE_LIMIT || '1073741824') // 1GB default
}; 