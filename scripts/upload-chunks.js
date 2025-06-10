const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const CHUNK_DIR = path.join(__dirname, '../chunks');
const FILE_ID = '6847c160ed97124201ddb269'; // Replace with your file ID
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTQ1NDQzMywiZXhwIjoxNzQ5NTQwODMzfQ.wmCOfR7Go0nFbovcAg0yvL6KRJYSwpUQf-bdCS5FGzY';

async function uploadChunk(chunkIndex) {
    const chunkPath = path.join(CHUNK_DIR, `chunk_${chunkIndex}`);
    const chunkData = fs.readFileSync(chunkPath);
    
    // Calculate hash
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(chunkData).digest('hex');
    
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

async function uploadAllChunks() {
    const files = fs.readdirSync(CHUNK_DIR);
    const chunks = files.filter(f => f.startsWith('chunk_')).length;
    
    console.log(`Found ${chunks} chunks to upload`);
    
    for (let i = 0; i < chunks; i++) {
        console.log(`Uploading chunk ${i}...`);
        await uploadChunk(i);
        // Add a small delay between chunks
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('All chunks uploaded successfully');
}

uploadAllChunks().catch(console.error); 
 
 
 
 
 
 
 
 
 