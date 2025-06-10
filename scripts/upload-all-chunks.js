const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const FILE_PATH = process.argv[2];
const FILE_ID = process.argv[3];
const TOKEN = process.argv[4];

if (!FILE_PATH || !FILE_ID || !TOKEN) {
    console.error('Usage: node upload-all-chunks.js <file_path> <file_id> <token>');
    process.exit(1);
}

async function calculateChunkHash(chunk) {
    return crypto.createHash('sha256').update(chunk).digest('hex');
}

async function uploadChunk(chunk, chunkIndex, hash) {
    const formData = new FormData();
    formData.append('chunk', chunk, {
        filename: `chunk_${chunkIndex}`,
        contentType: 'application/octet-stream'
    });
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('hash', hash);

    try {
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
        return response.data;
    } catch (error) {
        console.error(`Error uploading chunk ${chunkIndex}:`, error.response?.data || error.message);
        throw error;
    }
}

async function processFile() {
    try {
        const fileStats = fs.statSync(FILE_PATH);
        const totalChunks = Math.ceil(fileStats.size / CHUNK_SIZE);
        console.log(`File size: ${fileStats.size} bytes`);
        console.log(`Total chunks: ${totalChunks}`);

        const fileStream = fs.createReadStream(FILE_PATH);
        let chunkIndex = 0;
        let buffer = Buffer.alloc(0);

        for await (const chunk of fileStream) {
            buffer = Buffer.concat([buffer, chunk]);

            while (buffer.length >= CHUNK_SIZE) {
                const chunkData = buffer.slice(0, CHUNK_SIZE);
                buffer = buffer.slice(CHUNK_SIZE);

                const hash = await calculateChunkHash(chunkData);
                console.log(`\nUploading chunk ${chunkIndex}...`);
                
                const result = await uploadChunk(chunkData, chunkIndex, hash);
                console.log(`Chunk ${chunkIndex} uploaded:`, result);

                chunkIndex++;
            }
        }

        // Upload the last chunk if there's any remaining data
        if (buffer.length > 0) {
            const hash = await calculateChunkHash(buffer);
            console.log(`\nUploading final chunk ${chunkIndex}...`);
            
            const result = await uploadChunk(buffer, chunkIndex, hash);
            console.log(`Final chunk uploaded:`, result);
        }

        console.log('\nAll chunks uploaded successfully!');
    } catch (error) {
        console.error('Error processing file:', error);
        process.exit(1);
    }
}

processFile(); 
 