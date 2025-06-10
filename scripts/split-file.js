const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const CHUNK_SIZE = 1024 * 1024; // 1MB

function splitFile(inputFile) {
    const fileSize = fs.statSync(inputFile).size;
    const chunks = Math.ceil(fileSize / CHUNK_SIZE);
    const chunkDir = path.join(__dirname, '../chunks');
    
    // Create chunks directory if it doesn't exist
    if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir);
    }

    const fileStream = fs.createReadStream(inputFile);
    let chunkIndex = 0;
    let chunkData = Buffer.alloc(0);

    fileStream.on('data', (data) => {
        chunkData = Buffer.concat([chunkData, data]);
        
        while (chunkData.length >= CHUNK_SIZE) {
            const chunk = chunkData.slice(0, CHUNK_SIZE);
            chunkData = chunkData.slice(CHUNK_SIZE);
            
            // Calculate hash
            const hash = crypto.createHash('sha256').update(chunk).digest('hex');
            
            // Save chunk
            const chunkPath = path.join(chunkDir, `chunk_${chunkIndex}`);
            fs.writeFileSync(chunkPath, chunk);
            
            console.log(`Chunk ${chunkIndex} saved with hash: ${hash}`);
            chunkIndex++;
        }
    });

    fileStream.on('end', () => {
        if (chunkData.length > 0) {
            // Save last chunk
            const hash = crypto.createHash('sha256').update(chunkData).digest('hex');
            const chunkPath = path.join(chunkDir, `chunk_${chunkIndex}`);
            fs.writeFileSync(chunkPath, chunkData);
            console.log(`Chunk ${chunkIndex} saved with hash: ${hash}`);
        }
        console.log(`File split into ${chunkIndex + 1} chunks`);
    });
}

// Get input file from command line argument
const inputFile = process.argv[2];
if (!inputFile) {
    console.error('Please provide input file path');
    process.exit(1);
}

splitFile(inputFile); 
 
 
 