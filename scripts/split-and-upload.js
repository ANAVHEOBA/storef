const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const CHUNK_SIZE = 1024 * 1024; // 1MB
const FILE_ID = '6847c160ed97124201ddb269';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTQ1NDQzMywiZXhwIjoxNzQ5NTQwODMzfQ.wmCOfR7Go0nFbovcAg0yvL6KRJYSwpUQf-bdCS5FGzY';

async function splitAndUploadFile(filePath) {
    try {
        const fileSize = fs.statSync(filePath).size;
        const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
        console.log(`Splitting file into ${totalChunks} chunks...`);

        const fileStream = fs.createReadStream(filePath);
        let chunkIndex = 0;
        let buffer = Buffer.alloc(0);

        for await (const chunk of fileStream) {
            buffer = Buffer.concat([buffer, chunk]);

            while (buffer.length >= CHUNK_SIZE) {
                const chunkData = buffer.slice(0, CHUNK_SIZE);
                buffer = buffer.slice(CHUNK_SIZE);

                // Calculate hash for the chunk
                const hash = crypto.createHash('sha256').update(chunkData).digest('hex');

                // Upload chunk
                await uploadChunk(chunkIndex, chunkData, hash);
                console.log(`Uploaded chunk ${chunkIndex + 1}/${totalChunks}`);

                chunkIndex++;
            }
        }

        // Upload remaining data if any
        if (buffer.length > 0) {
            const hash = crypto.createHash('sha256').update(buffer).digest('hex');
            await uploadChunk(chunkIndex, buffer, hash);
            console.log(`Uploaded final chunk ${chunkIndex + 1}/${totalChunks}`);
        }

        console.log('File upload completed successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function uploadChunk(chunkIndex, chunkData, hash) {
    const formData = new FormData();
    formData.append('chunk', chunkData, {
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
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.error || 'Upload failed');
        }

        return response.data;
    } catch (error) {
        throw new Error(`Failed to upload chunk ${chunkIndex}: ${error.message}`);
    }
}

// Get file path from command line argument
const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide the file path');
    process.exit(1);
}

splitAndUploadFile(filePath); 
 
 
 
 
 
 
 
 
 
 