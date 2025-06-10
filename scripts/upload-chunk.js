const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');

const CHUNK_SIZE = 1024 * 1024; // 1MB
const FILE_ID = '6847c160ed97124201ddb269';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTQ1NDQzMywiZXhwIjoxNzQ5NTQwODMzfQ.wmCOfR7Go0nFbovcAg0yvL6KRJYSwpUQf-bdCS5FGzY';

async function uploadChunk(filePath, chunkIndex) {
    try {
        // Read the file
        const fileBuffer = fs.readFileSync(filePath);
        const fileSize = fileBuffer.length;
        
        // Calculate chunk boundaries
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileSize);
        
        // Extract chunk
        const chunk = fileBuffer.slice(start, end);
        
        // Calculate hash
        const hash = crypto.createHash('sha256').update(chunk).digest('hex');
        
        // Create form data
        const formData = new FormData();
        formData.append('chunk', chunk, {
            filename: `chunk_${chunkIndex}`,
            contentType: 'application/octet-stream'
        });
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('hash', hash);
        
        // Upload chunk
        const response = await axios.post(
            `http://localhost:5000/api/files/chunk/${FILE_ID}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${TOKEN}`
                }
            }
        );
        
        console.log(`Chunk ${chunkIndex} uploaded successfully:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error uploading chunk ${chunkIndex}:`, error.response?.data || error.message);
        throw error;
    }
}

// Get file path and chunk index from command line arguments
const filePath = process.argv[2];
const chunkIndex = parseInt(process.argv[3]);

if (!filePath || isNaN(chunkIndex)) {
    console.error('Usage: node upload-chunk.js <file-path> <chunk-index>');
    process.exit(1);
}

uploadChunk(filePath, chunkIndex).catch(console.error); 