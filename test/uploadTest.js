const fs = require('fs');
const path = require('path');
const filecoinStorage = require('../src/services/filecoinStorage');

async function testUpload() {
    try {
        // Create a test file
        const testFilePath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(testFilePath, 'This is a test file for Filecoin storage');

        console.log('Uploading test file to Filecoin...');
        const uploadResult = await filecoinStorage.storeWithLighthouse(testFilePath);
        
        if (uploadResult.success) {
            console.log('Upload successful!');
            console.log('File data:', uploadResult.data);

            // Get deal status
            console.log('\nChecking deal status...');
            const statusResult = await filecoinStorage.getDealStatus(uploadResult.data.Hash);
            
            if (statusResult.success) {
                console.log('Deal status:', statusResult.status);
            } else {
                console.error('Failed to get deal status:', statusResult.error);
            }
        } else {
            console.error('Upload failed:', uploadResult.error);
        }

        // Clean up test file
        fs.unlinkSync(testFilePath);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testUpload(); 
 
 
 
 
 
 
 
 
 
 