const path = require('path');
const filecoinStorage = require('../src/services/filecoinStorage');

async function testImageUpload() {
    try {
        // Path to the image file
        const imagePath = path.join(__dirname, '..', 'Hero Section.png');

        console.log('Uploading image to Filecoin...');
        const uploadResult = await filecoinStorage.storeWithLighthouse(imagePath);
        
        if (uploadResult.success) {
            console.log('Upload successful!');
            console.log('Image data:', uploadResult.data);
            
            // Get the CID - Fixed the access to Hash
            const cid = uploadResult.data.data.Hash;
            console.log('\nYour image is accessible at:');
            console.log(`IPFS Gateway: https://ipfs.io/ipfs/${cid}`);
            console.log(`Lighthouse Gateway: https://gateway.lighthouse.storage/ipfs/${cid}`);

            // Get deal status
            console.log('\nChecking deal status...');
            const statusResult = await filecoinStorage.getDealStatus(cid);
            
            if (statusResult.success) {
                console.log('Deal status:', statusResult.status);
            } else {
                console.error('Failed to get deal status:', statusResult.error);
            }
        } else {
            console.error('Upload failed:', uploadResult.error);
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testImageUpload(); 
 
 
 