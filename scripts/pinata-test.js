const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
require('dotenv').config();

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

const filePath = process.argv[2] || './test.txt';

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const readableStreamForFile = fs.createReadStream(filePath);
const fileName = require('path').basename(filePath);

pinata.pinFileToIPFS(readableStreamForFile, {
    pinataMetadata: { name: fileName }
})
    .then((result) => {
        console.log('Upload successful:', result);
    })
    .catch((err) => {
        console.error('Upload failed:', err);
    });